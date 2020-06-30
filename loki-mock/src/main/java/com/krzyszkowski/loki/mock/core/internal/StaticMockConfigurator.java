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
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Component
@Profile("static")
public class StaticMockConfigurator implements MockConfigurator {

    private final RequestMappingHandlerMapping requestMappingHandlerMapping;
    private final MockConditionRepository mockConditionRepository;
    private final MockConditionCreator mockConditionCreator;
    private final MockService mockService;

    public StaticMockConfigurator(RequestMappingHandlerMapping requestMappingHandlerMapping,
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
        var urls = new LinkedHashMap<String, String>();

        configuration.getMocks()
                     .forEach(mock -> {
                         var urlHash = UUID.nameUUIDFromBytes(mock.getUrl().getBytes()).toString();

                         try {
                             registerMapping(urlHash);
                         } catch (NoSuchMethodException e) {
                             return;
                         }

                         urls.put(mock.getId(), urlHash);

                         var condition = mockConditionCreator.create(mock);

                         mockConditionRepository.addMock(urlHash, condition);
                     });

        return urls;
    }

    private void registerMapping(String urlHash) throws NoSuchMethodException {
        requestMappingHandlerMapping.registerMapping(RequestMappingInfo.paths(urlHash).build(),
                                                     mockService,
                                                     mockService.getClass().getDeclaredMethod("handle",
                                                                                              HttpServletRequest.class,
                                                                                              HttpServletResponse.class));
    }
}
