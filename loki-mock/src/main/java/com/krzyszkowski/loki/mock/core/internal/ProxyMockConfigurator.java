package com.krzyszkowski.loki.mock.core.internal;

import com.krzyszkowski.loki.api.configuration.Configuration;
import com.krzyszkowski.loki.mock.core.internal.conditions.MockConditionCreator;
import com.krzyszkowski.loki.mock.core.services.MockService;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@Component
@Profile("proxy")
public class ProxyMockConfigurator implements MockConfigurator {

    private final RequestMappingHandlerMapping requestMappingHandlerMapping;
    private final MockConditionRepository mockConditionRepository;
    private final MockConditionCreator mockConditionCreator;
    private final MockService mockService;

    public ProxyMockConfigurator(RequestMappingHandlerMapping requestMappingHandlerMapping,
                                 MockConditionRepository mockConditionRepository,
                                 MockConditionCreator mockConditionCreator,
                                 MockService mockService) {
        this.requestMappingHandlerMapping = requestMappingHandlerMapping;
        this.mockConditionRepository = mockConditionRepository;
        this.mockConditionCreator = mockConditionCreator;
        this.mockService = mockService;
    }

    @Override
    public Map<String, String> configure(Configuration configuration) {
        var urls = new HashMap<String, String>();

        try {
            registerMapping();
        } catch (NoSuchMethodException e) {
            return new HashMap<>();
        }

        configuration.getMocks().forEach(mock -> {
            urls.put(mock.getId(), "**");

            var condition = mockConditionCreator.create(mock);

            mockConditionRepository.addMock(mock.getUrl(), condition);
        });

        return urls;
    }

    private void registerMapping() throws NoSuchMethodException {
        requestMappingHandlerMapping.registerMapping(RequestMappingInfo.paths("**").build(),
                                                     mockService,
                                                     mockService.getClass().getDeclaredMethod("handle",
                                                                                              HttpServletRequest.class,
                                                                                              HttpServletResponse.class));
    }
}
