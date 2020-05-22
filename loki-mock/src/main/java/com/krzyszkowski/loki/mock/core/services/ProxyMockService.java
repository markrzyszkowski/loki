package com.krzyszkowski.loki.mock.core.services;

import com.krzyszkowski.loki.api.mock.Header;
import com.krzyszkowski.loki.api.mock.Response;
import com.krzyszkowski.loki.mock.core.internal.MockConditionRepository;
import com.krzyszkowski.loki.mock.core.internal.RuleMatcher;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Service
@Profile("proxy")
public class ProxyMockService implements MockService {

    private final MockConditionRepository mockConditionRepository;
    private final ObjectFactory<RuleMatcher> ruleMatcherFactory;
    private final ProxyService proxyService;

    public ProxyMockService(MockConditionRepository mockConditionRepository,
                            ObjectFactory<RuleMatcher> ruleMatcherFactory,
                            ProxyService proxyService) {
        this.mockConditionRepository = mockConditionRepository;
        this.ruleMatcherFactory = ruleMatcherFactory;
        this.proxyService = proxyService;
    }

    @Override
    public ResponseEntity<?> handle(HttpServletRequest request, HttpServletResponse response) {
        var url = request.getRequestURL().toString();

        if (url.startsWith("http://")) {
            url = url.replaceFirst("http://", "");
        } else if (url.startsWith("https://")) {
            url = url.replaceFirst("https://", "");
        }

        var mock = mockConditionRepository.findMock(url);

        if (mock.isEmpty() && url.endsWith("/")) {
            mock = mockConditionRepository.findMock(url.substring(0, url.length() - 1));
        }

        if (mock.isPresent()) {
            var rule = ruleMatcherFactory.getObject()
                                         .searchIn(mock.get())
                                         .forRuleMatching(request);

            if (rule.isPresent()) {
                var ruleResponse = rule.get();

                populateResponse(response, ruleResponse);

                return ResponseEntity
                        .status(ruleResponse.getStatusCode())
                        .body(ruleResponse.getBody().getBytes());
            }
        }

        return proxyService.forward(request, response);
    }

    private void populateResponse(HttpServletResponse response, Response ruleResponse) {
        populateHeaders(response, ruleResponse.getHeaders());
    }

    private void populateHeaders(HttpServletResponse response, List<Header> headers) {
        headers.forEach(header -> response.setHeader(header.getKey(), header.getValue()));
    }
}
