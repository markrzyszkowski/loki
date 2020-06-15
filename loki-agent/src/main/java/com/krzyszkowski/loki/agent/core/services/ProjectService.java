package com.krzyszkowski.loki.agent.core.services;

import com.krzyszkowski.loki.api.project.Project;

import java.util.Optional;

public interface ProjectService {

    Optional<Project> openProject(String path);

    Optional<Project> importProject(String path, String type);

    boolean exportProject(String path, String type, Project project);

    boolean saveProject(String path, Project project);
}
