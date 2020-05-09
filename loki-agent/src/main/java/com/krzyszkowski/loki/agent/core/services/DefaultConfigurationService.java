package com.krzyszkowski.loki.agent.core.services;

import com.krzyszkowski.loki.agent.core.internal.ConfigurationRepository;
import com.krzyszkowski.loki.api.configuration.Configuration;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class DefaultConfigurationService implements ConfigurationService {

    private final ConfigurationRepository configurationRepository;

    public DefaultConfigurationService(ConfigurationRepository configurationRepository) {
        this.configurationRepository = configurationRepository;
    }

    @Override
    public Optional<Configuration> fetchConfiguration(String id) {
        var uuid = UUID.fromString(id);

        return configurationRepository.findConfiguration(uuid);
    }
}
