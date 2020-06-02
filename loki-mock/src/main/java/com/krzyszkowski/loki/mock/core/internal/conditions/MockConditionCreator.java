package com.krzyszkowski.loki.mock.core.internal.conditions;

import com.krzyszkowski.loki.api.mock.Mock;
import com.krzyszkowski.loki.api.mock.Response;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.function.Predicate;

public interface MockConditionCreator {

    Map<Predicate<HttpServletRequest>, Response> create(Mock mock);
}
