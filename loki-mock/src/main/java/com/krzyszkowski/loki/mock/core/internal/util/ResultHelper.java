package com.krzyszkowski.loki.mock.core.internal.util;

import org.springframework.web.context.request.async.DeferredResult;

import java.time.Instant;

public class ResultHelper {

    public static <T> DeferredResult<T> setAndReturn(T value, DeferredResult<T> deferredResult) {
        deferredResult.setResult(value);

        return deferredResult;
    }

    public static boolean shouldReturn(Instant instant) {
        return instant.isBefore(Instant.now());
    }
}
