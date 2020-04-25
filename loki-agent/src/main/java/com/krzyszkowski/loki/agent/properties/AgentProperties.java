package com.krzyszkowski.loki.agent.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

@Getter
@Setter
@Configuration
@ConfigurationProperties("loki.agent")
public class AgentProperties {

    private final Electron electron = new Electron();
    private final Mock mock = new Mock();

    @Getter
    @Setter
    public static class Electron {

        @Min(1024)
        @Max(65535)
        private int port;
    }

    @Getter
    @Setter
    public static class Mock {

        private String jar;
    }
}
