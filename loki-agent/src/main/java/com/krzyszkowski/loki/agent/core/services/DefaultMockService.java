package com.krzyszkowski.loki.agent.core.services;

import com.krzyszkowski.loki.agent.core.internal.ConfigurationRepository;
import com.krzyszkowski.loki.agent.core.internal.MockOrchestrator;
import com.krzyszkowski.loki.api.configuration.AppliedConfiguration;
import com.krzyszkowski.loki.api.configuration.Configuration;
import com.krzyszkowski.loki.api.mock.Mock;
import com.krzyszkowski.loki.api.mock.Settings;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.SocketUtils;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@Slf4j
@Service
public class DefaultMockService implements MockService {

    private final ConfigurationRepository configurationRepository;
    private final MockOrchestrator mockOrchestrator;

    public DefaultMockService(ConfigurationRepository configurationRepository, MockOrchestrator mockOrchestrator) {
        this.configurationRepository = configurationRepository;
        this.mockOrchestrator = mockOrchestrator;
    }

    @Override
    public Optional<AppliedConfiguration> startMock(String id, Settings settings, List<Mock> mocks) {
        var uuid = UUID.fromString(id);

        configurationRepository.addConfiguration(uuid, Configuration.builder()
                                                                    .settings(settings)
                                                                    .mocks(mocks)
                                                                    .build());

        var port = settings.getPort();

        if (port != 0) {
            try {
                SocketUtils.findAvailableTcpPort(port, port);
            } catch (IllegalStateException e) {
                log.error("Selected port is not available");
                log.error("Exception: {}", e.toString());
                return Optional.empty();
            }
        } else {
            port = SocketUtils.findAvailableTcpPort();
        }

        try {
            mockOrchestrator.startMockProcess(uuid,
                                              settings.getProfile(),
                                              port,
                                              settings.isBlockRemoteRequests(),
                                              settings.getMaxRequestSize());
        } catch (IOException e) {
            log.error("Could not start mock process with id {}", id);
            log.error("Exception: {}", e.toString());
        }

        var executorService = Executors.newSingleThreadScheduledExecutor();
        var result = executorService.scheduleAtFixedRate(() -> {
            if (mockOrchestrator.isReady(uuid)) {
                executorService.shutdown();
            }
        }, 100, 100, TimeUnit.MILLISECONDS);

        try {
            result.get(10, TimeUnit.SECONDS);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.error("Mock process with id {} did not manage to start in 10 seconds", id);
            log.error("Exception: {}", e.toString());

            return Optional.empty();
        } catch (CancellationException e) { // ok
            log.info("Mock process with id {} started successfuly", id);

            var finalPort = port;
            return configurationRepository.findUrls(uuid)
                                          .map(urls -> AppliedConfiguration.builder()
                                                                           .port(finalPort)
                                                                           .urls(urls)
                                                                           .build());
        }

        return Optional.empty();
    }

    @Override
    public boolean stopMock(String id) {
        var uuid = UUID.fromString(id);

        try {
            mockOrchestrator.stopMockProcess(uuid);
        } catch (IllegalArgumentException e) {
            return false;
        }

        return true;
    }

    @Override
    public void markAsReady(String id, Map<String, String> urls) {
        var uuid = UUID.fromString(id);

        configurationRepository.addUrls(uuid, urls);

        mockOrchestrator.markAsReady(uuid);
    }
}
