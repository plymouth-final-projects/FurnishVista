package com.backend.backend.modules.furniture.engine;

import org.springframework.stereotype.Component;

@Component
public class BoundaryValidator {

    public boolean withinBounds(double x, double z, double roomWidth, double roomLength) {
        return x >= 0 && z >= 0 && x <= roomWidth && z <= roomLength;
    }
}
