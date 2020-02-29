package com.krzyszkowski.loki.api.configuration;

import com.krzyszkowski.loki.api.mock.Mock;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfigurationRequest {

    private List<Mock> mocks;
}
