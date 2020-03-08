package com.krzyszkowski.loki.mock;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;

public class CachedBodyHttpServletRequest extends HttpServletRequestWrapper {

    private byte[] body;

    public CachedBodyHttpServletRequest(byte[] body, HttpServletRequest request) {
        super(request);
        this.body = body;
    }

    @Override
    public ServletInputStream getInputStream() {
        return new CachedBodyServletInputStream(this.body);
    }

    @Override
    public BufferedReader getReader() {
        return new BufferedReader(new InputStreamReader(new ByteArrayInputStream(this.body)));
    }
}
