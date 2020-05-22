package com.krzyszkowski.loki.agent.io.har;

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
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class HarInputParser implements ProjectInputParser {

    @Override
    public Project parse(byte[] project) throws IOException {
        try {
            var har = new HarReader().readFromString(new String(project));

            return parseProject(har.getLog());
        } catch (HarReaderException e) {
            throw new IOException(e);
        }
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
                                             var url = entry.getKey();

                                             if (url.startsWith("http://")) {
                                                 url = url.replaceFirst("http://", "");
                                             } else if (url.startsWith("https://")) {
                                                 url = url.replaceFirst("https://", "");
                                             }

                                             return Tab.builder()
                                                       .id(UUID.randomUUID().toString())
                                                       .name(url)
                                                       .url(url)
                                                       .rules(parseRules(entry.getValue()))
                                                       .build();
                                         })
                                         .collect(Collectors.toList());
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

    private List<Rule> parseRules(List<HarEntry> harEntries) {
        return harEntries.stream()
                         .map(harEntry -> Rule.builder()
                                              .active(true)
                                              .name("Untitled rule")
                                              .request(parseRequest(harEntry.getRequest()))
                                              .response(parseResponse(harEntry.getResponse()))
                                              .expanded(true)
                                              .build())
                         .collect(Collectors.toList());
    }

    private Request parseRequest(HarRequest harRequest) {
        return Request.builder()
                      .method(harRequest.getMethod().toString())
                      .methodCondition(Condition.EQUAL)
                      .parameters(parseRequestParameters(harRequest.getQueryString()))
                      .headers(parseRequestHeaders(harRequest.getHeaders()))
                      .body(harRequest.getPostData().getText())
                      .bodyCondition(harRequest.getBodySize() > 0 ? Condition.EQUAL : Condition.NOT_PRESENT)
                      .bodyIgnoreCase(false)
                      .bodyIgnoreWhitespace(false)
                      .expanded(true)
                      .parametersExpanded(true)
                      .headersExpanded(true)
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
                                                              .keyIgnoreCase(true)
                                                              .valueIgnoreCase(false)
                                                              .build())
                         .collect(Collectors.toList());
    }

    private Response parseResponse(HarResponse harResponse) {
        return Response.builder()
                       .statusCode(harResponse.getStatus())
                       .headers(parseResponseHeaders(harResponse.getHeaders()))
                       .body(harResponse.getContent().getText())
                       .expanded(true)
                       .headersExpanded(true)
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
                       .port(0)
                       .profile(Profile.STATIC)
                       .build();
    }
}
