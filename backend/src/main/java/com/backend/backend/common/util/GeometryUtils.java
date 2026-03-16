package com.backend.backend.common.util;

public final class GeometryUtils {

    private GeometryUtils() {
    }

    public static String roomDimensionLabel(double width, double length, double height) {
        return String.format("%.1fm × %.1fm × %.1fm", width, length, height);
    }
}
