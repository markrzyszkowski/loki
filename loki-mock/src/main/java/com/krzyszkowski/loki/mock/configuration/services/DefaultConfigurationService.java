package com.krzyszkowski.loki.mock.configuration.services;

import com.krzyszkowski.loki.api.configuration.ConfigurationRequest;
import com.krzyszkowski.loki.api.configuration.ConfigurationResponse;
import com.krzyszkowski.loki.mock.configuration.internal.MockConfigurator;
import org.springframework.stereotype.Service;

@Service
public class DefaultConfigurationService implements ConfigurationService {

    private final MockConfigurator mockConfigurator;

    public DefaultConfigurationService(MockConfigurator mockConfigurator) {
        this.mockConfigurator = mockConfigurator;
    }

    @Override
    public ConfigurationResponse init(ConfigurationRequest request) {
        var configuration = mockConfigurator.configure(request);

        return ConfigurationResponse.builder()
                                    .configuration(configuration)
                                    .build();
    }
}
