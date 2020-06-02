package com.krzyszkowski.loki.mock.core.internal;

import com.krzyszkowski.loki.api.mock.Response;
import com.krzyszkowski.loki.mock.core.internal.util.UrlHelper;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Predicate;

@Repository
@Profile("proxy")
public class ProxyMockConditionRepository implements MockConditionRepository {

    private final Map<String, Map<Predicate<HttpServletRequest>, Response>> repository = new HashMap<>();

    @Override
    public void addMock(String url, Map<Predicate<HttpServletRequest>, Response> mock) {
        repository.put(transformUrl(url), mock);
    }

    @Override
    public Optional<Map<Predicate<HttpServletRequest>, Response>> findMock(String url) {
        for (var entry : repository.entrySet()) {
            if (url.matches(entry.getKey())) {
                return Optional.of(entry.getValue());
            }
        }

        return Optional.empty();
    }

    private String transformUrl(String url) {
        return UrlHelper.escapeSpecialCharacters(url)
                        .replaceAll("\\\\\\{\\\\\\{.+?\\\\}\\\\}", "[^/]*");
    }
}
