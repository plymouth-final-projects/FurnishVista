package com.backend.backend.common.util;

public final class SnapToGridHelper {

    private SnapToGridHelper() {
    }

    public static double snap(double value, double gridSize) {
        if (gridSize <= 0) {
            return value;
        }
        return Math.round(value / gridSize) * gridSize;
    }
}
