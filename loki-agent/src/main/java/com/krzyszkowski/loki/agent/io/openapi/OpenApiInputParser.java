package com.krzyszkowski.loki.agent.io.openapi;

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
import com.krzyszkowski.loki.api.project.UrlVariable;
import io.swagger.parser.OpenAPIParser;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.parameters.RequestBody;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.servers.Server;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;
import static java.util.Objects.requireNonNullElse;

@Component
public class OpenApiInputParser implements ProjectInputParser {

    @Override
    public Project parse(String path) throws IOException {
        var swagger = new OpenAPIParser().readLocation(path, null, null);

        if (swagger == null) {
            throw new IOException("Parser returned null");
        }

        return parseProject(swagger.getOpenAPI());
    }

    @Override
    public boolean canParse(String type) {
        return "openapi".equalsIgnoreCase(type);
    }

    private Project parseProject(OpenAPI openAPI) {
        return Project.builder()
                      .id(UUID.randomUUID().toString())
                      .tabs(parseTabs(openAPI.getPaths(), openAPI.getServers()))
                      .name("Imported OpenAPI project")
                      .settings(parseSettings())
                      .build();
    }

    private List<Tab> parseTabs(Paths paths, List<Server> servers) {
        var globalServers = filterDuplicateUrls(resolveServerVariables(servers));

        var rules = paths.entrySet()
                         .stream()
                         .map(entry -> {
                             var path = entry.getKey();
                             var pathItem = entry.getValue();
                             var pathServers = pathItem.getServers() != null && !pathItem.getServers().isEmpty()
                                     ? filterDuplicateUrls(resolveServerVariables(pathItem.getServers()))
                                     : globalServers;

                             return explodeOperations(path, pathItem, pathServers);
                         })
                         .collect(Collectors.toList());

        var current = new HashMap<String, List<Rule>>();
        for (var rule : rules) {
            joinRuleMaps(current, rule);
        }

        return current.entrySet()
                      .stream()
                      .map(urlRuleEntry -> Tab.builder()
                                              .id(UUID.randomUUID().toString())
                                              .name(urlRuleEntry.getKey())
                                              .url(urlRuleEntry.getKey())
                                              .rules(urlRuleEntry.getValue())
                                              .build())
                      .collect(Collectors.toList());
    }

    private Map<String, List<Rule>> explodeOperations(String path, PathItem pathItem, List<String> pathServers) {
        var rules = new HashMap<String, List<Rule>>();

        var pathParameters = pathItem.getParameters() != null ? pathItem.getParameters() : new ArrayList<Parameter>();

        var get = pathItem.getGet();
        if (get != null) {
            joinRuleMaps(rules, explodeOperation(get, "GET", pathServers, path, pathParameters));
        }

        var put = pathItem.getPut();
        if (put != null) {
            joinRuleMaps(rules, explodeOperation(put, "PUT", pathServers, path, pathParameters));
        }

        var post = pathItem.getPost();
        if (post != null) {
            joinRuleMaps(rules, explodeOperation(post, "POST", pathServers, path, pathParameters));
        }

        var delete = pathItem.getDelete();
        if (delete != null) {
            joinRuleMaps(rules, explodeOperation(delete, "DELETE", pathServers, path, pathParameters));
        }

        var options = pathItem.getOptions();
        if (options != null) {
            joinRuleMaps(rules, explodeOperation(options, "OPTIONS", pathServers, path, pathParameters));
        }

        var head = pathItem.getHead();
        if (head != null) {
            joinRuleMaps(rules, explodeOperation(head, "HEAD", pathServers, path, pathParameters));
        }

        var patch = pathItem.getPatch();
        if (patch != null) {
            joinRuleMaps(rules, explodeOperation(patch, "PATCH", pathServers, path, pathParameters));
        }

        var trace = pathItem.getTrace();
        if (trace != null) {
            joinRuleMaps(rules, explodeOperation(trace, "TRACE", pathServers, path, pathParameters));
        }

        return rules;
    }

    private Map<String, List<Rule>> explodeOperation(Operation operation,
                                                     String method,
                                                     List<String> pathServers,
                                                     String path,
                                                     List<Parameter> pathParameters) {
        var operationServers = operation.getServers() != null && !operation.getServers().isEmpty()
                ? filterDuplicateUrls(resolveServerVariables(operation.getServers()))
                : pathServers;
        var operationParameters = operation.getParameters() != null && !operation.getParameters().isEmpty()
                ? combineParameters(pathParameters, operation.getParameters())
                : pathParameters;

        var urls = operationServers.stream()
                                   .map(server -> server.concat(path))
                                   .collect(Collectors.toList());

        var responses = operation.getResponses();

        return urls.stream()
                   .collect(Collectors.toMap(
                           url -> url.replaceAll("\\{(.*?)}", "{{$1}}"),
                           url -> responses.entrySet()
                                           .stream()
                                           .map(response -> Rule.builder()
                                                                .id(UUID.randomUUID().toString())
                                                                .name("Imported rule")
                                                                .request(parseRequest(method,
                                                                                      operationParameters,
                                                                                      operation.getRequestBody()))
                                                                .response(parseResponse(response))
                                                                .active(true)
                                                                .expanded(true)
                                                                .build())
                                           .collect(Collectors.toList())));
    }

