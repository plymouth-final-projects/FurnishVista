package com.backend.backend.modules.user.service;

import com.backend.backend.common.exception.UnauthorizedOperationException;
import com.backend.backend.modules.user.dto.UpdateUserRequest;
import com.backend.backend.modules.user.dto.UserResponse;
import com.backend.backend.modules.user.entity.User;
import com.backend.backend.modules.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void meThrowsWhenUserIdMissing() {
        assertThatThrownBy(() -> userService.me(""))
                .isInstanceOf(UnauthorizedOperationException.class)
                .hasMessage("Authentication required");
    }

    @Test
    void meThrowsWhenUserNotFound() {
        when(userRepository.findById(44L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.me("44"))
                .isInstanceOf(UnauthorizedOperationException.class)
                .hasMessage("Authentication required");
    }

    @Test
    void meReturnsUserResponseWhenFound() {
        User user = buildUser(12L, "Jordan", "jordan@example.com", "designer");
        when(userRepository.findById(12L)).thenReturn(Optional.of(user));

        UserResponse response = userService.me("12");

        assertThat(response.email()).isEqualTo("jordan@example.com");
        assertThat(response.name()).isEqualTo("Jordan");
        assertThat(response.id()).isEqualTo("12");
    }

    @Test
    void updatePersistsNameChange() {
        User user = buildUser(7L, "Old Name", "old@example.com", "designer");
        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        UserResponse response = userService.update(new UpdateUserRequest("New Name"), "7");

        assertThat(response.name()).isEqualTo("New Name");
        assertThat(user.getName()).isEqualTo("New Name");
    }

    private static User buildUser(Long id, String name, String email, String role) {
        User user = new User();
        user.setId(id);
        user.setName(name);
        user.setEmail(email);
        user.setRole(role);
        user.setPasswordHash("hash");
        user.setCreatedAt(Instant.now());
        return user;
    }
}
