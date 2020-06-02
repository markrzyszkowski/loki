package com.krzyszkowski.loki.api.mock;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Response {

    @Min(100)
    @Max(599)
    private int statusCode;

    private List<@Valid Header> headers;

    private String body;
}
