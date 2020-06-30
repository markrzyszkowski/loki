package com.krzyszkowski.loki.mock.core.internal;

import com.krzyszkowski.loki.api.mock.Response;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import javax.servlet.http.HttpServletRequest;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Predicate;

@Repository
@Profile("static")
public class StaticMockConditionRepository implements MockConditionRepository {

    private final Map<String, Map<Predicate<HttpServletRequest>, Response>> repository = new LinkedHashMap<>();

    @Override
    public void addMock(String url, Map<Predicate<HttpServletRequest>, Response> mock) {
        repository.put(url, mock);
    }

    @Override
    public Optional<Map<Predicate<HttpServletRequest>, Response>> findMock(String url) {
        return Optional.ofNullable(repository.get(url));
    }
}
