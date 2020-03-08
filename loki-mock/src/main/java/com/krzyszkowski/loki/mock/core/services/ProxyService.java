package com.krzyszkowski.loki.mock.core.services;

import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface ProxyService {

    ResponseEntity<byte[]> forward(HttpServletRequest request, HttpServletResponse response);
}
