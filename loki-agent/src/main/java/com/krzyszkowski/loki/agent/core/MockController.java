package com.krzyszkowski.loki.agent.core;

import com.krzyszkowski.loki.agent.core.internal.util.Mappers;
import com.krzyszkowski.loki.agent.core.services.MockService;
import com.krzyszkowski.loki.api.messages.ErrorResponse;
import com.krzyszkowski.loki.api.messages.mock.StartMockRequest;
import com.krzyszkowski.loki.api.messages.mock.StartMockResponse;
import com.krzyszkowski.loki.api.messages.mock.StopMockRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/mock")
public class MockController {

    private final MockService mockService;

    public MockController(MockService mockService) {
        this.mockService = mockService;
    }

    @PostMapping("/start")
    public ResponseEntity<?> start(@Valid @RequestBody StartMockRequest startMockRequest, Errors errors) {
        if (errors.hasErrors()) {
            var errorResponse = Mappers.parseErrors(errors);

            log.error("Received malformed request to start mock");
            log.error("Errors: {}", errorResponse.getErrors());

            return ResponseEntity.badRequest().body(errorResponse);
        }

        var id = startMockRequest.getId();
        var settings = startMockRequest.getSettings();
        var mocks = startMockRequest.getMocks();

        log.debug("Received request to start mock with id {}", id);

        var urlsOptional = mockService.startMock(id, settings, mocks);

        return urlsOptional.isPresent()
                ? ResponseEntity.ok(StartMockResponse.builder()
                                                     .urls(urlsOptional.get())
                                                     .build())
                : ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(ErrorResponse.builder()
                                                   .errors(List.of("Could not start mock"))
                                                   .build());
    }

    @PostMapping("/stop")
    public ResponseEntity<?> stop(@Valid @RequestBody StopMockRequest stopMockRequest, Errors errors) {
        if (errors.hasErrors()) {
            var errorResponse = Mappers.parseErrors(errors);

            log.error("Received malformed request to stop mock");
            log.error("Errors: {}", errorResponse.getErrors());

            return ResponseEntity.badRequest().body(errorResponse);
        }

        var id = stopMockRequest.getId();

        log.debug("Received request to stop mock with id {}", id);

        var mockStopped = mockService.stopMock(id);

        return mockStopped
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(ErrorResponse.builder()
                                                   .errors(List.of("Could not stop mock as it was not running"))
                                                   .build());
    }
}
