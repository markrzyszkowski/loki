package com.krzyszkowski.loki.mock.properties;

import com.krzyszkowski.loki.mock.properties.validation.MaxDataSize;
import com.krzyszkowski.loki.mock.properties.validation.MinDataSize;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;
import org.springframework.util.unit.DataUnit;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

@Getter
@Setter
@Configuration
@ConfigurationProperties("loki.mock")
public class MockProperties {

    @MinDataSize(value = 1L, unit = DataUnit.MEGABYTES)
    @MaxDataSize(value = 1024L, unit = DataUnit.MEGABYTES)
    private DataSize maxRequestSize;

    private final Agent agent = new Agent();

    @Getter
    @Setter
    public static class Agent {

        @Min(1024)
        @Max(65535)
        private int port;
    }
}
