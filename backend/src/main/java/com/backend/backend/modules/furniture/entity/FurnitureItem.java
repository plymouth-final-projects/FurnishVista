package com.backend.backend.modules.furniture.entity;

import lombok.Builder;

@Builder
public record FurnitureItem(
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
