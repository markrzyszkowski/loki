package com.krzyszkowski.loki.agent.core.services;

import com.krzyszkowski.loki.api.configuration.Configuration;

import java.util.Optional;

public interface ConfigurationService {

    Optional<Configuration> fetchConfiguration(String id);
}
