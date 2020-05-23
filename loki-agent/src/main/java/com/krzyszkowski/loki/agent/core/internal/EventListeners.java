package com.krzyszkowski.loki.agent.core.internal;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.FileTime;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.function.BiPredicate;
import java.util.stream.Collectors;

@Slf4j
@Component
public class EventListeners {

    @Value("${logging.file.name}")
    private String logFile;

    @Value("${loki.agent.electron.port}")
    private int electronPort;

    @EventListener(ApplicationReadyEvent.class)
    public void applicationReadyEventListener() {
        try {
            log.info("Removing old mock log files");

            removeOldLogs();
        } catch (IOException e) {
            log.error("Could not remove old mock log files");
            log.error("Exception: {}", e.toString());
        }

        var callbackUrl = String.format("http://localhost:%d/ready", electronPort);

        try {
            log.info("Sending agent ready message to electron callback server");
            var responseEntity = new RestTemplate().getForEntity(callbackUrl, Void.class);

            if (responseEntity.getStatusCode() != HttpStatus.OK) {
                log.error("Agent ready callback was not successful; status code: {}", responseEntity.getStatusCodeValue());
            }
        } catch (RestClientException e) {
            log.error("Agent ready callback was not successful");
            log.error("Exception: {}", e.toString());
        }
    }

    private void removeOldLogs() throws IOException {
        var retentionThreshold = Instant.from(ZonedDateTime.now().minusDays(7));

        BiPredicate<Path, BasicFileAttributes> retentionPredicate = (path, attributes) ->
                path.getFileName().toString().startsWith("mock-")
                && attributes.lastModifiedTime().compareTo(FileTime.from(retentionThreshold)) < 0;

        var filesToDelete = Files.find(Path.of(logFile).getParent(), 1, retentionPredicate)
                                 .peek(path -> System.out.println(path.getFileName()))
                                 .collect(Collectors.toList());

        for (var path : filesToDelete) {
            Files.delete(path);
        }
    }
}
