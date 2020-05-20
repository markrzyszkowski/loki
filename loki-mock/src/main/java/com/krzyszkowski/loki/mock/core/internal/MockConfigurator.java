package com.krzyszkowski.loki.mock.core.internal;

import com.krzyszkowski.loki.api.configuration.Configuration;

import java.util.Map;

public interface MockConfigurator {

    Map<String, String> configure(Configuration configuration);
}
