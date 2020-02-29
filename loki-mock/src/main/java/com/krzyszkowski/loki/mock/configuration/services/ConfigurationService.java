package com.krzyszkowski.loki.mock.configuration.services;

import com.krzyszkowski.loki.api.configuration.ConfigurationRequest;
import com.krzyszkowski.loki.api.configuration.ConfigurationResponse;

public interface ConfigurationService {

    ConfigurationResponse init(ConfigurationRequest request);
}
