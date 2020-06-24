package com.krzyszkowski.loki.agent.core.internal.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UrlHelperTest {

    @Test
    void stripProtocolWithEmptyString() {
        // given
        var url = "";

        // when
        var result = UrlHelper.stripProtocol(url);

        // then
        assertThat(result).isEqualTo(url);
    }

    @Test
    void stripProtocolWithNoProtocol() {
        // given
        var url = "example.com";

        // when
        var result = UrlHelper.stripProtocol(url);

        // then
        assertThat(result).isEqualTo(url);
    }

    @Test
    void stripProtocolWithHttpPresent() {
        // given
        var url = "http://example.com";

        // when
        var result = UrlHelper.stripProtocol(url);

        // then
        assertThat(result).isEqualTo("example.com");
    }

    @Test
    void stripProtocolWithHttpsPresent() {
        // given
        var url = "https://example.com";

        // when
        var result = UrlHelper.stripProtocol(url);

        // then
        assertThat(result).isEqualTo("example.com");
    }

    @Test
    void stripProtocolWithForeignProtocol() {
        // given
        var url = "ftp://example.com";

        // when
        var result = UrlHelper.stripProtocol(url);

        // then
        assertThat(result).isEqualTo(url);
    }
}
