package com.backend.backend.modules.auth.session;

public record SessionUser(
        String id,
        String email,
        String name,
        String role
) {
}
