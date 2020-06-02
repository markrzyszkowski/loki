package com.krzyszkowski.loki.api.mock;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Rule {

    @Valid
    @NotNull(message = "Request must be present")
    private Request request;

    @Valid
    @NotNull(message = "Response must be present")
    private Response response;
}
