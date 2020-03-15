package com.krzyszkowski.loki.mock.core.services;

import org.springframework.core.io.Resource;

import java.io.InputStream;
import java.nio.file.Path;

public interface StorageService {

    Path storeBody(InputStream bodyStream);

    Resource retrieveBodyAsResource(Path bodyPath);
}
