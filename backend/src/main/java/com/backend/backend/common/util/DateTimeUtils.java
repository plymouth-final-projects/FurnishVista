package com.backend.backend.common.util;

import java.time.Instant;

public final class DateTimeUtils {

    private DateTimeUtils() {
    }

    public static String nowIso() {
        return Instant.now().toString();
    }
}
