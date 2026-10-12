package com.punewalkin.platform.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.punewalkin.platform.user.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SecurityAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.punewalkin.platform.candidate.CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private com.punewalkin.platform.application.ApplicationRepository applicationRepository;

    @Autowired
    private com.punewalkin.platform.drive.DriveRepository driveRepository;

    @Autowired
    private com.punewalkin.platform.job.JobRepository jobRepository;

    @Autowired
    private com.punewalkin.platform.company.CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private String adminToken;
    private String employerToken;
    private String candidateToken;

    @BeforeEach
    void setUp() {
        applicationRepository.deleteAll();
        driveRepository.deleteAll();
        jobRepository.deleteAll();
        companyRepository.deleteAll();
        candidateProfileRepository.deleteAll();
        userRepository.deleteAll();

        // Admin User
        User admin = new User(UUID.randomUUID().toString(), "Admin", "admin.auth@platform.com",
                passwordEncoder.encode("Pass@123"), Role.ADMIN, AccountStatus.ACTIVE);
        userRepository.save(admin);
        UserPrincipal adminPrincipal = UserPrincipal.create(admin);
        adminToken = "Bearer " + jwtTokenProvider.generateToken(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(adminPrincipal, null, adminPrincipal.getAuthorities()));

        // Employer User
        User employer = new User(UUID.randomUUID().toString(), "Employer", "emp.auth@platform.com",
                passwordEncoder.encode("Pass@123"), Role.EMPLOYER, AccountStatus.ACTIVE);
        userRepository.save(employer);
        UserPrincipal empPrincipal = UserPrincipal.create(employer);
        employerToken = "Bearer " + jwtTokenProvider.generateToken(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(empPrincipal, null, empPrincipal.getAuthorities()));

        // Candidate User
        User candidate = new User(UUID.randomUUID().toString(), "Candidate", "cand.auth@platform.com",
                passwordEncoder.encode("Pass@123"), Role.CANDIDATE, AccountStatus.ACTIVE);
        userRepository.save(candidate);
        UserPrincipal candPrincipal = UserPrincipal.create(candidate);
        candidateToken = "Bearer " + jwtTokenProvider.generateToken(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(candPrincipal, null, candPrincipal.getAuthorities()));
    }

    @Test
    @DisplayName("Public endpoints accessible without authorization token")
    void publicEndpointsAccessibleWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/v1/drives"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Admin endpoint without token returns 401 Unauthorized")
    void adminEndpointWithoutTokenUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/admin/stats"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Admin endpoint with Candidate token returns 403 Forbidden")
    void adminEndpointWithCandidateTokenForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/admin/stats")
                        .header("Authorization", candidateToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Admin endpoint with Employer token returns 403 Forbidden")
    void adminEndpointWithEmployerTokenForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/admin/stats")
                        .header("Authorization", employerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Admin endpoint with Admin token returns 200 OK")
    void adminEndpointWithAdminTokenOk() throws Exception {
        mockMvc.perform(get("/api/v1/admin/stats")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Employer endpoint with Candidate token returns 403 Forbidden")
    void employerEndpointWithCandidateTokenForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/employer/companies/mine")
                        .header("Authorization", candidateToken))
                .andExpect(status().isForbidden());
    }
}
