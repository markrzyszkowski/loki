package com.krzyszkowski.loki.api.project;

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
public class Rule {

    @NotBlank(message = "Id cannot be empty")
    private String id;

    @NotBlank(message = "Name cannot be empty")
    private String name;

    @NotNull(message = "Request must be present")
    private Request request;

    @Valid
    @NotNull(message = "Response must be present")
    private Response response;

    private boolean active;

    private boolean expanded;
}
