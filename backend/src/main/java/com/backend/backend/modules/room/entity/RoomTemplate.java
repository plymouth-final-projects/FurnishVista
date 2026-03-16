package com.backend.backend.modules.room.entity;

import lombok.Builder;

@Builder
public record RoomTemplate(
        String id,
        String name,
        String description,
        String thumbnail,
        double width,
        double length,
        double height,
        String shape,
        String wallColor,
        String floorType,
        String floorColor,
        String ceilingColor
) {
}
