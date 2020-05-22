package com.krzyszkowski.loki.mock.core.internal;

import com.krzyszkowski.loki.api.mock.Response;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Optional;
import java.util.function.Predicate;

public interface MockConditionRepository {

    void addMock(String url, Map<Predicate<HttpServletRequest>, Response> mock);

    Optional<Map<Predicate<HttpServletRequest>, Response>> findMock(String url);
}
