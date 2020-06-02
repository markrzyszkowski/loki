package com.krzyszkowski.loki.mock.core.internal.conditions;

import com.krzyszkowski.loki.api.mock.Request;
import com.krzyszkowski.loki.api.mock.UrlVariable;
import com.krzyszkowski.loki.mock.core.internal.util.UrlHelper;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.function.Predicate;

public class UrlCondition implements Predicate<HttpServletRequest> {

    private final String url;
    private final List<UrlVariable> urlVariables;

    public UrlCondition(String url, Request request) {
        this.url = url;
        this.urlVariables = request.getUrlVariables();
    }

    @Override
    public boolean test(HttpServletRequest httpServletRequest) {
        if (urlVariables.size() > 0) {
            var incomingUrl = sanitizeUrl(httpServletRequest.getRequestURL().toString());

            var regexUrl = url;

            for (var urlVariable : urlVariables) {
                regexUrl = regexUrl.replaceAll(String.format("\\{\\{%s\\}\\}", urlVariable.getKey()),
                                               urlVariable.getValue());
            }

            regexUrl = UrlHelper.escapeSpecialCharacters(regexUrl)
                                .replaceAll("\\\\\\{\\\\\\{.+?\\\\}\\\\}", "[^/]*");

            return incomingUrl.matches(regexUrl);
        }

        return true;
    }

    private String sanitizeUrl(String url) {
        return UrlHelper.stripEmptyPath(UrlHelper.stripProtocol(url));
    }
}
