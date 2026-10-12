package com.punewalkin.platform.company;

import com.punewalkin.platform.common.exception.ConflictException;
import com.punewalkin.platform.common.exception.ForbiddenException;
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

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class CompanyVerificationTest {

    @Autowired
    private CompanyService companyService;

    @Autowired
    private CompanyRepository companyRepository;

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

    private User employer1;
    private User employer2;
    private User admin;

    @BeforeEach
    void setUp() {
        applicationRepository.deleteAll();
        driveRepository.deleteAll();
        jobRepository.deleteAll();
        companyRepository.deleteAll();
        candidateProfileRepository.deleteAll();
        userRepository.deleteAll();

        employer1 = new User(UUID.randomUUID().toString(), "Employer 1", "emp1@test.com", "hash", Role.EMPLOYER, AccountStatus.ACTIVE);
        employer2 = new User(UUID.randomUUID().toString(), "Employer 2", "emp2@test.com", "hash", Role.EMPLOYER, AccountStatus.ACTIVE);
        admin = new User(UUID.randomUUID().toString(), "Admin", "admin@test.com", "hash", Role.ADMIN, AccountStatus.ACTIVE);

        userRepository.save(employer1);
        userRepository.save(employer2);
        userRepository.save(admin);
    }

    private CompanyRequest createSampleRequest(String name) {
        CompanyRequest req = new CompanyRequest();
        req.setCompanyName(name);
        req.setCompanyEmail("info@" + name.replaceAll("\\s+", "").toLowerCase() + ".com");
        req.setCity("Pune");
        req.setState("Maharashtra");
        req.setPhone("+91 98765 43210");
        return req;
    }

    @Test
    @DisplayName("Created company has PENDING verification status")
    void createCompanyStartsAsPending() {
        Company comp = companyService.createCompany(createSampleRequest("Tech Pune Solutions"), employer1.getId());

        assertNotNull(comp.getId());
        assertEquals(CompanyVerificationStatus.PENDING, comp.getVerificationStatus());
        assertNull(comp.getVerifiedAt());
        assertNull(comp.getVerifiedBy());
    }

    @Test
    @DisplayName("Employer cannot register a second company")
    void duplicateCompanyThrowsConflict() {
        companyService.createCompany(createSampleRequest("Company Alpha"), employer1.getId());

        assertThrows(ConflictException.class, () -> {
            companyService.createCompany(createSampleRequest("Company Beta"), employer1.getId());
        });
    }

    @Test
    @DisplayName("Employer can update own company, but not another employer's company")
    void companyOwnershipEnforcedOnUpdate() {
        Company comp = companyService.createCompany(createSampleRequest("Owner Company"), employer1.getId());

        CompanyRequest updateReq = createSampleRequest("Updated Company Name");
        Company updated = companyService.updateCompany(comp.getId(), updateReq, employer1.getId(), false);
        assertEquals("Updated Company Name", updated.getCompanyName());

        // Attempt update by another employer
        assertThrows(ForbiddenException.class, () -> {
            companyService.updateCompany(comp.getId(), updateReq, employer2.getId(), false);
        });
    }

    @Test
    @DisplayName("Admin verifies company successfully")
    void adminVerifyCompanyApprove() {
        Company comp = companyService.createCompany(createSampleRequest("Verify Target"), employer1.getId());

        Company verified = companyService.verifyCompany(comp.getId(), true, null, admin.getId());
        assertEquals(CompanyVerificationStatus.VERIFIED, verified.getVerificationStatus());
        assertEquals(admin.getId(), verified.getVerifiedBy());
        assertNotNull(verified.getVerifiedAt());
        assertNull(verified.getRejectionReason());
    }

    @Test
    @DisplayName("Admin rejects company with reason recorded")
    void adminVerifyCompanyReject() {
        Company comp = companyService.createCompany(createSampleRequest("Reject Target"), employer1.getId());

        String reason = "GSTIN and registration documentation could not be verified.";
        Company rejected = companyService.verifyCompany(comp.getId(), false, reason, admin.getId());

        assertEquals(CompanyVerificationStatus.REJECTED, rejected.getVerificationStatus());
        assertEquals(reason, rejected.getRejectionReason());
        assertNull(rejected.getVerifiedBy());
    }
}
