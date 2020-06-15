package com.krzyszkowski.loki.agent.io;

import com.krzyszkowski.loki.api.project.Project;

import java.io.IOException;

public interface ProjectOutputParser {

    void parse(String path, Project project) throws IOException;

    boolean canParse(String type);
}
