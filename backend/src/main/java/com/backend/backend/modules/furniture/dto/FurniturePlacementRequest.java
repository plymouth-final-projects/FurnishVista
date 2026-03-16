package com.backend.backend.modules.furniture.dto;

import jakarta.validation.constraints.NotBlank;

public record FurniturePlacementRequest(
        @NotBlank String furnitureId,
        double x,
        double y,
        double z,
        double rotation,
        double scale
) {
}
