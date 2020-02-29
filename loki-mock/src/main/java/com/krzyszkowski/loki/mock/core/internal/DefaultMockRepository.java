package com.krzyszkowski.loki.mock.core.internal;

import com.krzyszkowski.loki.api.mock.Mock;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Repository
public class DefaultMockRepository implements MockRepository {

    private final Map<String, Mock> repository = new HashMap<>();

    @Override
    public void addMock(String url, Mock mock) {
        repository.put(url, mock);
    }

    @Override
    public Optional<Mock> findMock(String url) {
        return Optional.ofNullable(repository.get(url));
    }
}
