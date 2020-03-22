package com.krzyszkowski.loki.mock.spring.io;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class DeleteOnCloseFileInputStream extends FileInputStream {

    private Path path;

    public DeleteOnCloseFileInputStream(File file) throws FileNotFoundException {
        super(file);
        this.path = file.toPath();
    }

    @Override
    public void close() throws IOException {
        super.close();
        Files.delete(path);
    }
}
