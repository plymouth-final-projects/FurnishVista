package com.backend.backend.modules.furniture.engine;

import com.backend.backend.common.util.CollisionDetector;
import org.springframework.stereotype.Component;

@Component
public class CollisionEngine {

    public boolean collides(
            double x1, double z1, double width1, double length1,
            double x2, double z2, double width2, double length2
    ) {
        return CollisionDetector.overlaps(x1, z1, width1, length1, x2, z2, width2, length2);
    }
}
