package com.krzyszkowski.loki.api.messages.configuration;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FetchConfigurationRequest {

    @NotBlank(message = "Id cannot be empty")
    private String id;
}
