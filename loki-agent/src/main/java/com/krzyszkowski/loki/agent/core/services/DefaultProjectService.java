package com.krzyszkowski.loki.agent.core.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krzyszkowski.loki.agent.io.ProjectParserResolver;
import com.krzyszkowski.loki.api.project.Project;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@Service
public class DefaultProjectService implements ProjectService {

    private final StorageService storageService;
    private final ProjectParserResolver parserResolver;
    private final ObjectMapper objectMapper;

    public DefaultProjectService(StorageService storageService, ProjectParserResolver parserResolver) {
        this.storageService = storageService;
        this.parserResolver = parserResolver;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public Optional<Project> openProject(String path) {
        try {
            var projectBytes = storageService.readFile(path);

            return Optional.of(deserializeProject(projectBytes));
        } catch (IOException e) {
            log.error("Error occured while trying to open project");
            log.error("Exception: {}", e.toString());

            return Optional.empty();
        }
    }

    @Override
    public Optional<Project> importProject(String path, String type) {
        try {
            return Optional.ofNullable(parserResolver.parseInput(path, type));
        } catch (IOException e) {
            log.error("Error occured while trying to import project");
            log.error("Exception: {}", e.toString());

            return Optional.empty();
        }
    }

    @Override
    public boolean exportProject(String path, String type, Project project) {
        try {
            parserResolver.parseOutput(path, type, project);
        } catch (IOException e) {
            log.error("Error occured while trying to save project");
            log.error("Exception: {}", e.toString());

            return false;
        }

        return true;
    }

    @Override
    public boolean saveProject(String path, Project project) {
        try {
            var projectBytes = serializeProject(project);

            storageService.writeFile(path, projectBytes);

            return true;
        } catch (IOException e) {
            log.error("Error occured while trying to save project");
            log.error("Exception: {}", e.toString());

            return false;
        }
    }

    private Project deserializeProject(byte[] projectBytes) throws IOException {
        return objectMapper.readValue(projectBytes, Project.class);
    }

    private byte[] serializeProject(Project project) throws IOException {
        return objectMapper.writeValueAsBytes(project);
    }
}
