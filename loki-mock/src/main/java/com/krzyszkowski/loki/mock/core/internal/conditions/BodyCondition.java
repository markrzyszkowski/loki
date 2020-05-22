package com.krzyszkowski.loki.mock.core.internal.conditions;

import com.krzyszkowski.loki.api.mock.Condition;
import com.krzyszkowski.loki.api.mock.Request;
import org.springframework.http.server.ServletServerHttpRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.util.function.Predicate;

public class BodyCondition implements Predicate<HttpServletRequest> {

    private final String body;
    private final Condition bodyCondition;
    private final boolean bodyIgnoreCase;
    private final boolean bodyIgnoreWhitespace;

    public BodyCondition(Request request) {
        this.body = request.getBody();
        this.bodyCondition = request.getBodyCondition();
        this.bodyIgnoreCase = request.isBodyIgnoreCase();
        this.bodyIgnoreWhitespace = request.isBodyIgnoreWhitespace();
    }

    @Override
    public boolean test(HttpServletRequest httpServletRequest) {
        try {
            var bodyInputStream = new ServletServerHttpRequest(httpServletRequest).getBody();

            switch (bodyCondition) {
                case PRESENT:
                    return bodyPresent(bodyInputStream);
                case NOT_PRESENT:
                    return !bodyPresent(bodyInputStream);
                case EQUAL:
                    return bodyEquals(bodyInputStream);
                case NOT_EQUAL:
                    return !bodyEquals(bodyInputStream);
                case CONTAINS:
                    return bodyContains(bodyInputStream);
                case NOT_CONTAINS: {
                    return !bodyContains(bodyInputStream);
                }
                default:
                    return false;
            }
        } catch (IOException e) {
            return false;
        }
    }

    private boolean bodyPresent(InputStream bodyInputStream) {
        try {
            return bodyInputStream.read() != -1;
        } catch (IOException e) {
            return false;
        }
    }

    private boolean bodyEquals(InputStream bodyInputStream) {
        try {
            var bodyString = new String(bodyInputStream.readAllBytes());
            var requestBody = body;

            if (bodyIgnoreWhitespace) {
                bodyString = bodyString.replaceAll("\\s", "");
                requestBody = requestBody.replaceAll("\\s", "");
            }

            return bodyIgnoreCase
                    ? bodyString.equalsIgnoreCase(requestBody)
                    : bodyString.equals(requestBody);
        } catch (IOException e) {
            return false;
        }
    }

    private boolean bodyContains(InputStream bodyInputStream) {
        try {
            var bodyString = new String(bodyInputStream.readAllBytes());
            var requestBody = body;

            if (bodyIgnoreWhitespace) {
                bodyString = bodyString.replaceAll("\\s", "");
                requestBody = requestBody.replaceAll("\\s", "");
            }

            return bodyIgnoreCase
                    ? bodyString.toLowerCase().contains(requestBody.toLowerCase())
                    : bodyString.contains(requestBody);
        } catch (IOException e) {
            return false;
        }
    }
}
