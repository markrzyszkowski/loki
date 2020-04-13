package com.krzyszkowski.loki.agent.core;

import com.krzyszkowski.loki.agent.core.services.ProjectService;
import com.krzyszkowski.loki.api.messages.ErrorResponse;
import com.krzyszkowski.loki.api.messages.project.FetchProjectRequest;
import com.krzyszkowski.loki.api.messages.project.FetchProjectResponse;
import com.krzyszkowski.loki.api.messages.project.SaveProjectRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/project")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/open")
    public ResponseEntity<?> openProject(@Valid @RequestBody FetchProjectRequest fetchProjectRequest, Errors errors) {
        if (errors.hasErrors()) {
            var errorResponse = parseErrors(errors);

            log.info("Received malformed request to open project");
            log.info("Errors: {}", errorResponse.getErrors());

            return ResponseEntity.badRequest().body(errorResponse);
        }

        var projectOptional = projectService.openProject(fetchProjectRequest.getPath());

        return projectOptional.isPresent()
                ? ResponseEntity.ok(FetchProjectResponse.builder()
                                                        .project(projectOptional.get())
                                                        .build())
                : ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(ErrorResponse.builder()
                                                   .errors(List.of("Could not read project data from provided file"))
                                                   .build());
    }

    @PostMapping("/import")
    public ResponseEntity<?> importProject(@Valid @RequestBody FetchProjectRequest fetchProjectRequest, Errors errors) {
        if (errors.hasErrors()) {
            var errorResponse = parseErrors(errors);

            log.info("Received malformed request to import project");
            log.info("Errors: {}", errorResponse.getErrors());

            return ResponseEntity.badRequest().body(errorResponse);
        }

        var projectOptional = projectService.importProject(fetchProjectRequest.getPath());

        return projectOptional.isPresent()
                ? ResponseEntity.ok(FetchProjectResponse.builder()
                                                        .project(projectOptional.get())
                                                        .build())
                : ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(ErrorResponse.builder()
                                                   .errors(List.of("Could not import project data from provided format"))
                                                   .build());
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveProject(@Valid @RequestBody SaveProjectRequest saveProjectRequest, Errors errors) {
        if (errors.hasErrors()) {
            var errorResponse = parseErrors(errors);

            log.info("Received malformed request to save project");
            log.info("Errors: {}", errorResponse.getErrors());

            return ResponseEntity.badRequest().body(errorResponse);
        }

        var projectSaved = projectService.saveProject(saveProjectRequest.getPath(), saveProjectRequest.getProject());

        return projectSaved
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(ErrorResponse.builder()
                                                   .errors(List.of("Could not save project data to selected file"))
                                                   .build());
    }

    private ErrorResponse parseErrors(Errors errors) {
        return ErrorResponse.builder()
                            .errors(errors.getAllErrors()
                                          .stream()
                                          .map(DefaultMessageSourceResolvable::getDefaultMessage)
                                          .collect(Collectors.toList()))
                            .build();
    }
}
