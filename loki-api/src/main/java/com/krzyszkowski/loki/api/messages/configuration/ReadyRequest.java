package com.krzyszkowski.loki.api.messages.configuration;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReadyRequest {

    @NotBlank(message = "Id cannot be empty")
    private String id;

    @NotEmpty(message = "Url associations must be present")
    private Map<String, String> urls;
}
