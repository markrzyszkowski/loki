package com.krzyszkowski.loki.agent.io.har;

import com.krzyszkowski.loki.agent.core.internal.util.UrlHelper;
import com.krzyszkowski.loki.agent.io.ProjectInputParser;
import com.krzyszkowski.loki.api.project.Condition;
import com.krzyszkowski.loki.api.project.Header;
import com.krzyszkowski.loki.api.project.HeaderWithCondition;
import com.krzyszkowski.loki.api.project.ParameterWithCondition;
import com.krzyszkowski.loki.api.project.Profile;
import com.krzyszkowski.loki.api.project.Project;
import com.krzyszkowski.loki.api.project.Request;
import com.krzyszkowski.loki.api.project.Response;
import com.krzyszkowski.loki.api.project.Rule;
import com.krzyszkowski.loki.api.project.Settings;
import com.krzyszkowski.loki.api.project.Tab;
import de.sstoehr.harreader.HarReader;
import de.sstoehr.harreader.HarReaderException;
import de.sstoehr.harreader.model.HarEntry;
import de.sstoehr.harreader.model.HarHeader;
import de.sstoehr.harreader.model.HarLog;
import de.sstoehr.harreader.model.HarQueryParam;
import de.sstoehr.harreader.model.HarRequest;
import de.sstoehr.harreader.model.HarResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class HarInputParser implements ProjectInputParser {

    @Override
    public Project parse(String path) throws IOException {
        try {
            var har = new HarReader().readFromString(path);

            return parseProject(har.getLog());
        } catch (HarReaderException e) {
            throw new IOException(e);
        }
    }

    @Override
    public boolean canParse(String type) {
        return "har".equalsIgnoreCase(type);
    }

    private Project parseProject(HarLog harLog) {
        return Project.builder()
                      .id(UUID.randomUUID().toString())
                      .tabs(parseTabs(harLog.getEntries()))
                      .name("Imported HAR project")
                      .settings(parseSettings())
                      .build();
    }

    private List<Tab> parseTabs(List<HarEntry> harEntries) {
        return groupTabsByUrl(harEntries).entrySet()
                                         .stream()
                                         .filter(entry -> entry.getKey() != null)
                                         .map(entry -> {
                                             var url = UrlHelper.stripProtocol(entry.getKey());

                                             return Tab.builder()
                                                       .id(UUID.randomUUID().toString())
                                                       .name(url)
                                                       .url(url)
                                                       .rules(parseRules(entry.getValue()))
                                                       .build();
                                         })
                                         .collect(Collectors.toList());
    }

    private List<Rule> parseRules(List<HarEntry> harEntries) {
        return harEntries.stream()
                         .map(harEntry -> Rule.builder()
                                              .id(UUID.randomUUID().toString())
                                              .name("Imported rule")
                                              .request(parseRequest(harEntry.getRequest()))
                                              .response(parseResponse(harEntry.getResponse()))
                                              .active(true)
                                              .expanded(true)
                                              .build())
                         .collect(Collectors.toList());
    }

    private Request parseRequest(HarRequest harRequest) {
        return Request.builder()
                      .method(harRequest.getMethod().toString())
                      .methodCondition(Condition.EQUAL)
                      .urlVariables(Collections.emptyList())
                      .parameters(parseRequestParameters(harRequest.getQueryString()))
                      .headers(parseRequestHeaders(harRequest.getHeaders()))
                      .body(harRequest.getPostData().getText())
                      .bodyCondition(harRequest.getBodySize() > 0 ? Condition.EQUAL : Condition.NOT_PRESENT)
                      .bodyIgnoreCase(false)
                      .bodyIgnoreWhitespace(false)
                      .expanded(true)
                      .urlVariablesExpanded(false)
                      .parametersExpanded(false)
                      .headersExpanded(false)
                      .build();
    }

    private List<ParameterWithCondition> parseRequestParameters(List<HarQueryParam> harQueryParams) {
        return harQueryParams.stream()
                             .map(harQueryParam -> ParameterWithCondition.builder()
                                                                         .key(harQueryParam.getName())
                                                                         .value(harQueryParam.getValue())
                                                                         .condition(Condition.EQUAL)
                                                                         .keyIgnoreCase(false)
                                                                         .valueIgnoreCase(false)
                                                                         .build())
                             .collect(Collectors.toList());
    }

    private List<HeaderWithCondition> parseRequestHeaders(List<HarHeader> harHeaders) {
        return harHeaders.stream()
                         .filter(harHeader -> !harHeader.getName().startsWith(":"))
                         .map(harHeader -> HeaderWithCondition.builder()
                                                              .key(harHeader.getName())
                                                              .value(harHeader.getValue())
                                                              .condition(Condition.EQUAL)
                                                              .valueIgnoreCase(false)
                                                              .build())
                         .collect(Collectors.toList());
    }

    private Response parseResponse(HarResponse harResponse) {
        return Response.builder()
                       .statusCode(harResponse.getStatus())
                       .headers(parseResponseHeaders(harResponse.getHeaders()))
                       .body(harResponse.getContent().getText())
                       .delay(0)
                       .delayResponse(false)
                       .expanded(true)
                       .headersExpanded(false)
                       .build();
    }

    private List<Header> parseResponseHeaders(List<HarHeader> harHeaders) {
        return harHeaders.stream()
                         .map(harHeader -> Header.builder()
                                                 .key(harHeader.getName())
                                                 .value(harHeader.getValue())
                                                 .build())
                         .collect(Collectors.toList());
    }

    private Settings parseSettings() {
        return Settings.builder()
                       .profile(Profile.STATIC)
                       .port(0)
                       .blockRemoteRequests(false)
                       .maxRequestSize(10)
                       .build();
    }

    private Map<String, List<HarEntry>> groupTabsByUrl(List<HarEntry> harEntries) {
        return harEntries.stream()
                         .collect(Collectors.groupingBy(harEntry -> {
                             try {
                                 var uri = new URI(harEntry.getRequest().getUrl());

                                 return new URI(uri.getScheme(),
                                                uri.getAuthority(),
                                                uri.getPath(),
                                                null,
                                                null).toString();
                             } catch (URISyntaxException e) {
                                 return null;
                             }
                         }));
    }
}
