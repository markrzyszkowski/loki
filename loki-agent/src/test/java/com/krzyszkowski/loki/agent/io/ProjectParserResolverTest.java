package com.krzyszkowski.loki.agent.io;

import com.krzyszkowski.loki.agent.io.har.HarInputParser;
import com.krzyszkowski.loki.agent.io.openapi.OpenApiInputParser;
import com.krzyszkowski.loki.agent.io.openapi.OpenApiOutputParser;
import com.krzyszkowski.loki.api.project.Project;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;

@SpringBootTest
class ProjectParserResolverTest {

    @Autowired
    private ProjectParserResolver projectParserResolver;

    @MockBean
    private HarInputParser harInputParser;

    @MockBean
    private OpenApiInputParser openApiInputParser;

    @MockBean
    private OpenApiOutputParser openApiOutputParser;

    @Test
    void parseInputWithNoMatchingParser() {
        assertThrows(IOException.class, () -> projectParserResolver.parseInput("path", "type"));
    }

    @Test
    void parseInputWithHarParser() throws IOException {
        // given
        doReturn(true).when(harInputParser).canParse("har");
        doReturn(new Project()).when(harInputParser).parse(anyString());

        // then
        assertDoesNotThrow(() -> projectParserResolver.parseInput("path", "har"));
    }

    @Test
    void parseInputWithHarParserError() throws IOException {
        // given
        doReturn(true).when(harInputParser).canParse("har");
        doThrow(IOException.class).when(harInputParser).parse(anyString());

        // then
        assertThrows(IOException.class, () -> projectParserResolver.parseInput("path", "har"));
    }

    @Test
    void parseInputWithOpenApiParser() throws IOException {
        // given
        doReturn(true).when(openApiInputParser).canParse("openapi");
        doReturn(new Project()).when(openApiInputParser).parse(anyString());

        // then
        assertDoesNotThrow(() -> projectParserResolver.parseInput("path", "openapi"));
    }

    @Test
    void parseInputWithOpenApiParserError() throws IOException {
        // given
        doReturn(true).when(openApiInputParser).canParse("openapi");
        doThrow(IOException.class).when(openApiInputParser).parse(anyString());

        // then
        assertThrows(IOException.class, () -> projectParserResolver.parseInput("path", "openapi"));
    }

    @Test
    void parseOutputWithNoMatchingParser() {
        assertThrows(IOException.class, () -> projectParserResolver.parseOutput("path", "type", null));
    }

    @Test
    void parseOutputWithOpenApiParser() throws IOException {
        // given
        doReturn(true).when(openApiOutputParser).canParse("openapi");
        doNothing().when(openApiOutputParser).parse(anyString(), any(Project.class));

        // then
        assertDoesNotThrow(() -> projectParserResolver.parseOutput("path", "openapi", new Project()));
    }

    @Test
    void parseOutputWithOpenApiParserError() throws IOException {
        // given
        doReturn(true).when(openApiOutputParser).canParse("openapi");
        doThrow(IOException.class).when(openApiOutputParser).parse(anyString(), any(Project.class));

        // then
        assertThrows(IOException.class, () -> projectParserResolver.parseOutput("path", "openapi", new Project()));
    }
}
