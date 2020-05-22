package com.krzyszkowski.loki.agent.io.har;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krzyszkowski.loki.agent.io.ProjectOutputParser;
import com.krzyszkowski.loki.api.project.Header;
import com.krzyszkowski.loki.api.project.HeaderWithCondition;
import com.krzyszkowski.loki.api.project.ParameterWithCondition;
import com.krzyszkowski.loki.api.project.Project;
import com.krzyszkowski.loki.api.project.Request;
import com.krzyszkowski.loki.api.project.Response;
import com.krzyszkowski.loki.api.project.Rule;
import com.krzyszkowski.loki.api.project.Tab;
import de.sstoehr.harreader.model.Har;
import de.sstoehr.harreader.model.HarContent;
import de.sstoehr.harreader.model.HarCreatorBrowser;
import de.sstoehr.harreader.model.HarEntry;
import de.sstoehr.harreader.model.HarHeader;
import de.sstoehr.harreader.model.HarLog;
import de.sstoehr.harreader.model.HarPostData;
import de.sstoehr.harreader.model.HarQueryParam;
import de.sstoehr.harreader.model.HarRequest;
import de.sstoehr.harreader.model.HarResponse;
import de.sstoehr.harreader.model.HttpMethod;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class HarOutputParser implements ProjectOutputParser {

    private final ObjectMapper objectMapper;

    public HarOutputParser(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public byte[] parse(Project project) throws IOException {
        var har = parseHar(project);

        return objectMapper.writeValueAsBytes(har);
    }

    @Override
    public boolean canParse(String extension) {
        return "har".equals(extension);
    }

    private Har parseHar(Project project) {
        var har = new Har();
        har.setLog(parseHarLog(project));

        return har;
    }

    private HarLog parseHarLog(Project project) {
        var harLog = new HarLog();
        harLog.setCreator(parseHarCreatorBrowser());
        harLog.setEntries(parseHarEntries(project.getTabs()));

        return harLog;
    }

    private HarCreatorBrowser parseHarCreatorBrowser() {
        var harCreatorBrowser = new HarCreatorBrowser();
        harCreatorBrowser.setName("Loki");
        harCreatorBrowser.setVersion("1.0.0");

        return harCreatorBrowser;
    }

    private List<HarEntry> parseHarEntries(List<Tab> tabs) {
        return tabs.stream()
                   .flatMap(tab -> tab.getRules()
                                      .stream()
                                      .map(rule -> parseHarEntry(tab.getUrl(), rule)))
                   .collect(Collectors.toList());
    }

    private HarEntry parseHarEntry(String url, Rule rule) {
        var harEntry = new HarEntry();
        harEntry.setStartedDateTime(Date.from(Instant.now()));
        harEntry.setTime(50);
        harEntry.setRequest(parseHarRequest(url, rule.getRequest()));
        harEntry.setResponse(parseHarResponse(rule.getResponse()));

        return harEntry;
    }

    private HarRequest parseHarRequest(String url, Request request) {
        var queryString = request.getParameters()
                                 .stream()
                                 .map(parameter -> String.format("%s=%s", parameter.getKey(), parameter.getValue()))
                                 .collect(Collectors.joining("&"));

        var harRequest = new HarRequest();
        harRequest.setMethod(HttpMethod.valueOf(request.getMethod()));
        harRequest.setUrl("http://" + url + "?" + queryString);
        harRequest.setHttpVersion("HTTP/1.1");
        harRequest.setHeaders(parseHarRequestHeaders(request.getHeaders()));
        harRequest.setQueryString(parseHarRequestParameters(request.getParameters()));
        harRequest.setPostData(parseHarRequestBody(request.getBody()));
        harRequest.setHeadersSize(-1L);
        harRequest.setBodySize(-1L);

        return harRequest;
    }

    private List<HarQueryParam> parseHarRequestParameters(List<ParameterWithCondition> parameters) {
        return parameters.stream()
                         .map(parameter -> {
                             var harQueryParam = new HarQueryParam();
                             harQueryParam.setName(parameter.getKey());
                             harQueryParam.setValue(parameter.getValue());

                             return harQueryParam;
                         })
                         .collect(Collectors.toList());
    }

    private List<HarHeader> parseHarRequestHeaders(List<HeaderWithCondition> headers) {
        return headers.stream()
                      .map(header -> {
                          var harHeader = new HarHeader();
                          harHeader.setName(header.getKey());
                          harHeader.setValue(header.getValue());

                          return harHeader;
                      })
                      .collect(Collectors.toList());
    }

    private HarPostData parseHarRequestBody(String body) {
        var harPostData = new HarPostData();
        harPostData.setText(body);

        return harPostData;
    }

    private HarResponse parseHarResponse(Response response) {
        var harResponse = new HarResponse();
        harResponse.setStatus(response.getStatusCode());
        harResponse.setHttpVersion("HTTP/1.1");
        harResponse.setHeaders(parseHarResponseHeaders(response.getHeaders()));
        harResponse.setContent(parseHarResponseBody(response.getBody()));
        harResponse.setHeadersSize(-1L);
        harResponse.setBodySize(-1L);

        return harResponse;
    }

    private List<HarHeader> parseHarResponseHeaders(List<Header> headers) {
        return headers.stream()
                      .map(header -> {
                          var harHeader = new HarHeader();
                          harHeader.setName(header.getKey());
                          harHeader.setValue(header.getValue());

                          return harHeader;
                      })
                      .collect(Collectors.toList());
    }

    private HarContent parseHarResponseBody(String body) {
        var harContent = new HarContent();
        harContent.setSize((long)body.getBytes(StandardCharsets.UTF_8).length);
        harContent.setText(body);

        return harContent;
    }
}
