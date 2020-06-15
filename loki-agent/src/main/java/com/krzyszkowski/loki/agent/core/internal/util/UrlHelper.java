package com.krzyszkowski.loki.agent.core.internal.util;

public class UrlHelper {

    public static String stripProtocol(String url) {
        if (url.startsWith("http://")) {
            return url.replaceFirst("http://", "");
        }

        if (url.startsWith("https://")) {
            return url.replaceFirst("https://", "");
        }

        return url;
    }
}
