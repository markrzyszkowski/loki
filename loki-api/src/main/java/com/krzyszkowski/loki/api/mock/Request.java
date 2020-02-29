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
    private List<Condition<Header>> headers;
    private List<Condition<Parameter>> parameters;
    private List<Condition<Body>> body;
}
