package com.punewalkin.platform.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.punewalkin.platform.candidate.CandidateProfileRepository;
import com.punewalkin.platform.user.LoginRequest;
import com.punewalkin.platform.user.RegisterRequest;
import com.punewalkin.platform.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @BeforeEach
    void setUp() {
        candidateProfileRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Register new candidate successfully creates user and candidate profile")
    void registerCandidateSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Pooja Deshmukh");
        request.setEmail("pooja.test@example.com");
        request.setPassword("Password@123");
        request.setRole("CANDIDATE");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.email").value("pooja.test@example.com"))
                .andExpect(jsonPath("$.data.role").value("CANDIDATE"));

        assertTrue(userRepository.existsByEmailIgnoreCase("pooja.test@example.com"));
        var user = userRepository.findByEmailIgnoreCase("pooja.test@example.com").orElseThrow();
        assertTrue(candidateProfileRepository.findByUserId(user.getId()).isPresent());
    }

    @Test
    @DisplayName("Register new employer successfully")
    void registerEmployerSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Rahul Patil");
        request.setEmail("rahul.hr@company.com");
        request.setPassword("Employer@123");
        request.setRole("EMPLOYER");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.role").value("EMPLOYER"));
    }

    @Test
    @DisplayName("Reject registration when email already exists (Conflict 409)")
    void registerDuplicateEmailConflict() throws Exception {
        RegisterRequest first = new RegisterRequest();
        first.setFullName("Initial User");
        first.setEmail("duplicate@example.com");
        first.setPassword("Pass@123");
        first.setRole("CANDIDATE");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isCreated());

        RegisterRequest duplicate = new RegisterRequest();
        duplicate.setFullName("Second User");
        duplicate.setEmail("duplicate@example.com");
        duplicate.setPassword("Pass@456");
        duplicate.setRole("CANDIDATE");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("CONFLICT"))
                .andExpect(jsonPath("$.message", containsString("already registered")));
    }

    @Test
    @DisplayName("Reject self-registration as ADMIN (Bad Request 400)")
    void registerAsAdminForbidden() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Malicious Admin");
        request.setEmail("fakeadmin@example.com");
        request.setPassword("Admin@123");
        request.setRole("ADMIN");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"));
    }

    @Test
    @DisplayName("Login with valid credentials returns JWT and user profile")
    void loginValidCredentialsSuccess() throws Exception {
        RegisterRequest reg = new RegisterRequest();
        reg.setFullName("Login Candidate");
        reg.setEmail("login.test@example.com");
        reg.setPassword("Secret@123");
        reg.setRole("CANDIDATE");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated());

        LoginRequest login = new LoginRequest();
        login.setEmail("login.test@example.com");
        login.setPassword("Secret@123");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.email").value("login.test@example.com"));
    }

    @Test
    @DisplayName("Login with wrong password returns Unauthorized (401)")
    void loginWrongPasswordUnauthorized() throws Exception {
        RegisterRequest reg = new RegisterRequest();
        reg.setFullName("User Account");
        reg.setEmail("user.wrong@example.com");
        reg.setPassword("CorrectPassword123");
        reg.setRole("CANDIDATE");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated());

        LoginRequest login = new LoginRequest();
        login.setEmail("user.wrong@example.com");
        login.setPassword("WrongPassword");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized());
    }
}
