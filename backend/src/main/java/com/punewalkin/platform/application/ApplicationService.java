package com.punewalkin.platform.application;

import com.punewalkin.platform.candidate.CandidateProfile;
import com.punewalkin.platform.candidate.CandidateProfileRepository;
import com.punewalkin.platform.common.exception.BadRequestException;
import com.punewalkin.platform.common.exception.ConflictException;
import com.punewalkin.platform.common.exception.ForbiddenException;
import com.punewalkin.platform.common.exception.ResourceNotFoundException;
import com.punewalkin.platform.drive.DriveApprovalStatus;
import com.punewalkin.platform.drive.WalkInDrive;
import com.punewalkin.platform.drive.DriveRepository;
import com.punewalkin.platform.user.User;
import com.punewalkin.platform.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final DriveRepository driveRepository;
    private final UserRepository userRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                               CandidateProfileRepository candidateProfileRepository,
                               DriveRepository driveRepository,
                               UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.driveRepository = driveRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Application applyToDrive(String driveId, String candidateUserId) {
        // Find candidate profile
        CandidateProfile candidateProfile = candidateProfileRepository.findByUserId(candidateUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found for user: " + candidateUserId));

        // Find drive
        WalkInDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("Drive not found: " + driveId));

        // Validation checks
        if (drive.getApprovalStatus() != DriveApprovalStatus.APPROVED) {
            throw new BadRequestException("This drive is not open for applications.");
        }
        if (drive.getRegistrationDeadline().isBefore(LocalDate.now())) {
            throw new BadRequestException("Registration deadline has passed.");
        }
        if (drive.getRegisteredCount() >= drive.getMaxRegistrations()) {
            throw new BadRequestException("Drive has reached maximum registrations.");
        }
        if (applicationRepository.existsByCandidateIdAndDriveId(candidateProfile.getId(), driveId)) {
            throw new ConflictException("You have already applied to this drive.");
        }

        // Create application
        Application app = new Application();
        app.setId(UUID.randomUUID().toString());
        app.setCandidate(candidateProfile);
        app.setDrive(drive);
        app.setJob(drive.getJob());
        app.setCompany(drive.getCompany());
        app.setStatus(ApplicationStatus.REGISTERED);

        // Generate token
        String token = "TKN-" + driveId.substring(0, 4).toUpperCase() + "-"
                + (drive.getRegisteredCount() + 1);
        app.setTokenNumber(token);

        // Set resume filename from candidate profile if available
        if (candidateProfile.getResumeFileName() != null) {
            app.setResumeFileName(candidateProfile.getResumeFileName());
        }

        // Increment registered count
        drive.setRegisteredCount(drive.getRegisteredCount() + 1);
        driveRepository.save(drive);

        return applicationRepository.save(app);
    }

    @Transactional
    public Application updateApplicationStatus(String applicationId, ApplicationStatus newStatus,
                                                String reviewerNotes, Double rating,
                                                String updatingUserId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));

        User updatedBy = userRepository.findById(updatingUserId).orElse(null);
        app.setStatus(newStatus);
        if (reviewerNotes != null) app.setReviewerNotes(reviewerNotes);
        if (rating != null) app.setRating(rating);
        app.setLastUpdatedBy(updatedBy);

        return applicationRepository.save(app);
    }

    @Transactional
    public Application withdrawApplication(String applicationId, String candidateUserId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));

        CandidateProfile profile = candidateProfileRepository.findByUserId(candidateUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        if (!app.getCandidate().getId().equals(profile.getId())) {
            throw new ForbiddenException("You are not authorized to withdraw this application.");
        }
        if (app.getStatus() == ApplicationStatus.WITHDRAWN) {
            throw new BadRequestException("Application is already withdrawn.");
        }

        app.setStatus(ApplicationStatus.WITHDRAWN);

        // Decrement drive count
        WalkInDrive drive = app.getDrive();
        if (drive.getRegisteredCount() > 0) {
            drive.setRegisteredCount(drive.getRegisteredCount() - 1);
            driveRepository.save(drive);
        }

        return applicationRepository.save(app);
    }

    public Application getApplicationById(String applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));
    }

    public Page<Application> getApplicationsByCandidate(String candidateUserId, Pageable pageable) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(candidateUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));
        return applicationRepository.findByCandidateId(profile.getId(), pageable);
    }

    public Page<Application> getApplicationsByDrive(String driveId, Pageable pageable) {
        return applicationRepository.findByDriveId(driveId, pageable);
    }

    public Page<Application> getApplicationsByCompany(String companyId, Pageable pageable) {
        return applicationRepository.findByCompanyId(companyId, pageable);
    }

    public Page<Application> getAllApplications(Pageable pageable) {
        return applicationRepository.findAll(pageable);
    }
}
