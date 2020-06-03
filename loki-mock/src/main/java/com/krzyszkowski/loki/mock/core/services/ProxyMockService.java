package com.krzyszkowski.loki.mock.core.services;

import com.krzyszkowski.loki.api.mock.Header;
import com.krzyszkowski.loki.api.mock.Response;
import com.krzyszkowski.loki.mock.core.internal.MockConditionRepository;
import com.krzyszkowski.loki.mock.core.internal.ResultQueueManager;
import com.krzyszkowski.loki.mock.core.internal.RuleMatcher;
import com.krzyszkowski.loki.mock.core.internal.util.ResultHelper;
import com.krzyszkowski.loki.mock.core.internal.util.UrlHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.DeferredResult;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.URL;
import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@Profile("proxy")
public class ProxyMockService implements MockService {

    private final MockConditionRepository mockConditionRepository;
    private final ObjectFactory<RuleMatcher> ruleMatcherFactory;
    private final ResultQueueManager<ResponseEntity<?>> resultQueueManager;
    private final ProxyService proxyService;

    @Value("${server.port}")
    private int port;

    public ProxyMockService(MockConditionRepository mockConditionRepository,
                            ObjectFactory<RuleMatcher> ruleMatcherFactory,
                            ResultQueueManager<ResponseEntity<?>> resultQueueManager,
                            ProxyService proxyService) {
        this.mockConditionRepository = mockConditionRepository;
        this.ruleMatcherFactory = ruleMatcherFactory;
        this.resultQueueManager = resultQueueManager;
        this.proxyService = proxyService;
    }

    @Override
    public DeferredResult<ResponseEntity<?>> handle(HttpServletRequest request, HttpServletResponse response) {
        var entryTime = Instant.now();
        var deferredResult = new DeferredResult<ResponseEntity<?>>();

        var url = sanitizeUrl(request.getRequestURL().toString());
        var mock = mockConditionRepository.findMock(url);

        if (mock.isPresent()) {
            var rule = ruleMatcherFactory.getObject()
                                         .searchIn(mock.get())
                                         .forRuleMatching(request);

            if (rule.isPresent()) {
                var ruleResponse = rule.get();

                populateResponse(response, ruleResponse);

                var result = ResponseEntity.status(ruleResponse.getStatusCode())
                                           .body(ruleResponse.getBody().getBytes());

                if (ruleResponse.isDelayResponse()) {
                    var entryTimeWithDelay = entryTime.plusMillis(ruleResponse.getDelay());

                    if (!ResultHelper.shouldReturn(entryTimeWithDelay)) {
                        resultQueueManager.submit(entryTimeWithDelay, result, deferredResult);

                        return deferredResult;
                    }
                }

                return ResultHelper.setAndReturn(result, deferredResult);
            }
        }

        if (forwardWouldCauseLoop(request)) {
            return ResultHelper.setAndReturn(ResponseEntity.status(HttpStatus.LOOP_DETECTED).build(), deferredResult);
        }

        return ResultHelper.setAndReturn(proxyService.forward(request, response), deferredResult);
    }

    private String sanitizeUrl(String url) {
        return UrlHelper.stripEmptyPath(UrlHelper.stripProtocol(url));
    }

    private void populateResponse(HttpServletResponse response, Response ruleResponse) {
        populateHeaders(response, ruleResponse.getHeaders());
    }

    private void populateHeaders(HttpServletResponse response, List<Header> headers) {
        headers.forEach(header -> response.setHeader(header.getKey(), header.getValue()));
    }

    private boolean forwardWouldCauseLoop(HttpServletRequest request) {
        try {
            var url = new URL(request.getRequestURL().toString());
            var address = InetAddress.getByName(url.getHost());

            if (address.isLoopbackAddress() || NetworkInterface.getByInetAddress(address) != null) {
                return url.getPort() == port;
            }
        } catch (IOException e) {
            log.error("Error occured while checking if forward would cause loop");
            log.error("Exception: {}", e.toString());
        }

        return false;
    }
}
