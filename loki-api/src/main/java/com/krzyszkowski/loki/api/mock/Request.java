package com.krzyszkowski.loki.api.mock;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Request {

    private String method;
    private Condition methodCondition;
    private List<UrlVariable> urlVariables;
    private List<ParameterWithCondition> parameters;
    private List<HeaderWithCondition> headers;
    private String body;
    private Condition bodyCondition;
    private boolean bodyIgnoreCase;
    private boolean bodyIgnoreWhitespace;
}
