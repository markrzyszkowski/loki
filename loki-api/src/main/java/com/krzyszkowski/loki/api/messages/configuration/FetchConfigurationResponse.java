package com.krzyszkowski.loki.api.messages.configuration;

import com.krzyszkowski.loki.api.configuration.Configuration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FetchConfigurationResponse {

    private Configuration configuration;
}
