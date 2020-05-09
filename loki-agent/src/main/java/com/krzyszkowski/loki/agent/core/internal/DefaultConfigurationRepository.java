package com.krzyszkowski.loki.agent.core.internal;

import com.krzyszkowski.loki.api.configuration.Configuration;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public class DefaultConfigurationRepository implements ConfigurationRepository {

    private final Map<UUID, Configuration> configurationRepository = new HashMap<>();
    private final Map<UUID, Map<String, String>> urlsRepository = new HashMap<>();

    @Override
    public void addConfiguration(UUID id, Configuration configuration) {
        configurationRepository.put(id, configuration);
    }

    @Override
    public Optional<Configuration> findConfiguration(UUID id) {
        return Optional.ofNullable(configurationRepository.get(id));
    }

    @Override
    public void addUrls(UUID id, Map<String, String> urls) {
        urlsRepository.put(id, urls);
    }

    @Override
    public Optional<Map<String, String>> findUrls(UUID id) {
        return Optional.ofNullable(urlsRepository.get(id));
    }
}
