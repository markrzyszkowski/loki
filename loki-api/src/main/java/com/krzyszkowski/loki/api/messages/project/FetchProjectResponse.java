package com.krzyszkowski.loki.api.messages.project;

import com.krzyszkowski.loki.api.project.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FetchProjectResponse {

    private Project project;
}
