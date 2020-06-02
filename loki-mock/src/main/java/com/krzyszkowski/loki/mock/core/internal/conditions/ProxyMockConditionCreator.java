package com.krzyszkowski.loki.mock.core.internal.conditions;

import com.krzyszkowski.loki.api.mock.Mock;
import com.krzyszkowski.loki.api.mock.Response;
import com.krzyszkowski.loki.api.mock.Rule;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Component
@Profile("proxy")
public class ProxyMockConditionCreator implements MockConditionCreator {

    public Map<Predicate<HttpServletRequest>, Response> create(Mock mock) {
        return mock.getRules()
                   .stream()
                   .collect(Collectors.toMap(rule -> {
                       var request = rule.getRequest();

                       return new UrlCondition(mock.getUrl(), request)
                               .and(new MethodCondition(request))
                               .and(new ParametersCondition(request))
                               .and(new HeadersCondition(request))
                               .and(new BodyCondition(request));
                   }, Rule::getResponse));
    }
}
