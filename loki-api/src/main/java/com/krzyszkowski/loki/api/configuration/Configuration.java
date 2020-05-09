package com.krzyszkowski.loki.api.configuration;

import com.krzyszkowski.loki.api.mock.Mock;
import com.krzyszkowski.loki.api.mock.Settings;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Configuration {

    private Settings settings;
    private List<Mock> mocks;
}
