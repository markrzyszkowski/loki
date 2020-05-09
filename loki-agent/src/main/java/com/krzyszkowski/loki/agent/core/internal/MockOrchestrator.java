package com.krzyszkowski.loki.agent.core.internal;

import com.krzyszkowski.loki.api.mock.Profile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PreDestroy;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
public class MockOrchestrator {

    private static final String JAVA = "java";
    private static final String MOCK_ID = "-Dloki.mock.id=%s";
    private static final String PROFILE = "-Dspring.profiles.active=%s";
    private static final String SERVER_PORT = "-Dserver.port=%d";
    private static final String AGENT_PORT = "-Dloki.mock.agent.port=%d";
    private static final String JAR = "-jar";

    private final Map<UUID, Process> processes = new HashMap<>();
    private final Map<UUID, Boolean> readiness = new HashMap<>();

    @Value("${server.port}")
    private int agentPort;

    @Value("${loki.agent.mock.jar}")
    private String mockJar;

    public void startMockProcess(UUID mockId, Profile profile, int port) throws IOException {
        var command = List.of(JAVA,
                              String.format(MOCK_ID, mockId.toString()),
                              String.format(PROFILE, profile.toString().toLowerCase()),
                              String.format(SERVER_PORT, port),
                              String.format(AGENT_PORT, agentPort),
                              JAR,
                              mockJar);

        var processBuilder = new ProcessBuilder(command)
                .redirectErrorStream(true)
                .inheritIO(); // TODO inherit only if debug

        log.info("Starting mock process with id {}", mockId);
        log.debug("Arguments: [{}]", String.join(", ", command));

        processes.put(mockId, processBuilder.start());
        readiness.put(mockId, false);
    }

    public void stopMockProcess(UUID mockId) {
        var process = processes.get(mockId);

        if (process == null) {
            throw new IllegalArgumentException("No mock with provided id is running");
        }

        log.info("Stopping mock process with id {}", mockId);

        process.destroy();
        processes.remove(mockId);
        readiness.remove(mockId);
    }

    public void markAsReady(UUID mockId) {
        readiness.put(mockId, true);
    }

    public boolean isReady(UUID mockId) {
        var ready = readiness.get(mockId);

        if (ready != null) {
            return ready;
        }
        return false;
    }

    @PreDestroy
    private void preDestroy() {
        processes.values().forEach(Process::destroy);
    }
}
