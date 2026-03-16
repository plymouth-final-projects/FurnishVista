package com.backend.backend.common.util;

public final class CollisionDetector {

    private CollisionDetector() {
    }

    public static boolean overlaps(
            double x1, double z1, double w1, double l1,
            double x2, double z2, double w2, double l2
    ) {
        double left1 = x1 - (w1 / 2.0);
        double right1 = x1 + (w1 / 2.0);
        double top1 = z1 - (l1 / 2.0);
        double bottom1 = z1 + (l1 / 2.0);

        double left2 = x2 - (w2 / 2.0);
        double right2 = x2 + (w2 / 2.0);
        double top2 = z2 - (l2 / 2.0);
        double bottom2 = z2 + (l2 / 2.0);

        return left1 < right2 && right1 > left2 && top1 < bottom2 && bottom1 > top2;
    }
}
