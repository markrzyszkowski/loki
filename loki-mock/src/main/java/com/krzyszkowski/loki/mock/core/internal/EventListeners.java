package com.krzyszkowski.loki.mock.core.internal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krzyszkowski.loki.api.messages.ErrorResponse;
import com.krzyszkowski.loki.api.messages.configuration.FetchConfigurationRequest;
import com.krzyszkowski.loki.api.messages.configuration.FetchConfigurationResponse;
import com.krzyszkowski.loki.api.messages.configuration.ReadyRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@Slf4j
@Component
public class EventListeners {

    private final ObjectMapper objectMapper;
    private final MockConfigurator mockConfigurator;

    @Value("${loki.mock.id}")
    private String id;

    @Value("${loki.mock.agent.port}")
    private int agentPort;

    public EventListeners(ObjectMapper objectMapper, MockConfigurator mockConfigurator) {
        this.objectMapper = objectMapper;
        this.mockConfigurator = mockConfigurator;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void applicationReadyEventListener() {
        var configurationCallbackUrl = String.format("http://localhost:%d/api/config", agentPort);
        var readyCallbackUrl = String.format("http://localhost:%d/api/config/ready", agentPort);

        try {
            log.info("Sending request for configuration to agent");
            var responseEntity = new RestTemplate().postForEntity(configurationCallbackUrl,
                                                                  FetchConfigurationRequest.builder().id(id).build(),
                                                                  String.class);

            if (!responseEntity.getStatusCode().is2xxSuccessful()) {
                try {
                    var errorResponse = deserializeErrorResponse(responseEntity.getBody());

                    log.error("Error response received");
                    log.error("Errors: {}", errorResponse.getErrors());
                } catch (IOException e) {
                    log.error("Error occured during deserialization of ErrorResponse");
                    log.error("Exception: {}", e.toString());
                }
            } else {
                try {
                    var response = deserializeResponse(responseEntity.getBody());

                    var configuration = mockConfigurator.configure(response.getConfiguration());

                    try {
                        log.info("Sending ready message to agent");

                        responseEntity = new RestTemplate().postForEntity(readyCallbackUrl,
                                                                          ReadyRequest.builder()
                                                                                      .id(id)
                                                                                      .urls(configuration)
                                                                                      .build(),
                                                                          String.class);

                        if (!responseEntity.getStatusCode().is2xxSuccessful()) {
                            try {
                                var errorResponse = deserializeErrorResponse(responseEntity.getBody());

                                log.error("Error response received");
                                log.error("Errors: {}", errorResponse.getErrors());
                            } catch (IOException e) {
                                log.error("Error occured during deserialization of ErrorResponse");
                                log.error("Exception: {}", e.toString());
                            }
                        }
                    } catch (RestClientException e) {
                        log.error("Request for configuration was not successful");
                        log.error("Exception: {}", e.toString());
                    }
                } catch (IOException e) {
                    log.error("Error occured during deserialization of FetchConfigurationResponse");
                    log.error("Exception: {}", e.toString());
                }
            }
        } catch (RestClientException e) {
            log.error("Request for configuration was not successful");
            log.error("Exception: {}", e.toString());
        }
    }

    private FetchConfigurationResponse deserializeResponse(String payload) throws IOException {
        return objectMapper.readValue(payload, FetchConfigurationResponse.class);
    }

    private ErrorResponse deserializeErrorResponse(String payload) throws IOException {
        return objectMapper.readValue(payload, ErrorResponse.class);
    }
}
