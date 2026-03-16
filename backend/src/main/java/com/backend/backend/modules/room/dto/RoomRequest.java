package com.backend.backend.modules.room.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record RoomRequest(
        String id,
        @NotBlank String name,
        @Positive double width,
        @Positive double length,
        @Positive double height,
        @NotBlank String shape,
        @NotBlank String wallColor,
        @NotBlank String floorType,
        @NotBlank String floorColor,
        @NotBlank String ceilingColor
) {
}
