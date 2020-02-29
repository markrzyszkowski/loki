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

@Component
@Profile("static")
public class StaticMockConfigurator implements MockConfigurator {

    private final RequestMappingHandlerMapping requestMappingHandlerMapping;
    private final MockRepository mockRepository;
    private final MockService mockService;

    public StaticMockConfigurator(RequestMappingHandlerMapping requestMappingHandlerMapping,
                                  MockRepository mockRepository,
                                  MockService mockService) {
        this.requestMappingHandlerMapping = requestMappingHandlerMapping;
        this.mockRepository = mockRepository;
        this.mockService = mockService;
    }

    @Override
    public Map<String, String> configure(ConfigurationRequest request) {
        var configuration = new HashMap<String, String>();

        request.getMocks()
               .forEach(mock -> {
                   var urlHash = UUID.nameUUIDFromBytes(mock.getUrl().getBytes()).toString();

                   try {
                       registerMapping(urlHash);
                   } catch (NoSuchMethodException e) {
                       return;
                   }

                   configuration.put(mock.getUrl(), urlHash);

                   mockRepository.addMock(urlHash, mock);
               });

        return configuration;
    }

    private void registerMapping(String urlHash) throws NoSuchMethodException {
        requestMappingHandlerMapping.registerMapping(RequestMappingInfo.paths(urlHash).build(),
                                                     mockService,
                                                     mockService.getClass().getDeclaredMethod("handle",
                                                                                              HttpServletRequest.class,
                                                                                              HttpServletResponse.class));
    }
}
