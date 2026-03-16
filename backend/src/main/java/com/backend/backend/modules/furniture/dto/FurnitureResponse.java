package com.backend.backend.modules.furniture.dto;

public record FurnitureResponse(
        String id,
        String name,
        String category,
        String modelPath,
        String thumbnail,
        double defaultWidth,
        double defaultLength,
        double defaultHeight,
        String color,
        String description
) {
}
