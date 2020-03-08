package com.krzyszkowski.loki.mock.core.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;

@Service
public class DefaultProxyService implements ProxyService {

    private static final Logger log = LoggerFactory.getLogger(DefaultProxyService.class);

    @Override
    public ResponseEntity<byte[]> forward(HttpServletRequest request, HttpServletResponse response) {
        var method = request.getMethod();
        var uri = prepareUri(request);
        var entity = prepareEntity(prepareHeaders(request), prepareBody(request));

        log.info("Proxying HTTP {} for {}", method, uri);

        return forwardRequest(method, uri, entity, response);
    }

    private String prepareUri(HttpServletRequest request) {
        return UriComponentsBuilder.fromUriString(request.getRequestURL().toString())
                                   .query(request.getQueryString())
                                   .build(true)
                                   .toUriString();
    }

    private HttpHeaders prepareHeaders(HttpServletRequest request) {
        HttpHeaders headers = new HttpHeaders();

        var headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            var name = headerNames.nextElement();
            headers.set(name, request.getHeader(name));
        }

        return headers;
    }

    private byte[] prepareBody(HttpServletRequest request) {
        try {
            return request.getInputStream().readAllBytes();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private HttpEntity<byte[]> prepareEntity(HttpHeaders headers, byte[] body) {
        return new HttpEntity<>(body, headers);
    }

    private ResponseEntity<byte[]> forwardRequest(String method,
                                                  String uri,
                                                  HttpEntity<byte[]> entity,
                                                  HttpServletResponse response) {
        var exchange = new RestTemplate().exchange(uri,
                                                   Objects.requireNonNull(HttpMethod.resolve(method)),
                                                   entity,
                                                   byte[].class);

        try {
            var responseStatus = exchange.getStatusCodeValue();
            var responseHeaders = exchange.getHeaders();
            var responseBody = exchange.getBody();

            populateResponse(response, responseStatus, responseHeaders, responseBody);
        } catch (HttpStatusCodeException e) {
            var responseStatus = e.getRawStatusCode();
            var responseHeaders = e.getResponseHeaders();
            var responseBody = e.getResponseBodyAsByteArray();

            populateResponse(response, responseStatus, responseHeaders, responseBody);
        }
        return null;
    }

    private void populateResponse(HttpServletResponse response, int status, HttpHeaders headers, byte[] body) {
        response.setStatus(status);

        if (headers != null) {
            headers.forEach((name, value) -> {
                if (shouldCopyHeader(name)) {
                    response.addHeader(name, String.join(",", value));
                }
            });
        }

        if (body != null) {
            try {
                StreamUtils.copy(body, response.getOutputStream());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private boolean shouldCopyHeader(String name) {
        return name != null && !"Transfer-Encoding".equals(name);
    }
}
