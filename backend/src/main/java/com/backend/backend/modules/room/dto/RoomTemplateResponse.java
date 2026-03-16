package com.backend.backend.modules.room.dto;

public record RoomTemplateResponse(
        String id,
        String name,
        String description,
        String thumbnail,
        RoomTemplateRoomResponse room
) {
    public record RoomTemplateRoomResponse(
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
}
