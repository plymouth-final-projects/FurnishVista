package com.backend.backend.modules.auth.dto;

public record AuthResponse(
        String token,
        String id,
        String name,
        String email,
        String role,
        String createdAt
) {
}
