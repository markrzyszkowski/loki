package com.krzyszkowski.loki.mock.core.internal.conditions;

import com.krzyszkowski.loki.api.mock.HeaderWithCondition;
import com.krzyszkowski.loki.api.mock.Request;
import org.springframework.http.server.ServletServerHttpRequest;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class HeadersCondition implements Predicate<HttpServletRequest> {

    private final List<HeaderWithCondition> headers;

    public HeadersCondition(Request request) {
        this.headers = request.getHeaders();
    }

    @Override
    public boolean test(HttpServletRequest httpServletRequest) {
        for (var header : headers) {
            var hdrs = transformTestedHeaders(new ServletServerHttpRequest(httpServletRequest).getHeaders(),
                                              header.isKeyIgnoreCase(),
                                              header.isValueIgnoreCase());

            var condition = header.getCondition();

            switch (condition) {
                case PRESENT:
                    if (!headerPresent(header, hdrs)) {
                        return false;
                    }
                    break;
                case NOT_PRESENT:
                    if (headerPresent(header, hdrs)) {
                        return false;
                    }
                    break;
                case EQUAL: {
                    if (!headerPresent(header, hdrs) || !headerEquals(header, hdrs)) {
                        return false;
                    }
                    break;
                }
                case NOT_EQUAL: {
                    if (!headerPresent(header, hdrs) || headerEquals(header, hdrs)) {
                        return false;
                    }
                    break;
                }
                case CONTAINS: {
                    if (!headerPresent(header, hdrs) || !headerContains(header, hdrs)) {
                        return false;
                    }
                    break;
                }
                case NOT_CONTAINS: {
                    if (!headerPresent(header, hdrs) || headerContains(header, hdrs)) {
                        return false;
                    }
                    break;
                }
            }
        }

        return true;
    }

    private Map<String, List<String>> transformTestedHeaders(Map<String, List<String>> tested,
                                                             boolean keyIgnoreCase,
                                                             boolean valueIgnoreCase) {
        return tested.entrySet()
                     .stream()
                     .collect(Collectors.toMap(
                             entry -> keyIgnoreCase
                                     ? entry.getKey().toLowerCase()
                                     : entry.getKey(),
                             entry -> valueIgnoreCase
                                     ? entry.getValue().stream()
                                            .map(String::toLowerCase)
                                            .collect(Collectors.toList())
                                     : entry.getValue()));
    }

    private boolean headerPresent(HeaderWithCondition header, Map<String, List<String>> tested) {
        var key = header.getKey();

        return header.isKeyIgnoreCase()
               && tested.get(key.toLowerCase()) != null
               || tested.get(key) != null;
    }

    private boolean headerEquals(HeaderWithCondition header, Map<String, List<String>> tested) {
        var key = header.getKey();
        var value = header.getValue();
        var keyIgnoreCase = header.isKeyIgnoreCase();
        var valueIgnoreCase = header.isValueIgnoreCase();

        if (keyIgnoreCase && valueIgnoreCase) {
            return tested.get(key.toLowerCase()).contains(value.toLowerCase());
        } else if (keyIgnoreCase) {
            return tested.get(key.toLowerCase()).contains(value);
        } else if (valueIgnoreCase) {
            return tested.get(key).contains(value.toLowerCase());
        } else {
            return tested.get(key).contains(value);
        }
    }

    private boolean headerContains(HeaderWithCondition header, Map<String, List<String>> tested) {
        var key = header.getKey();
        var value = header.getValue();
        var keyIgnoreCase = header.isKeyIgnoreCase();
        var valueIgnoreCase = header.isValueIgnoreCase();

        if (keyIgnoreCase && valueIgnoreCase) {
            return tested.get(key.toLowerCase())
                         .stream()
                         .anyMatch(val -> val.toLowerCase().contains(value.toLowerCase()));
        } else if (keyIgnoreCase) {
            return tested.get(key.toLowerCase())
                         .stream()
                         .anyMatch(val -> val.contains(value));
        } else if (valueIgnoreCase) {
            return tested.get(key)
                         .stream()
                         .anyMatch(val -> val.toLowerCase().contains(value.toLowerCase()));
        } else {
            return tested.get(key)
                         .stream()
                         .anyMatch(val -> val.contains(value));
        }
    }
}
