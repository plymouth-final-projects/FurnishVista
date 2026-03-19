package com.backend.backend.modules.auth.controller;

import com.backend.backend.modules.auth.dto.LoginRequest;
import com.backend.backend.modules.auth.dto.SignupRequest;
import com.backend.backend.modules.user.entity.User;
import com.backend.backend.modules.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.mock.web.MockHttpSession;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers(disabledWithoutDocker = true)
class AuthControllerIntegrationTest {

    @Container
    private static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("architect_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void registerProperties(DynamicPropertyRegistry registry) {
        registry.add("app.db.url", postgres::getJdbcUrl);
        registry.add("app.db.username", postgres::getUsername);
        registry.add("app.db.password", postgres::getPassword);
        registry.add("server.port", () -> "0");
        registry.add("app.cors.allowed-origins", () -> "*");
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void signupThenMeReturnsCurrentUser() throws Exception {
        SignupRequest signup = new SignupRequest("Riley", "riley@example.com", "secret1", "secret1");

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signup)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.success").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.email").value("riley@example.com"))
                .andReturn();

        MockHttpSession session = (MockHttpSession) result.getRequest().getSession(false);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/auth/me")
                        .session(session))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.name").value("Riley"));
    }

    @Test
    void loginReturnsAuthResponse() throws Exception {
        User user = new User();
        user.setName("Casey");
        user.setEmail("casey@example.com");
        user.setRole("designer");
        user.setPasswordHash(passwordEncoder.encode("secret123"));
        userRepository.save(user);

        LoginRequest login = new LoginRequest("casey@example.com", "secret123");

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.success").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.email").value("casey@example.com"));
    }

    @Test
    void forgotPasswordReturnsMessage() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"reset@example.com\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.message")
                        .value("Password reset link sent to reset@example.com"));
    }
}
