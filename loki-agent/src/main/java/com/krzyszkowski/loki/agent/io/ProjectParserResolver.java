package com.krzyszkowski.loki.agent.io;

import com.krzyszkowski.loki.api.project.Project;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class ProjectParserResolver {

    private final List<ProjectInputParser> inputParsers;
    private final List<ProjectOutputParser> outputParsers;

    public ProjectParserResolver(List<ProjectInputParser> inputParsers, List<ProjectOutputParser> outputParsers) {
        this.inputParsers = inputParsers;
        this.outputParsers = outputParsers;
    }

    public Project parseInput(byte[] project) {
        for (var parser : inputParsers) {
            try {
                return parser.parse(project);
            } catch (IOException e) {
                // TODO log
            }
        }

        return null;
    }

    public byte[] parseOutput(String extension, Project project) {
        for (var parser : outputParsers) {
            if (parser.canParse(extension)) {
                try {
                    return parser.parse(project);
                } catch (IOException e) {
                    // TODO log
                }
            }
        }

        return null;
    }
}
