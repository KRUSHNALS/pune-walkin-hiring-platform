package com.punewalkin.platform.company;

import com.punewalkin.platform.common.exception.BadRequestException;
import com.punewalkin.platform.common.exception.ConflictException;
import com.punewalkin.platform.common.exception.ForbiddenException;
import com.punewalkin.platform.common.exception.ResourceNotFoundException;
import com.punewalkin.platform.user.User;
import com.punewalkin.platform.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyService(CompanyRepository companyRepository, UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Company createCompany(CompanyRequest request, String employerUserId) {
        // One employer can only have one company
        if (companyRepository.existsByEmployerId(employerUserId)) {
            throw new ConflictException("You have already registered a company. Please update your existing company.");
        }

        User employer = userRepository.findById(employerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + employerUserId));

        Company company = new Company();
        company.setId(UUID.randomUUID().toString());
        company.setEmployer(employer);
        applyRequest(company, request);
        company.setVerificationStatus(CompanyVerificationStatus.PENDING);
        return companyRepository.save(company);
    }

    @Transactional
    public Company updateCompany(String companyId, CompanyRequest request, String requestingUserId, boolean isAdmin) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + companyId));

        if (!isAdmin && !company.getEmployer().getId().equals(requestingUserId)) {
            throw new ForbiddenException("You are not authorized to update this company.");
        }
        applyRequest(company, request);
        return companyRepository.save(company);
    }

    private void applyRequest(Company company, CompanyRequest req) {
        if (req.getCompanyName() != null) company.setCompanyName(req.getCompanyName());
        if (req.getTagline() != null) company.setTagline(req.getTagline());
        if (req.getCompanyEmail() != null) company.setCompanyEmail(req.getCompanyEmail());
        if (req.getPhone() != null) company.setPhone(req.getPhone());
        if (req.getAlternateContact() != null) company.setAlternateContact(req.getAlternateContact());
        if (req.getIndustry() != null) company.setIndustry(req.getIndustry());
        if (req.getWebsite() != null) company.setWebsite(req.getWebsite());
        if (req.getDescription() != null) company.setDescription(req.getDescription());
        if (req.getHeadquartersAddress() != null) company.setHeadquartersAddress(req.getHeadquartersAddress());
        if (req.getLandmark() != null) company.setLandmark(req.getLandmark());
        if (req.getCity() != null) company.setCity(req.getCity());
        if (req.getState() != null) company.setState(req.getState());
        if (req.getPincode() != null) company.setPincode(req.getPincode());
        if (req.getEmployeeSize() != null) company.setEmployeeSize(req.getEmployeeSize());
        if (req.getFoundedYear() != null) company.setFoundedYear(req.getFoundedYear());
        if (req.getHrContactPerson() != null) company.setHrContactPerson(req.getHrContactPerson());
        if (req.getHrContactRole() != null) company.setHrContactRole(req.getHrContactRole());
        if (req.getActiveLocations() != null) company.setActiveLocations(req.getActiveLocations());
    }

    public Company getCompanyById(String companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + companyId));
    }

    public Company getCompanyByEmployerId(String employerUserId) {
        return companyRepository.findByEmployerId(employerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("No company found for this employer."));
    }

    public Page<Company> getAllCompanies(Pageable pageable) {
        return companyRepository.findAll(pageable);
    }

    public Page<Company> getCompaniesByStatus(CompanyVerificationStatus status, Pageable pageable) {
        return companyRepository.findByVerificationStatus(status, pageable);
    }

    @Transactional
    public Company verifyCompany(String companyId, boolean approve, String reason, String adminUserId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + companyId));

        if (approve) {
            company.setVerificationStatus(CompanyVerificationStatus.VERIFIED);
            company.setVerifiedBy(adminUserId);
            company.setVerifiedAt(LocalDateTime.now());
            company.setRejectionReason(null);
        } else {
            company.setVerificationStatus(CompanyVerificationStatus.REJECTED);
            company.setRejectionReason(reason);
        }
        return companyRepository.save(company);
    }

    @Transactional
    public void deleteCompany(String companyId, String requestingUserId, boolean isAdmin) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + companyId));
        if (!isAdmin && !company.getEmployer().getId().equals(requestingUserId)) {
            throw new ForbiddenException("Not authorized to delete this company.");
        }
        companyRepository.delete(company);
    }
}
