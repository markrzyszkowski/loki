package com.krzyszkowski.loki.agent.io;

import com.krzyszkowski.loki.api.project.Project;

import java.io.IOException;

public interface ProjectOutputParser {

    byte[] parse(Project project) throws IOException;

    boolean canParse(String extension);
}
