package com.backend.backend.modules.design.dto;

import com.backend.backend.modules.room.dto.RoomRequest;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record CreateDesignRequest(
        @NotBlank String name,
        RoomRequest room,
        List<PlacedFurnitureDto> furniture,
        String thumbnail,
        String designerId
) {
}
