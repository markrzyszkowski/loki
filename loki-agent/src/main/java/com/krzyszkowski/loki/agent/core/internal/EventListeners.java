package com.krzyszkowski.loki.agent.core.internal;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
public class EventListeners {

    @Value("${loki.agent.electron.port}")
    private int electronPort;

    @EventListener(ApplicationReadyEvent.class)
    public void applicationReadyEventListener() {
        var callbackUrl = String.format("http://localhost:%d/ready", electronPort);

        log.info("Sending agent ready message to electron callback server");
        var responseEntity = new RestTemplate().getForEntity(callbackUrl, Void.class);

        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            log.error("Agent ready callback was not successful; status code: {}", responseEntity.getStatusCodeValue());
        }
    }
}
