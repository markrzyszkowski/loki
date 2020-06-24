package com.krzyszkowski.loki.agent.core;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krzyszkowski.loki.agent.core.services.MockService;
import com.krzyszkowski.loki.api.configuration.AppliedConfiguration;
import com.krzyszkowski.loki.api.messages.mock.StartMockRequest;
import com.krzyszkowski.loki.api.messages.mock.StopMockRequest;
import com.krzyszkowski.loki.api.mock.Mock;
import com.krzyszkowski.loki.api.mock.Settings;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MockController.class)
class MockControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MockService mockService;

    @Test
    void startWithEmptyRequest() throws Exception {
        mockMvc.perform(post("/api/mock/start"))
               .andExpect(status().isBadRequest());
    }

    @Test
    void startWithValidRequest() throws Exception {
        // given
        var request = StartMockRequest.builder().id("id").settings(dummySettings()).mocks(dummyMocks()).build();
        doReturn(Optional.of(new AppliedConfiguration())).when(mockService)
                                                         .startMock(anyString(), any(Settings.class), anyList());

        // when
        mockMvc.perform(post("/api/mock/start")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isOk());

        // then
        verify(mockService, times(1)).startMock(anyString(), any(Settings.class), anyList());
    }

    @Test
    void startWithValidRequestAndErrors() throws Exception {
        // given
        var request = StartMockRequest.builder().id("id").settings(dummySettings()).mocks(dummyMocks()).build();
        doReturn(Optional.empty()).when(mockService).startMock(anyString(), any(Settings.class), anyList());

        // when
        mockMvc.perform(post("/api/mock/start")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isNotFound());

        // then
        verify(mockService, times(1)).startMock(anyString(), any(Settings.class), anyList());
    }

    @Test
    void stopWithEmptyRequest() throws Exception {
        mockMvc.perform(post("/api/mock/stop"))
               .andExpect(status().isBadRequest());
    }

    @Test
    void stopWithValidRequest() throws Exception {
        // given
        var request = StopMockRequest.builder().id("id").build();
        doReturn(true).when(mockService).stopMock(anyString());

        // when
        mockMvc.perform(post("/api/mock/stop")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isOk());

        // then
        verify(mockService, times(1)).stopMock(anyString());
    }

    @Test
    void stopWithValidRequestAndErrors() throws Exception {
        // given
        var request = StopMockRequest.builder().id("id").build();
        doReturn(false).when(mockService).stopMock(anyString());

        // when
        mockMvc.perform(post("/api/mock/stop")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isBadRequest());

        // then
        verify(mockService, times(1)).stopMock(anyString());
    }

    private Settings dummySettings() {
        return Settings.builder()
                       .maxRequestSize(10)
                       .build();
    }

    private List<Mock> dummyMocks() {
        return List.of(Mock.builder()
                           .id("id")
                           .url("url")
                           .build());
    }
}
