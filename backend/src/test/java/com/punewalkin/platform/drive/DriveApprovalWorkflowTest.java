package com.punewalkin.platform.drive;

import com.punewalkin.platform.common.exception.BadRequestException;
import com.punewalkin.platform.common.exception.ForbiddenException;
import com.punewalkin.platform.company.Company;
import com.punewalkin.platform.company.CompanyRepository;
import com.punewalkin.platform.company.CompanyVerificationStatus;
import com.punewalkin.platform.job.Job;
import com.punewalkin.platform.job.JobRepository;
import com.punewalkin.platform.job.JobStatus;
import com.punewalkin.platform.user.AccountStatus;
import com.punewalkin.platform.user.Role;
import com.punewalkin.platform.user.User;
import com.punewalkin.platform.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class DriveApprovalWorkflowTest {

    @Autowired
    private DriveService driveService;

    @Autowired
    private DriveRepository driveRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.punewalkin.platform.application.ApplicationRepository applicationRepository;

    @Autowired
    private com.punewalkin.platform.candidate.CandidateProfileRepository candidateProfileRepository;

    private User employer;
    private User otherEmployer;
    private User admin;
    private Company company;
    private Job job;

    @BeforeEach
    void setUp() {
        applicationRepository.deleteAll();
        driveRepository.deleteAll();
        jobRepository.deleteAll();
        companyRepository.deleteAll();
        candidateProfileRepository.deleteAll();
        userRepository.deleteAll();

        employer = new User(UUID.randomUUID().toString(), "Tech Employer", "emp@tech.com", "hash", Role.EMPLOYER, AccountStatus.ACTIVE);
        otherEmployer = new User(UUID.randomUUID().toString(), "Other Employer", "other@tech.com", "hash", Role.EMPLOYER, AccountStatus.ACTIVE);
        admin = new User(UUID.randomUUID().toString(), "System Admin", "admin@tech.com", "hash", Role.ADMIN, AccountStatus.ACTIVE);
        userRepository.save(employer);
        userRepository.save(otherEmployer);
        userRepository.save(admin);

        company = new Company();
        company.setId(UUID.randomUUID().toString());
        company.setEmployer(employer);
        company.setCompanyName("TechSprint Labs");
        company.setCompanyEmail("contact@techsprint.io");
        company.setCity("Pune");
        company.setVerificationStatus(CompanyVerificationStatus.VERIFIED);
        companyRepository.save(company);

        job = new Job();
        job.setId(UUID.randomUUID().toString());
        job.setCompany(company);
        job.setCreatedBy(employer);
        job.setTitle("Senior Full Stack Java Engineer");
        job.setStatus(JobStatus.ACTIVE);
        jobRepository.save(job);
    }

    private DriveRequest createSampleDriveRequest() {
        DriveRequest req = new DriveRequest();
        req.setTitle("Pune Tech Walk-In Mega Drive 2026");
        req.setDescription("Direct hiring drive for backend and full-stack positions.");
        req.setDriveDate(LocalDate.now().plusDays(10));
        req.setStartTime("09:30");
        req.setEndTime("17:00");
        req.setRegistrationDeadline(LocalDate.now().plusDays(8));
        req.setVenueName("Magarpatta Tower B Auditorium");
        req.setVenueAddress("Tower B, Cybercity Magarpatta, Hadapsar, Pune");
        req.setCity("Pune");
        req.setState("Maharashtra");
        req.setVacancies(10);
        req.setMaxRegistrations(100);
        req.setJobId(job.getId());
        return req;
    }

    @Test
    @DisplayName("Employer creates drive starting as DRAFT driveStatus")
    void createDriveSuccess() {
        WalkInDrive drive = driveService.createDrive(createSampleDriveRequest(), company.getId(), employer.getId());

        assertNotNull(drive.getId());
        assertEquals(DriveStatus.DRAFT, drive.getDriveStatus());
        assertEquals(employer.getId(), drive.getCreatedBy().getId());
    }

    @Test
    @DisplayName("Other employer cannot update drive (ownership enforced)")
    void updateDriveForbiddenForNonOwner() {
        WalkInDrive drive = driveService.createDrive(createSampleDriveRequest(), company.getId(), employer.getId());

        DriveRequest updateReq = createSampleDriveRequest();
        updateReq.setTitle("Unauthorized Edit");

        assertThrows(ForbiddenException.class, () -> {
            driveService.updateDrive(drive.getId(), updateReq, otherEmployer.getId(), false);
        });
    }

    @Test
    @DisplayName("Submitting drive transitions status to PENDING and preserves DRAFT driveStatus")
    void submitDriveForApproval() {
        WalkInDrive drive = driveService.createDrive(createSampleDriveRequest(), company.getId(), employer.getId());
        drive.setApprovalStatus(DriveApprovalStatus.DRAFT);
        driveRepository.save(drive);

        WalkInDrive submitted = driveService.submitForApproval(drive.getId(), employer.getId());
        assertEquals(DriveApprovalStatus.PENDING, submitted.getApprovalStatus());
        assertEquals(DriveStatus.DRAFT, submitted.getDriveStatus());
        assertNotNull(submitted.getSubmittedAt());
    }

    @Test
    @DisplayName("Submitting already PENDING or APPROVED drive throws BadRequestException")
    void submitAlreadySubmittedThrowsBadRequest() {
        WalkInDrive drive = driveService.createDrive(createSampleDriveRequest(), company.getId(), employer.getId());
        drive.setApprovalStatus(DriveApprovalStatus.PENDING);
        driveRepository.save(drive);

        assertThrows(BadRequestException.class, () -> {
            driveService.submitForApproval(drive.getId(), employer.getId());
        });

        drive.setApprovalStatus(DriveApprovalStatus.APPROVED);
        driveRepository.save(drive);

        assertThrows(BadRequestException.class, () -> {
            driveService.submitForApproval(drive.getId(), employer.getId());
        });
    }

    @Test
    @DisplayName("Admin approval transitions approvalStatus to APPROVED and driveStatus to PUBLISHED")
    void adminApproveDrivePublished() {
        WalkInDrive drive = driveService.createDrive(createSampleDriveRequest(), company.getId(), employer.getId());

        WalkInDrive approved = driveService.approveDrive(drive.getId(), true, "Venue details and compliance approved.", admin.getId());
        assertEquals(DriveApprovalStatus.APPROVED, approved.getApprovalStatus());
        assertEquals(DriveStatus.PUBLISHED, approved.getDriveStatus());
        assertNotNull(approved.getApprovedAt());
    }

    @Test
    @DisplayName("Admin request changes sets CHANGES_REQUESTED and keeps DRAFT")
    void adminRequestChangesWorkflow() {
        WalkInDrive drive = driveService.createDrive(createSampleDriveRequest(), company.getId(), employer.getId());

        String feedback = "Please add specific reporting gate instructions for EON Kharadi campus.";
        WalkInDrive withChanges = driveService.requestChanges(drive.getId(), feedback, admin.getId());

        assertEquals(DriveApprovalStatus.CHANGES_REQUESTED, withChanges.getApprovalStatus());
        assertEquals(DriveStatus.DRAFT, withChanges.getDriveStatus());
        assertEquals(feedback, withChanges.getAdminFeedback());

        // Employer can resubmit after addressing feedback
        WalkInDrive resubmitted = driveService.submitForApproval(drive.getId(), employer.getId());
        assertEquals(DriveApprovalStatus.PENDING, resubmitted.getApprovalStatus());
        assertEquals(DriveStatus.DRAFT, resubmitted.getDriveStatus());
    }

    @Test
    @DisplayName("Admin rejection sets REJECTED and keeps DRAFT")
    void adminRejectDriveWorkflow() {
        WalkInDrive drive = driveService.createDrive(createSampleDriveRequest(), company.getId(), employer.getId());

        String reason = "Capacity requirements exceed venue permissions.";
        WalkInDrive rejected = driveService.approveDrive(drive.getId(), false, reason, admin.getId());

        assertEquals(DriveApprovalStatus.REJECTED, rejected.getApprovalStatus());
        assertEquals(DriveStatus.DRAFT, rejected.getDriveStatus());
        assertEquals(reason, rejected.getAdminFeedback());
    }

    @Test
    @DisplayName("Public search only returns APPROVED and PUBLISHED drives")
    void searchPublishedDrivesFiltering() {
        WalkInDrive draftDrive = driveService.createDrive(createSampleDriveRequest(), company.getId(), employer.getId());
        draftDrive.setApprovalStatus(DriveApprovalStatus.PENDING);
        draftDrive.setDriveStatus(DriveStatus.DRAFT);
        driveRepository.save(draftDrive);

        // Before approval: search returns 0 results
        var beforeApproval = driveService.searchPublishedDrives("Pune Tech", PageRequest.of(0, 10));
        assertEquals(0, beforeApproval.getTotalElements());

        // After approval: search returns the drive
        driveService.approveDrive(draftDrive.getId(), true, "Approved", admin.getId());
        var afterApproval = driveService.searchPublishedDrives("Pune Tech", PageRequest.of(0, 10));
        assertEquals(1, afterApproval.getTotalElements());
    }
}
