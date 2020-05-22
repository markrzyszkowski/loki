package com.krzyszkowski.loki.agent.core.internal;

import com.krzyszkowski.loki.agent.io.ProjectParserResolver;
import com.krzyszkowski.loki.api.project.Project;
import org.springframework.stereotype.Component;

@Component
public class ProjectExporter {

    private final ProjectParserResolver resolver;

    public ProjectExporter(ProjectParserResolver resolver) {
        this.resolver = resolver;
    }

    public byte[] exportProject(String path, Project project) {
        return resolver.parseOutput(path, project);
    }
}
