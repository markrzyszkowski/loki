package com.krzyszkowski.loki.mock.core.services;

import com.krzyszkowski.loki.api.mock.Header;
import com.krzyszkowski.loki.api.mock.Response;
import com.krzyszkowski.loki.mock.core.internal.MockRepository;
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

    private final MockRepository mockRepository;
    private final ObjectFactory<RuleMatcher> ruleMatcherFactory;
    private final ProxyService proxyService;

    public ProxyMockService(MockRepository mockRepository,
                            ObjectFactory<RuleMatcher> ruleMatcherFactory,
                            ProxyService proxyService) {
        this.mockRepository = mockRepository;
        this.ruleMatcherFactory = ruleMatcherFactory;
        this.proxyService = proxyService;
    }

    @Override
    public ResponseEntity<byte[]> handle(HttpServletRequest request, HttpServletResponse response) {
        var mock = mockRepository.findMock(request.getRequestURL().toString());
        if (mock.isPresent()) {
            var rule = ruleMatcherFactory.getObject()
                                         .searchIn(mock.get().getRules())
                                         .forRuleMatching(request);
            if (rule.isPresent()) {
                var ruleResponse = rule.get().getResponse();

                populateResponse(response, ruleResponse);

                return ResponseEntity
                        .status(ruleResponse.getStatus())
                        .body(ruleResponse.getBody().getContent().getBytes());
            }
        }

        return proxyService.forward(request, response);
    }

    private void populateResponse(HttpServletResponse response, Response ruleResponse) {
        populateHeaders(response, ruleResponse.getHeaders());
    }

    private void populateHeaders(HttpServletResponse response, List<Header> headers) {
        headers.forEach(header -> response.setHeader(header.getName(), header.getValue()));
    }
}
