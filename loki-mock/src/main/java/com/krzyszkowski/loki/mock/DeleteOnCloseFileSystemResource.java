package com.krzyszkowski.loki.mock;

import org.springframework.core.io.FileSystemResource;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;

public class DeleteOnCloseFileSystemResource extends FileSystemResource {

    public DeleteOnCloseFileSystemResource(Path filePath) {
        super(filePath);
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return new DeleteOnCloseFileInputStream(getFile());
    }
}
