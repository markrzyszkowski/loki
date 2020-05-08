package com.krzyszkowski.loki.api.messages.mock;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StopMockRequest {

    @NotBlank(message = "Id cannot be empty")
    private String id;
}