    private Request parseRequest(String method, List<Parameter> parameters, RequestBody body) {
        var groupedParameters = groupParametersByLocation(parameters);

        return Request.builder()
                      .method(method)
                      .methodCondition(Condition.EQUAL)
                      .urlVariables(parseUrlVariables(groupedParameters.getOrDefault("path", emptyList())))
                      .parameters(parseRequestParameters(groupedParameters.getOrDefault("query", emptyList())))
                      .headers(parseRequestHeaders(groupedParameters.getOrDefault("header", emptyList())))
                      .bodyCondition(body != null ? Condition.PRESENT : Condition.NOT_PRESENT)
                      .bodyIgnoreCase(false)
                      .bodyIgnoreWhitespace(false)
                      .expanded(true)
                      .urlVariablesExpanded(false)
                      .parametersExpanded(false)
                      .headersExpanded(false)
                      .build();
    }

    private List<UrlVariable> parseUrlVariables(List<Parameter> parameters) {
        return parameters.stream()
                         .map(variable -> UrlVariable.builder()
                                                     .key(variable.getName())
                                                     .build())
                         .collect(Collectors.toList());
    }

    private List<ParameterWithCondition> parseRequestParameters(List<Parameter> parameters) {
        return parameters.stream()
                         .map(parameter -> ParameterWithCondition.builder()
                                                                 .key(parameter.getName())
                                                                 .condition(Condition.PRESENT)
                                                                 .keyIgnoreCase(false)
                                                                 .valueIgnoreCase(false)
                                                                 .build())
                         .collect(Collectors.toList());
    }

    private List<HeaderWithCondition> parseRequestHeaders(List<Parameter> parameters) {
        return parameters.stream()
                         .map(header -> HeaderWithCondition.builder()
                                                           .key(header.getName())
                                                           .condition(Condition.PRESENT)
                                                           .valueIgnoreCase(false)
                                                           .build())
                         .collect(Collectors.toList());
    }

    private Response parseResponse(Map.Entry<String, ApiResponse> response) {
        return Response.builder()
                       .statusCode(response.getKey().equalsIgnoreCase("default")
                                           ? 0
                                           : Integer.parseInt(response.getKey()))
                       .headers(parseResponseHeaders(requireNonNullElse(response.getValue().getHeaders(), emptyMap())))
                       .delay(0)
                       .delayResponse(false)
                       .expanded(true)
                       .headersExpanded(false)
                       .build();
    }

    private List<Header> parseResponseHeaders(Map<String, io.swagger.v3.oas.models.headers.Header> headers) {
        return headers.keySet()
                      .stream()
                      .map(header -> Header.builder()
                                           .key(header)
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

    private List<String> resolveServerVariables(List<Server> servers) {
        return Objects.requireNonNullElse(servers, new ArrayList<Server>())
                      .stream()
                      .map(server -> {
                          var url = server.getUrl();

                          var serverVariables = server.getVariables();
                          if (serverVariables != null) {
                              for (var entry : serverVariables.entrySet()) {
                                  url = url.replaceAll(String.format("\\{%s\\}", entry.getKey()),
                                                       entry.getValue().getDefault());
                              }
                          }

                          return url;
                      })
                      .collect(Collectors.toList());
    }

    private List<String> filterDuplicateUrls(List<String> servers) {
        return servers.stream()
                      .map(UrlHelper::stripProtocol)
                      .distinct()
                      .collect(Collectors.toList());
    }

    private List<Parameter> combineParameters(List<Parameter> first, List<Parameter> second) {
        var firstParameterIdentityMap = mapParameterIdentity(first);
        var secondParameterIdentityMap = mapParameterIdentity(second);

        var combined = new ArrayList<>(second);

        firstParameterIdentityMap.forEach((key, value) -> {
            if (!secondParameterIdentityMap.containsKey(key)) {
                combined.add(value);
            }
        });

        return combined;
    }

    private void joinRuleMaps(Map<String, List<Rule>> original, Map<String, List<Rule>> joining) {
        joining.forEach((key, value) -> original.merge(key, value, (originalValue, joiningValue) -> {
            originalValue.addAll(joiningValue);

            return originalValue;
        }));
    }

    private Map<String, List<Parameter>> groupParametersByLocation(List<Parameter> parameters) {
        return parameters.stream().collect(Collectors.groupingBy(Parameter::getIn));
    }

    private Map<ParameterIdentity, Parameter> mapParameterIdentity(List<Parameter> parameters) {
        return parameters.stream()
                         .collect(Collectors.toMap(
                                 parameter -> ParameterIdentity.builder()
                                                               .name(parameter.getName())
                                                               .location(parameter.getIn())
                                                               .build(),
                                 Function.identity()));
    }

    @Data
    @Builder
    private static class ParameterIdentity {

        private String name;
        private String location;
    }
}
