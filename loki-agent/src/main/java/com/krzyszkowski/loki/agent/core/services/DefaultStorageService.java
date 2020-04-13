package com.krzyszkowski.loki.agent.core.services;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class DefaultStorageService implements StorageService {

    @Override
    public byte[] readFile(String path) throws IOException {
        return Files.readAllBytes(Path.of(path));
    }

    @Override
    public void writeFile(String path, byte[] bytes) throws IOException {
        Files.write(Path.of(path), bytes);
    }
}
