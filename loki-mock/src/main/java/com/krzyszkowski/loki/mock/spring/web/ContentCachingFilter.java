package com.krzyszkowski.loki.mock.spring.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.unit.DataSize;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Order(Ordered.HIGHEST_PRECEDENCE)
@Component
@WebFilter(filterName = "ContentCachingFilter", urlPatterns = "/*")
public class ContentCachingFilter extends OncePerRequestFilter {

    @Value("${loki.mock.max-request-size}")
    private DataSize maxRequestSize;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        var stream = request.getInputStream();

        byte[] body = stream.readNBytes((int)maxRequestSize.toBytes());
        if (!stream.isFinished()) {
            response.setStatus(413);
            response.getOutputStream()
                    .write(String.format("Body size exceeds maximum configured %s MB", maxRequestSize.toMegabytes())
                                 .getBytes());
            return;
        }

        filterChain.doFilter(new CachedBodyHttpServletRequest(body, request), response);
    }
}


