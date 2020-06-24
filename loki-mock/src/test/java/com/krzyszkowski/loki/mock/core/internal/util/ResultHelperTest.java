package com.krzyszkowski.loki.mock.core.internal.util;

import org.junit.jupiter.api.Test;
import org.springframework.web.context.request.async.DeferredResult;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class ResultHelperTest {

    @Test
    void setAndReturnSuccess() {
        // given
        var deferredResult = new DeferredResult<String>();

        // when
        var result = ResultHelper.setAndReturn("test", deferredResult);

        // then
        assertThat(result).isNotNull();
        assertThat(result.hasResult()).isTrue();
    }

    @Test
    void shouldReturnWithInstantBeforeNow() {
        // given
        var instant = Instant.now().minusSeconds(10);

        // when
        var result = ResultHelper.shouldReturn(instant);

        // then
        assertThat(result).isTrue();
    }

    @Test
    void shouldReturnWithInstantAfterNow() {
        // given
        var instant = Instant.now().plusSeconds(60);

        // when
        var result = ResultHelper.shouldReturn(instant);

        // then
        assertThat(result).isFalse();
    }
}
