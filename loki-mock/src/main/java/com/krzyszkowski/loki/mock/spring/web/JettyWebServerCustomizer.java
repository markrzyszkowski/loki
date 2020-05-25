package com.krzyszkowski.loki.mock.spring.web;

import lombok.extern.slf4j.Slf4j;
import org.eclipse.jetty.proxy.ConnectHandler;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.InetAccessHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.jetty.JettyServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JettyWebServerCustomizer implements WebServerFactoryCustomizer<JettyServletWebServerFactory> {

    @Value("${loki.mock.block-remote-requests}")
    private boolean blockRemoteRequests;

    @Override
    public void customize(JettyServletWebServerFactory factory) {
        factory.addServerCustomizers(server -> {
            var handlerCollection = new HandlerList();

            if (blockRemoteRequests) {
                handlerCollection.addHandler(new LoggingInetAccessHandler(server.getHandler()));
            } else {
                handlerCollection.addHandler(server.getHandler());
            }
            handlerCollection.addHandler(new LoggingConnectHandler());

            server.setHandler(handlerCollection);
        });
    }

    @Slf4j
    static class LoggingInetAccessHandler extends InetAccessHandler {

        public LoggingInetAccessHandler(Handler wrappedHandler) {
            setHandler(wrappedHandler);
            include("127.0.0.0-127.255.255.255");
            include("0:0:0:0:0:0:0:1");
        }

        @Override
        public void handle(String target,
                           Request baseRequest,
                           HttpServletRequest request,
                           HttpServletResponse response) throws ServletException, IOException {
            log.info("Received request from address {}", baseRequest.getRemoteAddr());
            super.handle(target, baseRequest, request, response);
        }
    }

    @Slf4j
    static class LoggingConnectHandler extends ConnectHandler {

        @Override
        public void handle(String target,
                           Request baseRequest,
                           HttpServletRequest request,
                           HttpServletResponse response) throws ServletException, IOException {
            log.info("Received HTTP CONNECT for {}", baseRequest.getRootURL());
            super.handle(target, baseRequest, request, response);
        }
    }
}
