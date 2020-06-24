package com.krzyszkowski.loki.agent.core;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krzyszkowski.loki.agent.core.services.ConfigurationService;
import com.krzyszkowski.loki.agent.core.services.MockService;
import com.krzyszkowski.loki.api.configuration.Configuration;
import com.krzyszkowski.loki.api.messages.configuration.FetchConfigurationRequest;
import com.krzyszkowski.loki.api.messages.configuration.ReadyRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ConfigurationController.class)
class ConfigurationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ConfigurationService configurationService;

    @MockBean
    private MockService mockService;

    @Test
    void configurationWithEmptyRequest() throws Exception {
        mockMvc.perform(post("/api/config"))
               .andExpect(status().isBadRequest());
    }

    @Test
    void configurationWithValidRequest() throws Exception {
        // given
        var request = FetchConfigurationRequest.builder().id("id").build();
        doReturn(Optional.of(new Configuration())).when(configurationService).fetchConfiguration(anyString());

        // when
        mockMvc.perform(post("/api/config")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isOk());

        // then
        verify(configurationService, times(1)).fetchConfiguration(anyString());
    }

    @Test
    void configurationWithValidRequestAndErrors() throws Exception {
        // given
        var request = FetchConfigurationRequest.builder().id("id").build();
        doReturn(Optional.empty()).when(configurationService).fetchConfiguration(anyString());

        // when
        mockMvc.perform(post("/api/config")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isNotFound());

        // then
        verify(configurationService, times(1)).fetchConfiguration(anyString());
    }

    @Test
    void readyWithEmptyRequest() throws Exception {
        mockMvc.perform(post("/api/config/ready"))
               .andExpect(status().isBadRequest());
    }

    @Test
    void readyWithValidRequest() throws Exception {
        // given
        var request = ReadyRequest.builder().id("id").urls(Map.of("key", "value")).build();

        // when
        mockMvc.perform(post("/api/config/ready")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isOk());

        // then
        verify(mockService, times(1)).markAsReady(anyString(), anyMap());
    }
}
