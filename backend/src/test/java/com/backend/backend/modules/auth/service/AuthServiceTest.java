package com.backend.backend.modules.auth.service;

import com.backend.backend.common.exception.UnauthorizedOperationException;
import com.backend.backend.common.exception.ValidationException;
import com.backend.backend.modules.auth.dto.AuthResponse;
import com.backend.backend.modules.auth.dto.LoginRequest;
import com.backend.backend.modules.auth.dto.SignupRequest;
import com.backend.backend.modules.user.entity.User;
import com.backend.backend.modules.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void loginThrowsWhenEmailNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(new LoginRequest("missing@example.com", "secret")))
                .isInstanceOf(ValidationException.class)
                .hasMessage("Invalid email or password");
    }

    @Test
    void loginThrowsWhenPasswordMismatch() {
        User user = buildUser(5L, "Designer", "designer@example.com", "hash", "designer");
        when(userRepository.findByEmail("designer@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("bad", "hash")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest("designer@example.com", "bad")))
                .isInstanceOf(ValidationException.class)
                .hasMessage("Invalid email or password");
    }

    @Test
    void loginReturnsAuthResponseWhenValid() {
        User user = buildUser(7L, "Alex", "alex@example.com", "hash", "designer");
        when(userRepository.findByEmail("alex@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret", "hash")).thenReturn(true);

        AuthResponse response = authService.login(new LoginRequest("alex@example.com", "secret"));

        assertThat(response.email()).isEqualTo("alex@example.com");
        assertThat(response.name()).isEqualTo("Alex");
        assertThat(response.role()).isEqualTo("designer");
        assertThat(response.id()).isEqualTo("7");
        assertThat(response.token()).startsWith("session-");
    }

    @Test
    void signupThrowsWhenPasswordsDoNotMatch() {
        SignupRequest request = new SignupRequest("Sam", "sam@example.com", "secret1", "secret2");

        assertThatThrownBy(() -> authService.signup(request))
                .isInstanceOf(ValidationException.class)
                .hasMessage("Passwords do not match");
    }

    @Test
    void signupThrowsWhenEmailAlreadyRegistered() {
        when(userRepository.findByEmail("sam@example.com")).thenReturn(Optional.of(new User()));

        SignupRequest request = new SignupRequest("Sam", "sam@example.com", "secret1", "secret1");

        assertThatThrownBy(() -> authService.signup(request))
                .isInstanceOf(ValidationException.class)
                .hasMessage("Email already registered");
    }

    @Test
    void signupCreatesUserWhenValid() {
        SignupRequest request = new SignupRequest("Sam", "sam@example.com", "secret1", "secret1");
        when(userRepository.findByEmail("sam@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("secret1")).thenReturn("hashed");
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> buildUser(11L, "Sam", "sam@example.com", "hashed", "designer"));

        AuthResponse response = authService.signup(request);

        assertThat(response.id()).isEqualTo("11");
        assertThat(response.email()).isEqualTo("sam@example.com");
        assertThat(response.role()).isEqualTo("designer");
    }

    @Test
    void meThrowsWhenUserIdInvalid() {
        assertThatThrownBy(() -> authService.me("invalid"))
                .isInstanceOf(UnauthorizedOperationException.class)
                .hasMessage("Authentication required");
    }

    @Test
    void meThrowsWhenUserMissing() {
        when(userRepository.findById(9L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.me("9"))
                .isInstanceOf(UnauthorizedOperationException.class)
                .hasMessage("Authentication required");
    }

    @Test
    void meReturnsAuthResponseWhenFound() {
        User user = buildUser(3L, "Taylor", "taylor@example.com", "hash", "designer");
        when(userRepository.findById(3L)).thenReturn(Optional.of(user));

        AuthResponse response = authService.me("3");

        assertThat(response.email()).isEqualTo("taylor@example.com");
        assertThat(response.id()).isEqualTo("3");
    }

    private static User buildUser(Long id, String name, String email, String passwordHash, String role) {
        User user = new User();
        user.setId(id);
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setRole(role);
        user.setCreatedAt(Instant.now());
        return user;
    }
}
