package com.backend.backend.modules.furniture.dto;

public record FurnitureSearchRequest(
        String query,
        String category
) {
}
