package com.krzyszkowski.loki.mock.configuration.internal;

import com.krzyszkowski.loki.api.configuration.ConfigurationRequest;
import com.krzyszkowski.loki.mock.core.internal.MockRepository;
import com.krzyszkowski.loki.mock.core.services.MockService;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
@Profile("proxy")
public class ProxyMockConfigurator implements MockConfigurator {

    private final RequestMappingHandlerMapping requestMappingHandlerMapping;
    private final MockRepository mockRepository;
    private final MockService mockService;

    public ProxyMockConfigurator(RequestMappingHandlerMapping requestMappingHandlerMapping,
                                 MockRepository mockRepository,
                                 MockService mockService) {
        this.requestMappingHandlerMapping = requestMappingHandlerMapping;
        this.mockRepository = mockRepository;
        this.mockService = mockService;
    }

    @Override
    public Map<String, String> configure(ConfigurationRequest request) {
        var configuration = new HashMap<String, String>();

        try {
            registerMapping();
        } catch (NoSuchMethodException e) {
            return new HashMap<>();
        }

        request.getMocks().forEach(mock -> {
            configuration.put(mock.getUrl(), "**");

            mockRepository.addMock(mock.getUrl(), mock);
        });

        return configuration;
    }

    private void registerMapping() throws NoSuchMethodException {
        requestMappingHandlerMapping.registerMapping(RequestMappingInfo.paths("**").build(),
                                                     mockService,
                                                     mockService.getClass().getDeclaredMethod("handle",
                                                                                              HttpServletRequest.class,
                                                                                              HttpServletResponse.class));
    }
}
