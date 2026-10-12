package com.punewalkin.platform.company;

import com.punewalkin.platform.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, String> {

    Optional<Company> findByEmployer(User employer);

    Optional<Company> findByEmployerId(String employerId);

    boolean existsByEmployerId(String employerId);

    List<Company> findByVerificationStatus(CompanyVerificationStatus verificationStatus);

    Page<Company> findByVerificationStatus(CompanyVerificationStatus verificationStatus, Pageable pageable);

    long countByVerificationStatus(CompanyVerificationStatus verificationStatus);
}
