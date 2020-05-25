package com.krzyszkowski.loki.mock.core.internal.conditions;

import com.krzyszkowski.loki.api.mock.Condition;
import com.krzyszkowski.loki.api.mock.Request;

import javax.servlet.http.HttpServletRequest;
import java.util.function.Predicate;

public class MethodCondition implements Predicate<HttpServletRequest> {

    private final String method;
    private final Condition methodCondition;

    public MethodCondition(Request request) {
        this.method = request.getMethod();
        this.methodCondition = request.getMethodCondition();
    }

    @Override
    public boolean test(HttpServletRequest httpServletRequest) {
        return (methodCondition == Condition.EQUAL) == methodEquals(httpServletRequest);
    }

    private boolean methodEquals(HttpServletRequest httpServletRequest) {
        return httpServletRequest.getMethod().equalsIgnoreCase(method);
    }
}
