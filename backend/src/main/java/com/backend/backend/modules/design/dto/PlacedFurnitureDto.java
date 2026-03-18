package com.backend.backend.modules.design.dto;

public record PlacedFurnitureDto(
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
