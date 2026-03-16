package com.backend.backend.modules.design.dto;

public record DesignSummaryResponse(
        String id,
        String name,
        String roomType,
        String roomDimensions,
        int furnitureCount,
        String createdAt,
        String updatedAt,
        String thumbnail
) {
}
