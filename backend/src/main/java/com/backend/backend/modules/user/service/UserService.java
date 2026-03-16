package com.backend.backend.modules.user.service;

import com.backend.backend.modules.user.dto.UpdateUserRequest;
import com.backend.backend.modules.user.dto.UserResponse;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private volatile UserResponse current = new UserResponse(
            "user-1",
            "Sarah Mitchell",
            "sarah@furnishvista.com",
            "designer",
            "2025-09-15T10:00:00Z"
    );

    public UserResponse me() {
        return current;
    }

    public UserResponse update(UpdateUserRequest request) {
        current = new UserResponse(current.id(), request.name(), current.email(), current.role(), current.createdAt());
        return current;
    }
}
