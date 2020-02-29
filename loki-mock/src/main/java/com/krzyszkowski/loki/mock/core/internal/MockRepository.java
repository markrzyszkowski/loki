package com.krzyszkowski.loki.mock.core.internal;

import com.krzyszkowski.loki.api.mock.Mock;

import java.util.Optional;

public interface MockRepository {

    void addMock(String url, Mock mock);

    Optional<Mock> findMock(String url);
}
