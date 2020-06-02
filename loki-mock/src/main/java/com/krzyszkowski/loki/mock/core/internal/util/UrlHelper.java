package com.krzyszkowski.loki.mock.core.internal.util;

import java.util.List;
import java.util.regex.Pattern;

public class UrlHelper {

    private static final List<Character> specialCharacters =
            List.of('<', '(', '[', '{', '\\', '^', '-', '=', '$', '!', '|', ']', '}', ')', '?', '*', '+', '.', '>');

    public static String stripProtocol(String url) {
        if (url.startsWith("http://")) {
            return url.replaceFirst("http://", "");
        }

        if (url.startsWith("https://")) {
            return url.replaceFirst("https://", "");
        }

        return url;
    }

    public static String stripEmptyPath(String url) {
        var pattern = Pattern.compile("([^/?]*)([^?]*)(.*)");
        var matcher = pattern.matcher(url);

        if (matcher.find()) {
            if (matcher.group(2).equals("/")) {
                return url.substring(0, url.length() - 1);
            }
        }

        return url;
    }

    public static String escapeSpecialCharacters(String url) {
        var builder = new StringBuilder();

        for (var i = 0; i < url.length(); i++) {
            var chr = url.charAt(i);
            builder.append(specialCharacters.contains(chr) ? String.format("\\%s", chr) : chr);
        }

        return builder.toString();
    }
}
