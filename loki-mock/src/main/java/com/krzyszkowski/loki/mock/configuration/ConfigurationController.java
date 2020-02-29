package com.krzyszkowski.loki.mock.configuration;

import com.krzyszkowski.loki.api.configuration.ConfigurationRequest;
import com.krzyszkowski.loki.api.configuration.ConfigurationResponse;
import com.krzyszkowski.loki.mock.configuration.services.ConfigurationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/configuration")
public class ConfigurationController {

    private final ConfigurationService configurationService;

    public ConfigurationController(ConfigurationService configurationService) {
        this.configurationService = configurationService;
    }

    @PostMapping("/init")
    public ConfigurationResponse init(@RequestBody ConfigurationRequest request) {
        return configurationService.init(request);
    }
}
