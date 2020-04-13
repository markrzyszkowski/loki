package com.krzyszkowski.loki.api.messages.project;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FetchProjectRequest {

    @NotBlank(message = "Path cannot be empty")
    private String path;
}
