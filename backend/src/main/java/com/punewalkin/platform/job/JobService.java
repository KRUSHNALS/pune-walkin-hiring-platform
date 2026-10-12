package com.punewalkin.platform.job;

import com.punewalkin.platform.company.Company;
import com.punewalkin.platform.company.CompanyRepository;
import com.punewalkin.platform.common.exception.ForbiddenException;
import com.punewalkin.platform.common.exception.ResourceNotFoundException;
import com.punewalkin.platform.user.User;
import com.punewalkin.platform.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public JobService(JobRepository jobRepository, CompanyRepository companyRepository,
                      UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Job createJob(JobRequest request, String companyId, String creatorUserId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + companyId));
        if (!company.getEmployer().getId().equals(creatorUserId)) {
            throw new ForbiddenException("You are not the owner of this company.");
        }

        User creator = userRepository.findById(creatorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Job job = new Job();
        job.setId(UUID.randomUUID().toString());
        job.setCompany(company);
        job.setCreatedBy(creator);
        applyRequest(job, request);
        return jobRepository.save(job);
    }

    @Transactional
    public Job updateJob(String jobId, JobRequest request, String requestingUserId, boolean isAdmin) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));
        if (!isAdmin && !job.getCreatedBy().getId().equals(requestingUserId)) {
            throw new ForbiddenException("Not authorized to update this job.");
        }
        applyRequest(job, request);
        return jobRepository.save(job);
    }

    private void applyRequest(Job job, JobRequest req) {
        if (req.getTitle() != null) job.setTitle(req.getTitle());
        if (req.getDepartment() != null) job.setDepartment(req.getDepartment());
        if (req.getEmploymentType() != null) job.setEmploymentType(req.getEmploymentType());
        if (req.getWorkMode() != null) job.setWorkMode(req.getWorkMode());
        if (req.getLocation() != null) job.setLocation(req.getLocation());
        if (req.getVacancies() != null) job.setVacancies(req.getVacancies());
        if (req.getMinExperience() != null) job.setMinExperience(req.getMinExperience());
        if (req.getMaxExperience() != null) job.setMaxExperience(req.getMaxExperience());
        if (req.getSalaryRange() != null) job.setSalaryRange(req.getSalaryRange());
        if (req.getQualification() != null) job.setQualification(req.getQualification());
        if (req.getEligibilityCriteria() != null) job.setEligibilityCriteria(req.getEligibilityCriteria());
        if (req.getRequiredSkills() != null) job.setRequiredSkills(req.getRequiredSkills());
        if (req.getDescription() != null) job.setDescription(req.getDescription());
        if (req.getResponsibilities() != null) job.setResponsibilities(req.getResponsibilities());
        if (req.getDeadline() != null) job.setDeadline(req.getDeadline());
        if (req.getStatus() != null) job.setStatus(req.getStatus());
    }

    public Job getJobById(String jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));
    }

    public Page<Job> getJobsByCompany(String companyId, Pageable pageable) {
        return jobRepository.findByCompanyId(companyId, pageable);
    }

    public Page<Job> getAllActiveJobs(Pageable pageable) {
        return jobRepository.findByStatus(JobStatus.ACTIVE, pageable);
    }

    public Page<Job> searchJobs(String search, Pageable pageable) {
        if (search == null || search.isBlank()) {
            return getAllActiveJobs(pageable);
        }
        return jobRepository.searchActiveJobs(search, pageable);
    }

    @Transactional
    public Job updateJobStatus(String jobId, JobStatus status, String requestingUserId, boolean isAdmin) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));
        if (!isAdmin && !job.getCreatedBy().getId().equals(requestingUserId)) {
            throw new ForbiddenException("Not authorized.");
        }
        job.setStatus(status);
        return jobRepository.save(job);
    }

    @Transactional
    public void deleteJob(String jobId, String requestingUserId, boolean isAdmin) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));
        if (!isAdmin && !job.getCreatedBy().getId().equals(requestingUserId)) {
            throw new ForbiddenException("Not authorized to delete this job.");
        }
        jobRepository.delete(job);
    }
}
