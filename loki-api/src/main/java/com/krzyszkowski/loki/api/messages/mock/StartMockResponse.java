package com.krzyszkowski.loki.api.messages.mock;

import com.krzyszkowski.loki.api.configuration.AppliedConfiguration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StartMockResponse {

    private AppliedConfiguration appliedConfiguration;
}
