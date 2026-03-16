package com.backend.backend.modules.design.entity;

import com.backend.backend.modules.room.dto.RoomResponse;
import lombok.Builder;

import java.util.List;

@Builder
public record Design(
        String id,
        String name,
        RoomResponse room,
        List<PlacedFurniture> furniture,
        String createdAt,
        String updatedAt,
        String thumbnail,
        String designerId
) {
}
