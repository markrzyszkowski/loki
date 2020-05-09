package com.krzyszkowski.loki.agent.core.internal;

import com.krzyszkowski.loki.api.configuration.Configuration;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public interface ConfigurationRepository {

    void addConfiguration(UUID id, Configuration configuration);

    Optional<Configuration> findConfiguration(UUID id);

    void addUrls(UUID id, Map<String, String> urls);

    Optional<Map<String, String>> findUrls(UUID id);
}
