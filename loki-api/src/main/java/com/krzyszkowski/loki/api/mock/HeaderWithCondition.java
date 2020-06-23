package com.krzyszkowski.loki.api.mock;

import com.krzyszkowski.loki.api.project.Condition;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeaderWithCondition {

    @NotBlank(message = "Header key cannot be empty")
    private String key;

    private String value;

    private Condition condition;

    private boolean valueIgnoreCase;
}
