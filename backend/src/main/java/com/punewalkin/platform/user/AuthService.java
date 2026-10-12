package com.punewalkin.platform.user;

import com.punewalkin.platform.candidate.CandidateProfile;
import com.punewalkin.platform.candidate.CandidateProfileRepository;
import com.punewalkin.platform.common.exception.BadRequestException;
import com.punewalkin.platform.common.exception.ConflictException;
import com.punewalkin.platform.security.JwtTokenProvider;
import com.punewalkin.platform.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       CandidateProfileRepository candidateProfileRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new ConflictException("Email address is already registered: " + request.getEmail());
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role. Must be CANDIDATE or EMPLOYER.");
        }

        if (role == Role.ADMIN) {
            throw new BadRequestException("Cannot self-register as ADMIN.");
        }

        String userId = UUID.randomUUID().toString();
        User user = new User(
                userId,
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role,
                AccountStatus.ACTIVE
        );
        userRepository.save(user);

        // Automatically create a candidate profile for CANDIDATE role
        if (role == Role.CANDIDATE) {
            CandidateProfile profile = new CandidateProfile();
            profile.setId(UUID.randomUUID().toString());
            profile.setUser(user);
            candidateProfileRepository.save(profile);
        }

        // Auto-login after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(),
                user.getRole().name(), user.getAccountStatus().name());
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(authentication);

        // Update last login timestamp
        userRepository.findById(principal.getId()).ifPresent(user -> {
            user.setLastLoginAt(java.time.LocalDateTime.now());
            userRepository.save(user);
        });

        return new AuthResponse(token, principal.getId(), principal.getFullName(),
                principal.getEmail(), principal.getRole().name(), principal.getAccountStatus().name());
    }

    public UserProfileResponse getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.punewalkin.platform.common.exception.ResourceNotFoundException("User not found"));
        return new UserProfileResponse(user);
    }
}
