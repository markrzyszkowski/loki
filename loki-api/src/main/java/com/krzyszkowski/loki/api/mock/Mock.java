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
public class Mock {

    @NotBlank(message = "Mock id cannot be empty")
    private String id;

    @NotBlank(message = "Mock url cannot be empty")
    private String url;

    private List<@Valid Rule> rules;
}
