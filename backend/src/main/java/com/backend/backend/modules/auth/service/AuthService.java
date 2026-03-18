package com.backend.backend.modules.auth.service;

import com.backend.backend.common.exception.UnauthorizedOperationException;
import com.backend.backend.common.exception.ValidationException;
import com.backend.backend.modules.auth.dto.AuthResponse;
import com.backend.backend.modules.auth.dto.LoginRequest;
import com.backend.backend.modules.auth.dto.SignupRequest;
import com.backend.backend.modules.user.entity.User;
import com.backend.backend.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String DEFAULT_ROLE = "designer";
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ValidationException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ValidationException("Invalid email or password");
        }

        return toResponse(user);
    }

    public AuthResponse signup(SignupRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new ValidationException("Passwords do not match");
        }

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new ValidationException("Email already registered");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setRole(DEFAULT_ROLE);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public AuthResponse me(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new UnauthorizedOperationException("Authentication required");
        }
        long id;
        try {
            id = Long.parseLong(userId);
        } catch (NumberFormatException ex) {
            throw new UnauthorizedOperationException("Authentication required");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UnauthorizedOperationException("Authentication required"));
        return toResponse(user);
    }

    private AuthResponse toResponse(User user) {
        return new AuthResponse(
                "session-" + UUID.randomUUID(),
                user.getId().toString(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt() == null ? Instant.now().toString() : user.getCreatedAt().toString()
        );
    }
}
