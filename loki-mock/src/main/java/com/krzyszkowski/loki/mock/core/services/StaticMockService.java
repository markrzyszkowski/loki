package com.krzyszkowski.loki.mock.core.services;

import com.krzyszkowski.loki.api.mock.Header;
import com.krzyszkowski.loki.api.mock.Response;
import com.krzyszkowski.loki.mock.core.internal.MockConditionRepository;
import com.krzyszkowski.loki.mock.core.internal.ResultQueueManager;
import com.krzyszkowski.loki.mock.core.internal.RuleMatcher;
import com.krzyszkowski.loki.mock.core.internal.util.ResultHelper;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.DeferredResult;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.Instant;
import java.util.List;

@Service
@Profile("static")
public class StaticMockService implements MockService {

    private final MockConditionRepository mockConditionRepository;
    private final ObjectFactory<RuleMatcher> ruleMatcherFactory;
    private final ResultQueueManager<ResponseEntity<?>> resultQueueManager;

    public StaticMockService(MockConditionRepository mockConditionRepository,
                             ObjectFactory<RuleMatcher> ruleMatcherFactory,
                             ResultQueueManager<ResponseEntity<?>> resultQueueManager) {
        this.mockConditionRepository = mockConditionRepository;
        this.ruleMatcherFactory = ruleMatcherFactory;
        this.resultQueueManager = resultQueueManager;
    }

    @Override
    public DeferredResult<ResponseEntity<?>> handle(HttpServletRequest request, HttpServletResponse response) {
        var entryTime = Instant.now();
        var deferredResult = new DeferredResult<ResponseEntity<?>>();

        var mock = mockConditionRepository.findMock(request.getRequestURI().substring(1)).orElseThrow();
        var rule = ruleMatcherFactory.getObject()
                                     .searchIn(mock)
                                     .forRuleMatching(request);

        if (rule.isPresent()) {
            var ruleResponse = rule.get();

            populateResponse(response, ruleResponse);

            var result = ResponseEntity
                    .status(ruleResponse.getStatusCode())
                    .body(ruleResponse.getBody() != null ? ruleResponse.getBody().getBytes() : "");

            if (ruleResponse.isDelayResponse()) {
                var entryTimeWithDelay = entryTime.plusMillis(ruleResponse.getDelay());

                if (!ResultHelper.shouldReturn(entryTimeWithDelay)) {
                    resultQueueManager.submit(entryTimeWithDelay, result, deferredResult);

                    return deferredResult;
                }
            }

            return ResultHelper.setAndReturn(result, deferredResult);
        }

        return ResultHelper.setAndReturn(ResponseEntity.status(HttpStatus.I_AM_A_TEAPOT).build(), deferredResult);
    }

    private void populateResponse(HttpServletResponse response, Response ruleResponse) {
        populateHeaders(response, ruleResponse.getHeaders());
    }

    private void populateHeaders(HttpServletResponse response, List<Header> headers) {
        headers.forEach(header -> response.setHeader(header.getKey(), header.getValue()));
    }
}
