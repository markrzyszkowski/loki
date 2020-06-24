package com.krzyszkowski.loki.mock.core.internal.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

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

    @Test
    void stripEmptyPathWithNoPath() {
        // given
        var url = "example.com";

        // when
        var result = UrlHelper.stripEmptyPath(url);

        // then
        assertThat(result).isEqualTo(url);
    }

    @Test
    void stripEmptyPathWithEmptyPath() {
        // given
        var url = "example.com/";

        // when
        var result = UrlHelper.stripEmptyPath(url);

        // then
        assertThat(result).isEqualTo("example.com");
    }

    @Test
    void stripEmptyPathWithPathPresent() {
        // given
        var url = "example.com/path/to/resource";

        // when
        var result = UrlHelper.stripEmptyPath(url);

        // then
        assertThat(result).isEqualTo(url);
    }
}
