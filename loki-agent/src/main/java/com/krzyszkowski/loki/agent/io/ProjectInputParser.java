package com.krzyszkowski.loki.agent.io;

import com.krzyszkowski.loki.api.project.Project;

import java.io.IOException;

public interface ProjectInputParser {

    Project parse(byte[] project) throws IOException;
}
