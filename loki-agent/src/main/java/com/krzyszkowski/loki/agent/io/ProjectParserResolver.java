package com.krzyszkowski.loki.agent.io;

import com.krzyszkowski.loki.api.project.Project;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
public class ProjectParserResolver {

    private final List<ProjectInputParser> inputParsers;
    private final List<ProjectOutputParser> outputParsers;

    public ProjectParserResolver(List<ProjectInputParser> inputParsers, List<ProjectOutputParser> outputParsers) {
        this.inputParsers = inputParsers;
        this.outputParsers = outputParsers;
    }

    public Project parseInput(String path, String type) throws IOException {
        for (var parser : inputParsers) {
            if (parser.canParse(type)) {
                try {
                    var project = parser.parse(path);

                    log.info("{} has successfuly read project file", parser.getClass().getSimpleName());

                    return project;
                } catch (IOException e) {
                    log.error("{} was unable to read project file", parser.getClass().getSimpleName());
                    log.error("Exception: {}", e.toString());
                }
            }
        }

        throw new IOException("No available parser was able to read project file");
    }

    public void parseOutput(String path, String type, Project project) throws IOException {
        for (var parser : outputParsers) {
            if (parser.canParse(type)) {
                try {
                    parser.parse(path, project);

                    log.info("{} has successfully written project file", parser.getClass().getSimpleName());

                    return;
                } catch (IOException e) {
                    log.error("{} was unable to write project file", parser.getClass().getSimpleName());
                    log.error("Exception: {}", e.toString());
                }
            }
        }

        throw new IOException("No available parser was able to write project file");
    }
}
