package com.krzyszkowski.loki.mock.configuration.internal;

import com.krzyszkowski.loki.api.configuration.ConfigurationRequest;

import java.util.Map;

public interface MockConfigurator {

    Map<String, String> configure(ConfigurationRequest request);
}
