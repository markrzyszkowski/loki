package com.krzyszkowski.loki.agent.core.internal;

import com.krzyszkowski.loki.api.project.Project;
import com.krzyszkowski.loki.api.project.Tab;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
public class ProjectImporter {

    public Project importProject(String path) throws IOException { // TODO implement
        return Project.builder()
                      .id(UUID.randomUUID().toString())
                      .name("imported project")
                      .tabs(List.of(
                              Tab.builder()
                                 .name("imported project tab 1")
                                 .build(),
                              Tab.builder()
                                 .name("imported project tab 2")
                                 .build()))
                      .build();
    }
}
