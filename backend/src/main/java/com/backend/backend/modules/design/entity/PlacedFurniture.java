package com.backend.backend.modules.design.entity;

import lombok.Builder;

@Builder
public record PlacedFurniture(
        String id,
        String furnitureId,
        Position position,
        double rotation,
        double scale,
        String color,
        double shading
) {
    public record Position(double x, double y, double z) {
    }
}
