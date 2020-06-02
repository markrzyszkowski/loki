package com.krzyszkowski.loki.api.mock;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrlVariable {

    @NotBlank(message = "Key cannot be empty")
    private String key;

    @NotBlank(message = "Value cannot be empty")
    private String value;
}
