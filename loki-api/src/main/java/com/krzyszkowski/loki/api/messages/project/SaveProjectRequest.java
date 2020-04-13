package com.krzyszkowski.loki.api.messages.project;

import com.krzyszkowski.loki.api.project.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaveProjectRequest {

    @NotBlank(message = "Path cannot be empty")
    private String path;

    @NotNull(message = "Project must be present")
    private Project project;
}
