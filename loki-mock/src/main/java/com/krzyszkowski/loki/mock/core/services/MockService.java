package com.krzyszkowski.loki.mock.core.services;

import org.springframework.http.ResponseEntity;
import org.springframework.web.context.request.async.DeferredResult;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface MockService {

    DeferredResult<ResponseEntity<?>> handle(HttpServletRequest request, HttpServletResponse response);
}
