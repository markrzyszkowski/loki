package com.krzyszkowski.loki.api.project;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Settings {

    private Profile profile;

    @Min(0)
    @Max(65535)
    private int port;

    private boolean blockRemoteRequests;

    @Min(1)
    @Max(1024)
    private int maxRequestSize;
}
