package com.krzyszkowski.loki.api.project;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Rule {

    private String id;
    private String name;
    private Request request;
    private Response response;
    private boolean active;
    private boolean expanded;
}
