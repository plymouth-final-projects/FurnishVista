package com.backend.backend.modules.auth.service;

import com.backend.backend.common.exception.ValidationException;
import com.backend.backend.modules.auth.dto.AuthResponse;
import com.backend.backend.modules.auth.dto.LoginRequest;
import com.backend.backend.modules.auth.dto.SignupRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private static final String DEFAULT_ROLE = "designer";
    private final Map<String, AuthUserRecord> usersByEmail = new ConcurrentHashMap<>();

    public AuthResponse login(LoginRequest request) {
        AuthUserRecord user = usersByEmail.computeIfAbsent(request.email(), email ->
                new AuthUserRecord(UUID.randomUUID().toString(), "Designer", email, DEFAULT_ROLE, Instant.now().toString(), request.password())
        );
        return toResponse(user);
    }

    public AuthResponse signup(SignupRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new ValidationException("Passwords do not match");
        }

        if (usersByEmail.containsKey(request.email())) {
            throw new ValidationException("Email already registered");
        }

        AuthUserRecord user = new AuthUserRecord(
                UUID.randomUUID().toString(),
                request.name(),
                request.email(),
                DEFAULT_ROLE,
                Instant.now().toString(),
                request.password()
        );
        usersByEmail.put(user.email(), user);
        return toResponse(user);
    }

    public AuthResponse me() {
        AuthUserRecord user = usersByEmail.values().stream().findFirst().orElseGet(() -> {
            AuthUserRecord seeded = new AuthUserRecord(
                    "user-1",
                    "Sarah Mitchell",
                    "sarah@furnishvista.com",
                    DEFAULT_ROLE,
                    "2025-09-15T10:00:00Z",
                    "secret"
            );
            usersByEmail.put(seeded.email(), seeded);
            return seeded;
        });
        return toResponse(user);
    }

    private AuthResponse toResponse(AuthUserRecord user) {
        return new AuthResponse(
                "mock-jwt-token-" + System.currentTimeMillis(),
                user.id(),
                user.name(),
                user.email(),
                user.role(),
                user.createdAt()
        );
    }

    private record AuthUserRecord(
            String id,
            String name,
            String email,
            String role,
            String createdAt,
            String password
    ) {
    }
}
