package com.krzyszkowski.loki.agent.core;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krzyszkowski.loki.agent.core.services.ProjectService;
import com.krzyszkowski.loki.api.messages.project.FetchProjectRequest;
import com.krzyszkowski.loki.api.messages.project.SaveProjectRequest;
import com.krzyszkowski.loki.api.project.Project;
import com.krzyszkowski.loki.api.project.Settings;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProjectController.class)
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProjectService projectService;

    @Test
    void openProjectWithEmptyRequest() throws Exception {
        mockMvc.perform(post("/api/project/open"))
               .andExpect(status().isBadRequest());
    }

    @Test
    void openProjectWithValidRequest() throws Exception {
        // given
        var request = FetchProjectRequest.builder().path("path").type("type").build();
        doReturn(Optional.of(new Project())).when(projectService).openProject(anyString());

        // when
        mockMvc.perform(post("/api/project/open")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isOk());

        // then
        verify(projectService, times(1)).openProject(anyString());
    }

    @Test
    void openProjectWithValidRequestAndErrors() throws Exception {
        // given
        var request = FetchProjectRequest.builder().path("path").type("type").build();
        doReturn(Optional.empty()).when(projectService).openProject(anyString());

        // when
        mockMvc.perform(post("/api/project/open")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isNotFound());

        // then
        verify(projectService, times(1)).openProject(anyString());
    }

    @Test
    void importProjectWithEmptyRequest() throws Exception {
        mockMvc.perform(post("/api/project/import"))
               .andExpect(status().isBadRequest());
    }

    @Test
    void importProjectWithValidRequest() throws Exception {
        // given
        var request = FetchProjectRequest.builder().path("path").type("type").build();
        doReturn(Optional.of(new Project())).when(projectService).importProject(anyString(), anyString());

        // when
        mockMvc.perform(post("/api/project/import")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isOk());

        // then
        verify(projectService, times(1)).importProject(anyString(), anyString());
    }

    @Test
    void importProjectWithValidRequestAndErrors() throws Exception {
        // given
        var request = FetchProjectRequest.builder().path("path").type("type").build();
        doReturn(Optional.empty()).when(projectService).importProject(anyString(), anyString());

        // when
        mockMvc.perform(post("/api/project/import")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isNotFound());

        // then
        verify(projectService, times(1)).importProject(anyString(), anyString());
    }

    @Test
    void exportProjectWithEmptyRequest() throws Exception {
        mockMvc.perform(post("/api/project/export"))
               .andExpect(status().isBadRequest());
    }

    @Test
    void exportProjectWithValidRequest() throws Exception {
        // given
        var request = SaveProjectRequest.builder().path("path").type("type").project(dummyProject()).build();
        doReturn(true).when(projectService).exportProject(anyString(), anyString(), any(Project.class));

        // when
        mockMvc.perform(post("/api/project/export")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isOk());

        // then
        verify(projectService, times(1))
                .exportProject(anyString(), anyString(), any(Project.class));
    }

    @Test
    void exportProjectWithValidRequestAndErrors() throws Exception {
        // given
        var request = SaveProjectRequest.builder().path("path").type("type").project(dummyProject()).build();
        doReturn(false).when(projectService).exportProject(anyString(), anyString(), any(Project.class));

        // when
        mockMvc.perform(post("/api/project/export")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isNotFound());

        // then
        verify(projectService, times(1))
                .exportProject(anyString(), anyString(), any(Project.class));
    }

    @Test
    void saveProjectWithEmptyRequest() throws Exception {
        mockMvc.perform(post("/api/project/export"))
               .andExpect(status().isBadRequest());
    }

    @Test
    void saveProjectWithValidRequest() throws Exception {
        // given
        var request = SaveProjectRequest.builder().path("path").type("type").project(dummyProject()).build();
        doReturn(true).when(projectService).saveProject(anyString(), any(Project.class));

        // when
        mockMvc.perform(post("/api/project/save")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isOk());

        // then
        verify(projectService, times(1))
                .saveProject(anyString(), any(Project.class));
    }

    @Test
    void saveProjectWithValidRequestAndErrors() throws Exception {
        // given
        var request = SaveProjectRequest.builder().path("path").type("type").project(dummyProject()).build();
        doReturn(false).when(projectService).saveProject(anyString(), any(Project.class));

        // when
        mockMvc.perform(post("/api/project/save")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isNotFound());

        // then
        verify(projectService, times(1))
                .saveProject(anyString(), any(Project.class));
    }

    private Project dummyProject() {
        return Project.builder()
                      .id("id")
                      .name("name")
                      .settings(Settings.builder()
                                        .maxRequestSize(10)
                                        .build())
                      .build();
    }
}
