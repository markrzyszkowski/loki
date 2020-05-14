package com.krzyszkowski.loki.api.project;

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
    private List<HeaderWithCondition> headers;
    private List<ParameterWithCondition> parameters;
    private String body;
    private Condition bodyCondition;
    private boolean bodyIgnoreCase;
    private boolean bodyIgnoreWhitespace;
    private boolean expanded;
    private boolean headersExpanded;
    private boolean parametersExpanded;
}
