package com.punewalkin.platform.application;

import com.punewalkin.platform.candidate.CandidateProfile;
import com.punewalkin.platform.candidate.CandidateProfileRepository;
import com.punewalkin.platform.common.exception.BadRequestException;
import com.punewalkin.platform.common.exception.ConflictException;
import com.punewalkin.platform.common.exception.ForbiddenException;
import com.punewalkin.platform.company.Company;
import com.punewalkin.platform.company.CompanyRepository;
import com.punewalkin.platform.company.CompanyVerificationStatus;
import com.punewalkin.platform.drive.DriveApprovalStatus;
import com.punewalkin.platform.drive.DriveRepository;
import com.punewalkin.platform.drive.DriveStatus;
import com.punewalkin.platform.drive.WalkInDrive;
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
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class ApplicationWorkflowTest {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private DriveRepository driveRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private UserRepository userRepository;

    private User candidateUser1;
    private User candidateUser2;
    private CandidateProfile candidateProfile1;
    private CandidateProfile candidateProfile2;
    private WalkInDrive approvedDrive;

    @BeforeEach
    void setUp() {
        applicationRepository.deleteAll();
        driveRepository.deleteAll();
        jobRepository.deleteAll();
        companyRepository.deleteAll();
        candidateProfileRepository.deleteAll();
        userRepository.deleteAll();

        // Employer & Company
        User employer = new User(UUID.randomUUID().toString(), "Tech Employer", "emp@tech.io", "pwd", Role.EMPLOYER, AccountStatus.ACTIVE);
        userRepository.save(employer);

        Company company = new Company();
        company.setId(UUID.randomUUID().toString());
        company.setEmployer(employer);
        company.setCompanyName("Infosystems Pune");
        company.setCompanyEmail("hr@infosystems.io");
        company.setCity("Pune");
        company.setVerificationStatus(CompanyVerificationStatus.VERIFIED);
        companyRepository.save(company);

        // Job
        Job job = new Job();
        job.setId(UUID.randomUUID().toString());
        job.setCompany(company);
        job.setCreatedBy(employer);
        job.setTitle("Junior Software Developer");
        job.setStatus(JobStatus.ACTIVE);
        jobRepository.save(job);

        // Approved Drive
        approvedDrive = new WalkInDrive();
        approvedDrive.setId(UUID.randomUUID().toString());
        approvedDrive.setCompany(company);
        approvedDrive.setJob(job);
        approvedDrive.setCreatedBy(employer);
        approvedDrive.setTitle("Infosystems Mega Walk-In Drive 2026");
        approvedDrive.setDriveDate(LocalDate.now().plusDays(7));
        approvedDrive.setStartTime("10:00");
        approvedDrive.setEndTime("16:00");
        approvedDrive.setRegistrationDeadline(LocalDate.now().plusDays(5));
        approvedDrive.setVenueName("Infosystems Pune Auditorium");
        approvedDrive.setVenueAddress("Hinjawadi Phase 2, Pune");
        approvedDrive.setVacancies(5);
        approvedDrive.setMaxRegistrations(50);
        approvedDrive.setRegisteredCount(0);
        approvedDrive.setApprovalStatus(DriveApprovalStatus.APPROVED);
        approvedDrive.setDriveStatus(DriveStatus.PUBLISHED);
        driveRepository.save(approvedDrive);

        // Candidates
        candidateUser1 = new User(UUID.randomUUID().toString(), "Aarav Sharma", "aarav@gmail.com", "pwd", Role.CANDIDATE, AccountStatus.ACTIVE);
        userRepository.save(candidateUser1);
        candidateProfile1 = new CandidateProfile();
        candidateProfile1.setId(UUID.randomUUID().toString());
        candidateProfile1.setUser(candidateUser1);
        candidateProfile1.setResumeFileName("Aarav_Resume.pdf");
        candidateProfileRepository.save(candidateProfile1);

        candidateUser2 = new User(UUID.randomUUID().toString(), "Neha Joshi", "neha@gmail.com", "pwd", Role.CANDIDATE, AccountStatus.ACTIVE);
        userRepository.save(candidateUser2);
        candidateProfile2 = new CandidateProfile();
        candidateProfile2.setId(UUID.randomUUID().toString());
        candidateProfile2.setUser(candidateUser2);
        candidateProfile2.setResumeFileName("Neha_Resume.pdf");
        candidateProfileRepository.save(candidateProfile2);
    }

    @Test
    @DisplayName("Candidate successfully applies to approved drive")
    void applyToApprovedDriveSuccess() {
        Application app = applicationService.applyToDrive(approvedDrive.getId(), candidateUser1.getId());

        assertNotNull(app.getId());
        assertEquals(ApplicationStatus.REGISTERED, app.getStatus());
        assertTrue(app.getTokenNumber().startsWith("TKN-"));
        assertEquals("Aarav_Resume.pdf", app.getResumeFileName());

        WalkInDrive refreshed = driveRepository.findById(approvedDrive.getId()).orElseThrow();
        assertEquals(1, refreshed.getRegisteredCount());
    }

    @Test
    @DisplayName("Applying to unapproved/draft drive throws BadRequestException")
    void applyToUnapprovedDriveBadRequest() {
        approvedDrive.setApprovalStatus(DriveApprovalStatus.PENDING);
        driveRepository.save(approvedDrive);

        assertThrows(BadRequestException.class, () -> {
            applicationService.applyToDrive(approvedDrive.getId(), candidateUser1.getId());
        });
    }

    @Test
    @DisplayName("Duplicate application by same candidate throws ConflictException (409)")
    void duplicateApplicationThrowsConflict() {
        applicationService.applyToDrive(approvedDrive.getId(), candidateUser1.getId());

        ConflictException ex = assertThrows(ConflictException.class, () -> {
            applicationService.applyToDrive(approvedDrive.getId(), candidateUser1.getId());
        });
        assertTrue(ex.getMessage().contains("already applied"));
    }

    @Test
    @DisplayName("Applying after registration deadline throws BadRequestException")
    void applyAfterDeadlineThrowsBadRequest() {
        approvedDrive.setRegistrationDeadline(LocalDate.now().minusDays(1));
        driveRepository.save(approvedDrive);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            applicationService.applyToDrive(approvedDrive.getId(), candidateUser1.getId());
        });
        assertTrue(ex.getMessage().contains("deadline has passed"));
    }

    @Test
    @DisplayName("Applying when drive reaches max registrations throws BadRequestException")
    void applyWhenMaxRegistrationsReachedThrowsBadRequest() {
        approvedDrive.setMaxRegistrations(1);
        approvedDrive.setRegisteredCount(1);
        driveRepository.save(approvedDrive);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            applicationService.applyToDrive(approvedDrive.getId(), candidateUser1.getId());
        });
        assertTrue(ex.getMessage().contains("maximum registrations"));
    }

    @Test
    @DisplayName("Candidate can withdraw own application and registered count decrements")
    void withdrawOwnApplicationSuccess() {
        Application app = applicationService.applyToDrive(approvedDrive.getId(), candidateUser1.getId());
        assertEquals(1, driveRepository.findById(approvedDrive.getId()).orElseThrow().getRegisteredCount());

        Application withdrawn = applicationService.withdrawApplication(app.getId(), candidateUser1.getId());
        assertEquals(ApplicationStatus.WITHDRAWN, withdrawn.getStatus());

        WalkInDrive refreshed = driveRepository.findById(approvedDrive.getId()).orElseThrow();
        assertEquals(0, refreshed.getRegisteredCount());
    }

    @Test
    @DisplayName("Other candidate cannot withdraw application (ForbiddenException)")
    void withdrawOtherCandidateApplicationForbidden() {
        Application app = applicationService.applyToDrive(approvedDrive.getId(), candidateUser1.getId());

        assertThrows(ForbiddenException.class, () -> {
            applicationService.withdrawApplication(app.getId(), candidateUser2.getId());
        });
    }
}
