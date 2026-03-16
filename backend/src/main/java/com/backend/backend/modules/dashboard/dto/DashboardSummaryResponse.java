package com.backend.backend.modules.dashboard.dto;

public record DashboardSummaryResponse(
        int totalDesigns,
        int totalRooms,
        int totalFurnitureItems,
        String lastUpdatedAt
) {
}
