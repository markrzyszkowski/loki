package com.krzyszkowski.loki.mock.core.internal.conditions;

import com.krzyszkowski.loki.api.mock.ParameterWithCondition;
import com.krzyszkowski.loki.api.mock.Request;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class ParametersCondition implements Predicate<HttpServletRequest> {

    private final List<ParameterWithCondition> parameters;

    public ParametersCondition(Request request) {
        this.parameters = request.getParameters();
    }

    @Override
    public boolean test(HttpServletRequest httpServletRequest) {
        for (var parameter : parameters) {
            var prms = transformTestedParameters(httpServletRequest.getParameterMap(),
                                                 parameter.isKeyIgnoreCase(),
                                                 parameter.isValueIgnoreCase());

            var condition = parameter.getCondition();

            switch (condition) {
                case PRESENT:
                    if (!parameterPresent(parameter, prms)) {
                        return false;
                    }
                    break;
                case NOT_PRESENT:
                    if (parameterPresent(parameter, prms)) {
                        return false;
                    }
                    break;
                case EQUAL: {
                    if (!parameterPresent(parameter, prms) || !parameterEquals(parameter, prms)) {
                        return false;
                    }
                    break;
                }
                case NOT_EQUAL: {
                    if (!parameterPresent(parameter, prms) || parameterEquals(parameter, prms)) {
                        return false;
                    }
                    break;
                }
                case CONTAINS: {
                    if (!parameterPresent(parameter, prms) || !parameterContains(parameter, prms)) {
                        return false;
                    }
                    break;
                }
                case NOT_CONTAINS: {
                    if (!parameterPresent(parameter, prms) || parameterContains(parameter, prms)) {
                        return false;
                    }
                    break;
                }
            }
        }

        return true;
    }

    private Map<String, List<String>> transformTestedParameters(Map<String, String[]> tested,
                                                                boolean keyIgnoreCase,
                                                                boolean valueIgnoreCase) {
        return tested.entrySet()
                     .stream()
                     .collect(Collectors.toMap(
                             entry -> keyIgnoreCase
                                     ? entry.getKey().toLowerCase()
                                     : entry.getKey(),
                             entry -> valueIgnoreCase
                                     ? Arrays.stream(entry.getValue())
                                             .map(String::toLowerCase)
                                             .collect(Collectors.toList())
                                     : Arrays.asList(entry.getValue())));
    }

    private boolean parameterPresent(ParameterWithCondition parameter, Map<String, List<String>> tested) {
        var key = parameter.getKey();

        return parameter.isKeyIgnoreCase()
               && tested.get(key.toLowerCase()) != null
               || tested.get(key) != null;
    }

    private boolean parameterEquals(ParameterWithCondition parameter, Map<String, List<String>> tested) {
        var key = parameter.getKey();
        var value = parameter.getValue();
        var keyIgnoreCase = parameter.isKeyIgnoreCase();
        var valueIgnoreCase = parameter.isValueIgnoreCase();

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

    private boolean parameterContains(ParameterWithCondition parameter, Map<String, List<String>> tested) {
        var key = parameter.getKey();
        var value = parameter.getValue();
        var keyIgnoreCase = parameter.isKeyIgnoreCase();
        var valueIgnoreCase = parameter.isValueIgnoreCase();

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
