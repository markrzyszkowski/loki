package com.krzyszkowski.loki.agent.core.services;

import java.io.IOException;

public interface StorageService {

    byte[] readFile(String path) throws IOException;

    void writeFile(String path, byte[] bytes) throws IOException;
}
