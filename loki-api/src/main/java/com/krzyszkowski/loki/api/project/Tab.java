package com.krzyszkowski.loki.api.project;

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
public class Tab {

    @NotBlank(message = "Tab id cannot be empty")
    private String id;

    @NotBlank(message = "Tab name cannot be empty")
    private String name;

    private String url;

    private List<@Valid Rule> rules;
}
