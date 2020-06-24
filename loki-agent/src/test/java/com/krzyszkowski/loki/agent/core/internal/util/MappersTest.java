package com.krzyszkowski.loki.agent.core.internal.util;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.validation.Errors;
import org.springframework.validation.ObjectError;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
class MappersTest {

    @Mock
    private Errors errors;

    @Test
    void parseErrorsWithEmptyErrors() {
        // given
        var objectError = List.<ObjectError>of();
        doReturn(objectError).when(errors).getAllErrors();

        // when
        var result = Mappers.parseErrors(errors);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getErrors()).isEmpty();
    }

    @Test
    void parseErrorsWithOneError() {
        // given
        var objectError = List.of(new ObjectError("object", "message"));
        doReturn(objectError).when(errors).getAllErrors();

        // when
        var result = Mappers.parseErrors(errors);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getErrors()).hasSize(1);
    }

    @Test
    void parseErrorsWithSeveralErrors() {
        // given
        var objectError = List.of(new ObjectError("object1", "message1"), new ObjectError("object2", "message2"));
        doReturn(objectError).when(errors).getAllErrors();

        // when
        var result = Mappers.parseErrors(errors);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getErrors()).hasSize(2);
    }
}
