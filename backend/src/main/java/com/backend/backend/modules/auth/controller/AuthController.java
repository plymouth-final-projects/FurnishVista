package com.backend.backend.modules.auth.controller;

import com.backend.backend.common.dto.ApiResponse;
import com.backend.backend.modules.auth.dto.AuthResponse;
import com.backend.backend.modules.auth.dto.LoginRequest;
import com.backend.backend.modules.auth.dto.PasswordResetRequest;
import com.backend.backend.modules.auth.dto.SignupRequest;
import com.backend.backend.modules.auth.service.AuthService;
import com.backend.backend.modules.auth.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok("Login successful", authService.login(request));
    }

    @PostMapping("/signup")
    public ApiResponse<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ApiResponse.ok("Signup successful", authService.signup(request));
    }

    @PostMapping("/forgot-password")
    public ApiResponse<Map<String, String>> forgotPassword(@Valid @RequestBody PasswordResetRequest request) {
        return ApiResponse.ok("Reset request accepted", passwordResetService.requestReset(request.email()));
    }

    @GetMapping("/me")
    public ApiResponse<AuthResponse> me() {
        return ApiResponse.ok("Current user", authService.me());
    }
}
