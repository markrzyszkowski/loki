package com.krzyszkowski.loki.agent.core.internal.util;

import com.krzyszkowski.loki.api.messages.ErrorResponse;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.validation.Errors;

import java.util.stream.Collectors;

public class Mappers {

    public static ErrorResponse parseErrors(Errors errors) {
        return ErrorResponse.builder()
                            .errors(errors.getAllErrors()
                                          .stream()
                                          .map(DefaultMessageSourceResolvable::getDefaultMessage)
                                          .collect(Collectors.toList()))
                            .build();
    }
}
