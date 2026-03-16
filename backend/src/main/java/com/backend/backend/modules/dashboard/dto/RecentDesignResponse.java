package com.backend.backend.modules.dashboard.dto;

public record RecentDesignResponse(
        String id,
        String name,
        String updatedAt,
        String thumbnail
) {
}
