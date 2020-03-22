package com.krzyszkowski.loki.mock.spring.web;

import org.eclipse.jetty.proxy.ConnectHandler;
import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.handler.HandlerList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.embedded.jetty.JettyServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JettyWebServerCustomizer implements WebServerFactoryCustomizer<JettyServletWebServerFactory> {

    @Override
    public void customize(JettyServletWebServerFactory factory) {
        factory.addServerCustomizers(server -> {
            var handlerCollection = new HandlerList();
            handlerCollection.addHandler(server.getHandler());
            handlerCollection.addHandler(new LoggingConnectHandler());
            server.setHandler(handlerCollection);
        });
    }

    static class LoggingConnectHandler extends ConnectHandler {

        private static final Logger log = LoggerFactory.getLogger(LoggingConnectHandler.class);

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
