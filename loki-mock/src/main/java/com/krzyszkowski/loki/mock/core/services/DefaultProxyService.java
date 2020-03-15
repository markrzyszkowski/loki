package com.krzyszkowski.loki.mock.core.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResponseExtractor;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Objects;

@Service
public class DefaultProxyService implements ProxyService {

    private static final Logger log = LoggerFactory.getLogger(DefaultProxyService.class);

    private final StorageService storageService;

    public DefaultProxyService(StorageService storageService) {
        this.storageService = storageService;
    }

    @Override
    public ResponseEntity<Resource> forward(HttpServletRequest request, HttpServletResponse response) {
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

    private ResponseEntity<Resource> forwardRequest(String method,
                                                    String uri,
                                                    HttpEntity<byte[]> entity,
                                                    HttpServletResponse response) {
        var restTemplate = new RestTemplate();
        var proxyResponse = Objects.requireNonNull(restTemplate.execute(uri,
                                                                        Objects.requireNonNull(HttpMethod.resolve(method)),
                                                                        restTemplate.httpEntityCallback(entity),
                                                                        responseExtractor()));

        populateResponseHeaders(response, proxyResponse.headers);

        var resource = storageService.retrieveBodyAsResource(proxyResponse.bodyPath);

        return ResponseEntity
                .status(proxyResponse.status)
                .body(resource);
    }

    private void populateResponseHeaders(HttpServletResponse response, HttpHeaders headers) {
        if (headers != null) {
            headers.forEach((name, value) -> {
                if (shouldCopyHeader(name)) {
                    response.addHeader(name, String.join(",", value));
                }
            });
        }

        if (response.getHeader("Content-Disposition") == null) {
            response.addHeader("Content-Disposition", "");
        }
    }

    private boolean shouldCopyHeader(String name) {
        return name != null && !"Transfer-Encoding".equals(name);
    }

    private ResponseExtractor<ProxyResponse> responseExtractor() {
        return response -> {
            var proxyResponse = new ProxyResponse();
            proxyResponse.status = response.getRawStatusCode();
            proxyResponse.headers = response.getHeaders();
            proxyResponse.bodyPath = storageService.storeBody(response.getBody());
            return proxyResponse;
        };
    }

    private static class ProxyResponse {

        private int status;
        private HttpHeaders headers;
        private Path bodyPath;
    }
}
