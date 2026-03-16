package com.backend.backend.modules.user.dto;

public record UserResponse(
        String id,
        String name,
        String email,
        String role,
        String createdAt
) {
}
