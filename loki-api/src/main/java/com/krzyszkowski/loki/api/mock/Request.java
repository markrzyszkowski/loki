package com.krzyszkowski.loki.api.mock;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Request {

    @NotBlank(message = "Method cannot be empty")
    private String method;

    private Condition methodCondition;

    private List<@Valid UrlVariable> urlVariables;

    private List<@Valid ParameterWithCondition> parameters;

    private List<@Valid HeaderWithCondition> headers;

    private String body;

    private Condition bodyCondition;

    private boolean bodyIgnoreCase;

    private boolean bodyIgnoreWhitespace;
}
