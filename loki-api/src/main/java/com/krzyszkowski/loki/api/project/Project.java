package com.krzyszkowski.loki.api.project;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @NotBlank(message = "Project id cannot be empty")
    private String id;

    @NotBlank(message = "Project name cannot be empty")
    private String name;

    @Valid
    @NotNull(message = "Project settings must be present")
    private Settings settings;

    private List<@Valid Tab> tabs;
}
