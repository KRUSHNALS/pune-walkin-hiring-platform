package com.punewalkin.platform.job;

import com.punewalkin.platform.common.dto.ApiResponse;
import com.punewalkin.platform.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Jobs", description = "Job listing management")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // ---- PUBLIC ENDPOINTS ----

    @GetMapping("/api/v1/jobs")
    @Operation(summary = "List/search active jobs (public)")
    public ResponseEntity<ApiResponse<Page<Job>>> listJobs(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Job> jobs = jobService.searchJobs(search, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success("Jobs fetched", jobs));
    }

    @GetMapping("/api/v1/jobs/{jobId}")
    @Operation(summary = "Get job details (public)")
    public ResponseEntity<ApiResponse<Job>> getJob(@PathVariable String jobId) {
        Job job = jobService.getJobById(jobId);
        return ResponseEntity.ok(ApiResponse.success("Job fetched", job));
    }

    // ---- EMPLOYER ENDPOINTS ----

    @PostMapping("/api/v1/employer/companies/{companyId}/jobs")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @Operation(summary = "Create a job under a company (Employer)")
    public ResponseEntity<ApiResponse<Job>> createJob(
            @PathVariable String companyId,
            @Valid @RequestBody JobRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        Job job = jobService.createJob(request, companyId, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job created", job));
    }

    @PutMapping("/api/v1/employer/jobs/{jobId}")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @Operation(summary = "Update a job (Employer/Admin)")
    public ResponseEntity<ApiResponse<Job>> updateJob(
            @PathVariable String jobId,
            @Valid @RequestBody JobRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        boolean isAdmin = principal.getRole().name().equals("ADMIN");
        Job job = jobService.updateJob(jobId, request, principal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Job updated", job));
    }

    @GetMapping("/api/v1/employer/companies/{companyId}/jobs")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @Operation(summary = "List jobs for a company (Employer)")
    public ResponseEntity<ApiResponse<Page<Job>>> getJobsForCompany(
            @PathVariable String companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Job> jobs = jobService.getJobsByCompany(companyId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success("Jobs fetched", jobs));
    }

    @DeleteMapping("/api/v1/employer/jobs/{jobId}")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @Operation(summary = "Delete a job (Employer/Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @PathVariable String jobId,
            @AuthenticationPrincipal UserPrincipal principal) {
        boolean isAdmin = principal.getRole().name().equals("ADMIN");
        jobService.deleteJob(jobId, principal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Job deleted"));
    }
}
