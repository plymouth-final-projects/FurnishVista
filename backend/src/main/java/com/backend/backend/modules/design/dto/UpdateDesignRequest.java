package com.backend.backend.modules.design.dto;

import com.backend.backend.modules.room.dto.RoomRequest;

import java.util.List;

public record UpdateDesignRequest(
        String name,
        RoomRequest room,
        List<PlacedFurnitureDto> furniture,
        String thumbnail
) {
}
