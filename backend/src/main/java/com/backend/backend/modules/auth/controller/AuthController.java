package com.backend.backend.modules.auth.controller;

import com.backend.backend.common.dto.ApiResponse;
import com.backend.backend.modules.auth.dto.AuthResponse;
import com.backend.backend.modules.auth.dto.LoginRequest;
import com.backend.backend.modules.auth.dto.PasswordResetRequest;
import com.backend.backend.modules.auth.dto.SignupRequest;
import com.backend.backend.modules.auth.service.AuthService;
import com.backend.backend.modules.auth.service.PasswordResetService;
import com.backend.backend.common.exception.UnauthorizedOperationException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        AuthResponse response = authService.login(request);
        session.setAttribute("userId", response.id());
        return ApiResponse.ok("Login successful", response);
    }

    @PostMapping("/signup")
    public ApiResponse<AuthResponse> signup(@Valid @RequestBody SignupRequest request, HttpSession session) {
        AuthResponse response = authService.signup(request);
        session.setAttribute("userId", response.id());
        return ApiResponse.ok("Signup successful", response);
    }

    @PostMapping("/forgot-password")
    public ApiResponse<Map<String, String>> forgotPassword(@Valid @RequestBody PasswordResetRequest request) {
        return ApiResponse.ok("Reset request accepted", passwordResetService.requestReset(request.email()));
    }

    @GetMapping("/me")
    public ApiResponse<AuthResponse> me(HttpSession session) {
        Object userId = session.getAttribute("userId");
        if (userId == null) {
            throw new UnauthorizedOperationException("Authentication required");
        }
        return ApiResponse.ok("Current user", authService.me(userId.toString()));
    }

    @PostMapping("/logout")
    public ApiResponse<Map<String, String>> logout(HttpSession session) {
        session.invalidate();
        return ApiResponse.ok("Logged out", Map.of("message", "Logged out"));
    }
}
