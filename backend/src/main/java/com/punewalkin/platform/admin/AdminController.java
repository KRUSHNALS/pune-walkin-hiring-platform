package com.punewalkin.platform.admin;

import com.punewalkin.platform.application.ApplicationRepository;
import com.punewalkin.platform.application.ApplicationStatus;
import com.punewalkin.platform.candidate.CandidateProfileRepository;
import com.punewalkin.platform.company.CompanyRepository;
import com.punewalkin.platform.company.CompanyVerificationStatus;
import com.punewalkin.platform.common.dto.ApiResponse;
import com.punewalkin.platform.drive.DriveApprovalStatus;
import com.punewalkin.platform.drive.DriveRepository;
import com.punewalkin.platform.drive.DriveStatus;
import com.punewalkin.platform.job.JobRepository;
import com.punewalkin.platform.job.JobStatus;
import com.punewalkin.platform.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin dashboard and platform management")
public class AdminController {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final DriveRepository driveRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final CandidateProfileRepository candidateProfileRepository;

    public AdminController(UserRepository userRepository,
                           CompanyRepository companyRepository,
                           DriveRepository driveRepository,
                           JobRepository jobRepository,
                           ApplicationRepository applicationRepository,
                           CandidateProfileRepository candidateProfileRepository) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.candidateProfileRepository = candidateProfileRepository;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get platform-wide statistics (Admin)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        // Users
        stats.put("totalUsers", userRepository.count());
        stats.put("totalCandidates", candidateProfileRepository.count());
        stats.put("totalCompanies", companyRepository.count());

        // Companies
        stats.put("pendingCompanies", companyRepository.countByVerificationStatus(CompanyVerificationStatus.PENDING));
        stats.put("verifiedCompanies", companyRepository.countByVerificationStatus(CompanyVerificationStatus.VERIFIED));

        // Drives
        stats.put("totalDrives", driveRepository.count());
        stats.put("pendingDrives", driveRepository.countByApprovalStatus(DriveApprovalStatus.PENDING));
        stats.put("approvedDrives", driveRepository.countByApprovalStatus(DriveApprovalStatus.APPROVED));
        stats.put("publishedDrives", driveRepository.countByDriveStatus(DriveStatus.PUBLISHED));

        // Jobs
        stats.put("totalJobs", jobRepository.count());
        stats.put("activeJobs", jobRepository.countByStatus(JobStatus.ACTIVE));

        // Applications
        stats.put("totalApplications", applicationRepository.count());
        stats.put("registeredApplications", applicationRepository.countByStatus(ApplicationStatus.REGISTERED));
        stats.put("selectedApplications", applicationRepository.countByStatus(ApplicationStatus.SELECTED));

        return ResponseEntity.ok(ApiResponse.success("Stats fetched", stats));
    }

    @GetMapping("/users")
    @Operation(summary = "List all users (Admin)")
    public ResponseEntity<ApiResponse<Object>> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        org.springframework.data.domain.PageRequest pageable =
                org.springframework.data.domain.PageRequest.of(page, size,
                        org.springframework.data.domain.Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.success("Users fetched", userRepository.findAll(pageable)));
    }

    @PatchMapping("/users/{userId}/status")
    @Operation(summary = "Update user account status (Admin)")
    public ResponseEntity<ApiResponse<Object>> updateUserStatus(
            @PathVariable String userId,
            @RequestBody Map<String, String> body) {
        com.punewalkin.platform.user.User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.punewalkin.platform.common.exception.ResourceNotFoundException("User not found: " + userId));
        com.punewalkin.platform.user.AccountStatus status =
                com.punewalkin.platform.user.AccountStatus.valueOf(body.get("status").toUpperCase());
        user.setAccountStatus(status);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("User status updated", user));
    }
}
