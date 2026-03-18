package com.backend.backend.modules.user.service;

import com.backend.backend.common.exception.UnauthorizedOperationException;
import com.backend.backend.modules.user.dto.UpdateUserRequest;
import com.backend.backend.modules.user.dto.UserResponse;
import com.backend.backend.modules.user.entity.User;
import com.backend.backend.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse me(String userId) {
        User user = findUser(userId);
        return toResponse(user);
    }

    public UserResponse update(UpdateUserRequest request, String userId) {
        User user = findUser(userId);
        user.setName(request.name());
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    private User findUser(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new UnauthorizedOperationException("Authentication required");
        }
        long id;
        try {
            id = Long.parseLong(userId);
        } catch (NumberFormatException ex) {
            throw new UnauthorizedOperationException("Authentication required");
        }
        return userRepository.findById(id)
                .orElseThrow(() -> new UnauthorizedOperationException("Authentication required"));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId().toString(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt() == null ? null : user.getCreatedAt().toString()
        );
    }
}
