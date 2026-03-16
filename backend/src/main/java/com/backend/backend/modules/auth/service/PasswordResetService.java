package com.backend.backend.modules.auth.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PasswordResetService {

    public Map<String, String> requestReset(String email) {
        return Map.of("message", "Password reset link sent to " + email);
    }
}
