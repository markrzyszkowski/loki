package com.krzyszkowski.loki.mock.core.services;

import com.krzyszkowski.loki.api.mock.Header;
import com.krzyszkowski.loki.api.mock.Response;
import com.krzyszkowski.loki.mock.core.internal.MockConditionRepository;
import com.krzyszkowski.loki.mock.core.internal.RuleMatcher;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Service
@Profile("static")
public class StaticMockService implements MockService {

    private final MockConditionRepository mockConditionRepository;
    private final ObjectFactory<RuleMatcher> ruleMatcherFactory;

    public StaticMockService(MockConditionRepository mockConditionRepository,
                             ObjectFactory<RuleMatcher> ruleMatcherFactory) {
        this.mockConditionRepository = mockConditionRepository;
        this.ruleMatcherFactory = ruleMatcherFactory;
    }

    @Override
    public ResponseEntity<byte[]> handle(HttpServletRequest request, HttpServletResponse response) {
        var mock = mockConditionRepository.findMock(request.getRequestURI().substring(1)).orElseThrow();

        var rule = ruleMatcherFactory.getObject()
                                     .searchIn(mock)
                                     .forRuleMatching(request);
        if (rule.isPresent()) {
            var ruleResponse = rule.get();

            populateResponse(response, ruleResponse);

            return ResponseEntity
                    .status(ruleResponse.getStatusCode())
                    .body(ruleResponse.getBody().getBytes());
        }

        return ResponseEntity
                .status(HttpStatus.I_AM_A_TEAPOT)
                .build();
    }

    private void populateResponse(HttpServletResponse response, Response ruleResponse) {
        populateHeaders(response, ruleResponse.getHeaders());
    }

    private void populateHeaders(HttpServletResponse response, List<Header> headers) {
        headers.forEach(header -> response.setHeader(header.getKey(), header.getValue()));
    }
}
