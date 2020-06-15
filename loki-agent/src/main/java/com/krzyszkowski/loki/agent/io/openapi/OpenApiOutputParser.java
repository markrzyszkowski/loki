package com.krzyszkowski.loki.agent.io.openapi;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;
import com.krzyszkowski.loki.agent.core.services.StorageService;
import com.krzyszkowski.loki.agent.io.ProjectOutputParser;
import com.krzyszkowski.loki.api.project.Condition;
import com.krzyszkowski.loki.api.project.Header;
import com.krzyszkowski.loki.api.project.HeaderWithCondition;
import com.krzyszkowski.loki.api.project.ParameterWithCondition;
import com.krzyszkowski.loki.api.project.Project;
import com.krzyszkowski.loki.api.project.Rule;
import com.krzyszkowski.loki.api.project.Tab;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
public class OpenApiOutputParser implements ProjectOutputParser {

    private StorageService storageService;
    private ObjectMapper defaultObjectMapper;
    private ObjectMapper yamlObjectMapper;

    public OpenApiOutputParser(StorageService storageService) {
        this.storageService = storageService;
        this.defaultObjectMapper = createJsonObjectMapper();
        this.yamlObjectMapper = createYamlObjectMapper();
    }

    @Override
    public void parse(String path, Project project) throws IOException {
        OpenAPI openAPI = parseOpenApi(project);

        byte[] bytes;

        if (path.endsWith(".json")) {
            bytes = defaultObjectMapper.writeValueAsBytes(openAPI);
        } else if (path.endsWith(".yaml") || path.endsWith(".yml")) {
            bytes = yamlObjectMapper.writeValueAsBytes(openAPI);
        } else {
            throw new IOException("Path with unrecognized extension detected");
        }

        storageService.writeFile(path, bytes);
    }

    @Override
    public boolean canParse(String type) {
        return "openapi".equalsIgnoreCase(type);
    }

    private OpenAPI parseOpenApi(Project project) {
        return new OpenAPI()
                .info(parseInfo(project.getName()))
                .paths(parsePaths(project.getTabs()));
    }

    private Info parseInfo(String title) {
        return new Info()
                .title(title)
                .version("1.0.0");
    }

    private Paths parsePaths(List<Tab> tabs) {
        var paths = new Paths();

        paths.putAll(tabs.stream()
                         .collect(Collectors.toMap(tab -> getPath(tab.getUrl()),
                                                   this::parsePathItem)));

        return paths;
    }

    private PathItem parsePathItem(Tab tab) {
        var url = tab.getUrl();

        var rules = groupRulesByMethod(tab.getRules());

        return new PathItem()
                .servers(parseServers(url))
                .get(parseOperation(url, rules.get("GET")))
                .put(parseOperation(url, rules.get("PUT")))
                .post(parseOperation(url, rules.get("POST")))
                .delete(parseOperation(url, rules.get("DELETE")))
                .options(parseOperation(url, rules.get("OPTIONS")))
                .head(parseOperation(url, rules.get("HEAD")))
                .patch(parseOperation(url, rules.get("PATCH")))
                .trace(parseOperation(url, rules.get("TRACE")));
    }

    private List<Server> parseServers(String url) {
        return List.of(new Server().url(getServer(url)));
    }

    private Operation parseOperation(String url, List<Rule> rules) {
        if (rules == null || rules.isEmpty()) {
            return null;
        }

        return new Operation().parameters(parseParameters(url, rules))
                              .responses(parseResponses(rules));
    }

    private List<Parameter> parseParameters(String url, List<Rule> rules) {
        var parameters = new ArrayList<Parameter>();

        parameters.addAll(parsePathParameters(url));
        parameters.addAll(parseQueryParameters(rules));
        parameters.addAll(parseHeaderParameters(rules));

        return parameters.isEmpty() ? null : parameters;
    }

    private List<Parameter> parsePathParameters(String url) {
        return getUrlVariables(url).stream()
                                   .map(name -> new Parameter().name(name)
                                                               .in("path")
                                                               .schema(new Schema<>().type("string")))
                                   .collect(Collectors.toList());
    }

    private List<Parameter> parseQueryParameters(List<Rule> rules) {
        return rules.stream()
                    .flatMap(rule -> rule.getRequest().getParameters().stream())
                    .filter(parameter -> parameter.getCondition() != Condition.NOT_PRESENT)
                    .map(ParameterWithCondition::getKey)
                    .distinct()
                    .map(name -> new Parameter().name(name)
                                                .in("query")
                                                .schema(new Schema<>().type("string")))
                    .collect(Collectors.toList());
    }

    private List<Parameter> parseHeaderParameters(List<Rule> rules) {
        return rules.stream()
                    .flatMap(rule -> rule.getRequest().getHeaders().stream())
                    .filter(header -> header.getCondition() != Condition.NOT_PRESENT)
                    .map(HeaderWithCondition::getKey)
                    .distinct()
                    .map(name -> new Parameter().name(name)
                                                .in("header")
                                                .schema(new Schema<>().type("string")))
                    .collect(Collectors.toList());
    }

    private ApiResponses parseResponses(List<Rule> rules) {
        var apiResponses = new ApiResponses();

        rules.forEach(rule -> {
            var response = rule.getResponse();

            var headers = response.getHeaders()
                                  .stream()
                                  .collect(Collectors.toMap(
                                          Header::getKey,
                                          header -> new io.swagger.v3.oas.models.headers.Header()
                                                  .schema(new Schema<>().type("string"))));

            var apiResponse = new ApiResponse().description(rule.getName())
                                               .headers(headers.isEmpty() ? null : headers);

            apiResponses.addApiResponse(String.valueOf(response.getStatusCode()), apiResponse);
        });

        return apiResponses.isEmpty() ? null : apiResponses;
    }

    private String getServer(String url) {
        try {
            return "http://" + new URL("http://" + url).getHost();
        } catch (MalformedURLException e) {
            return null;
        }
    }

    private String getPath(String url) {
        try {
            return new URL("http://" + url)
                    .getPath()
                    .replaceAll("\\{\\{(.*?)}}", "{$1}");
        } catch (MalformedURLException e) {
            return null;
        }
    }

    private Map<String, List<Rule>> groupRulesByMethod(List<Rule> rules) {
        return rules.stream().collect(Collectors.groupingBy(rule -> rule.getRequest().getMethod()));
    }

    private List<String> getUrlVariables(String url) {
        return Pattern.compile("\\{\\{(.*?)}}")
                      .matcher(url)
                      .results()
                      .map(result -> result.group(1))
                      .collect(Collectors.toList());
    }

    private ObjectMapper createJsonObjectMapper() {
        var objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        return objectMapper;
    }

    private ObjectMapper createYamlObjectMapper() {
        var yamlFactory = new YAMLFactory();
        yamlFactory.disable(YAMLGenerator.Feature.WRITE_DOC_START_MARKER);

        var objectMapper = new ObjectMapper(yamlFactory);
        objectMapper.findAndRegisterModules();
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        return objectMapper;
    }
}
