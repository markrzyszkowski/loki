package com.krzyszkowski.loki.agent.core;

import com.krzyszkowski.loki.agent.core.internal.util.Mappers;
import com.krzyszkowski.loki.agent.core.services.ConfigurationService;
import com.krzyszkowski.loki.agent.core.services.MockService;
import com.krzyszkowski.loki.api.messages.ErrorResponse;
import com.krzyszkowski.loki.api.messages.configuration.FetchConfigurationRequest;
import com.krzyszkowski.loki.api.messages.configuration.FetchConfigurationResponse;
import com.krzyszkowski.loki.api.messages.configuration.ReadyRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/config")
public class ConfigurationController {

    private final ConfigurationService configurationService;
    private final MockService mockService;

    public ConfigurationController(ConfigurationService configurationService, MockService mockService) {
        this.configurationService = configurationService;
        this.mockService = mockService;
    }

    @PostMapping
    public ResponseEntity<?> configuration(@Valid @RequestBody FetchConfigurationRequest fetchConfigurationRequest,
                                           Errors errors) {
        if (errors.hasErrors()) {
            var errorResponse = Mappers.parseErrors(errors);

            log.error("Received malformed request to provide mock configuration");
            log.error("Errors: {}", errorResponse.getErrors());

            return ResponseEntity.badRequest().body(errorResponse);
        }

        var id = fetchConfigurationRequest.getId();

        log.debug("Received request to provide configuration for mock with id {}", id);

        var configurationOptional = configurationService.fetchConfiguration(id);

        return configurationOptional.isPresent()
                ? ResponseEntity.ok(FetchConfigurationResponse.builder()
                                                              .configuration(configurationOptional.get())
                                                              .build())
                : ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(ErrorResponse.builder()
                                                   .errors(List.of("Could not find configuration for provided id"))
                                                   .build());
    }

    @PostMapping("/ready")
    public ResponseEntity<?> ready(@Valid @RequestBody ReadyRequest readyRequest, Errors errors) {
        if (errors.hasErrors()) {
            var errorResponse = Mappers.parseErrors(errors);

            log.error("Received malformed request to acknowledge mock readiness");
            log.error("Errors: {}", errorResponse.getErrors());

            return ResponseEntity.badRequest().body(errorResponse);
        }

        var id = readyRequest.getId();
        var urls = readyRequest.getUrls();

        mockService.markAsReady(id, urls);

        return ResponseEntity.ok().build();
    }
}
