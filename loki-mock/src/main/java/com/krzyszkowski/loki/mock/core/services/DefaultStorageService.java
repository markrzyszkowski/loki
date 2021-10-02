package com.krzyszkowski.loki.mock.core.services;

import com.krzyszkowski.loki.mock.spring.io.DeleteOnCloseFileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class DefaultStorageService implements StorageService {

    private static final Path storage = Paths.get(System.getProperty("java.io.tmpdir"), "loki");

    public DefaultStorageService() throws IOException {
        Files.createDirectories(storage);
    }

    @Override
    public Path storeBody(InputStream bodyStream) {
        var path = Paths.get(storage.toString(), UUID.randomUUID().toString());
        try {
            Files.copy(bodyStream, path);
        } catch (IOException e) {
            return null;
        }
        return path;
    }

    @Override
    public Resource retrieveBodyAsResource(Path bodyPath) {
        return bodyPath != null ? new DeleteOnCloseFileSystemResource(bodyPath) : null;
    }
}
