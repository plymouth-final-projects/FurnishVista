package com.backend.backend.modules.room.dto;

public record RoomResponse(
        String id,
        String name,
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
