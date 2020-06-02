package com.krzyszkowski.loki.api.messages.mock;

import com.krzyszkowski.loki.api.mock.Mock;
import com.krzyszkowski.loki.api.mock.Settings;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StartMockRequest {

    @NotBlank(message = "Id cannot be empty")
    private String id;

    @Valid
    @NotNull(message = "Settings must be present")
    private Settings settings;

    @NotEmpty(message = "Mocks must be present")
    private List<@Valid Mock> mocks;
}
