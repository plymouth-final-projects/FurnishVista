package com.backend.backend.modules.design.dto;

import com.backend.backend.modules.room.dto.RoomResponse;

import java.util.List;

public record DesignResponse(
        String id,
        String name,
        RoomResponse room,
        List<PlacedFurnitureDto> furniture,
        String createdAt,
        String updatedAt,
        String thumbnail,
        String designerId
) {
}
