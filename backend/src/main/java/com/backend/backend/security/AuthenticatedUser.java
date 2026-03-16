package com.backend.backend.security;

public record AuthenticatedUser(
        String id,
        String email,
        String name,
        String role
) {
}
