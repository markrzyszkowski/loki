package com.krzyszkowski.loki.agent.core.services;

import com.krzyszkowski.loki.api.mock.Mock;
import com.krzyszkowski.loki.api.mock.Settings;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface MockService {

    Optional<Map<String, String>> startMock(String id, Settings settings, List<Mock> mocks);

    boolean stopMock(String id);

    void markAsReady(String id, Map<String, String> urls);
}
