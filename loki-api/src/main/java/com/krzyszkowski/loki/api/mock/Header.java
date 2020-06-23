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
public class Header {

    @NotBlank(message = "Header key cannot be empty")
    private String key;

    @NotBlank(message = "Header value cannot be empty")
    private String value;
}
