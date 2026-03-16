package com.backend.backend.modules.user.controller;

import com.backend.backend.common.dto.ApiResponse;
import com.backend.backend.modules.user.dto.UpdateUserRequest;
import com.backend.backend.modules.user.dto.UserResponse;
import com.backend.backend.modules.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserResponse> me() {
        return ApiResponse.ok("User profile", userService.me());
    }

    @PutMapping("/me")
    public ApiResponse<UserResponse> update(@Valid @RequestBody UpdateUserRequest request) {
        return ApiResponse.ok("Profile updated", userService.update(request));
    }
}
