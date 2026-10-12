package com.punewalkin.platform.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {

    List<Application> findByCandidateId(String candidateId);

    Page<Application> findByCandidateId(String candidateId, Pageable pageable);

    Page<Application> findByDriveId(String driveId, Pageable pageable);

    Page<Application> findByCompanyId(String companyId, Pageable pageable);

    Optional<Application> findByCandidateIdAndDriveId(String candidateId, String driveId);

    boolean existsByCandidateIdAndDriveId(String candidateId, String driveId);

    long countByDriveId(String driveId);

    long countByDriveIdAndStatus(String driveId, ApplicationStatus status);

    long countByCompanyId(String companyId);

    long countByStatus(ApplicationStatus status);

    @Query("SELECT a FROM Application a WHERE a.drive.id = :driveId ORDER BY a.appliedAt DESC")
    Page<Application> findAllByDriveIdOrderByAppliedAt(@Param("driveId") String driveId, Pageable pageable);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.company.id = :companyId AND a.status = :status")
    long countByCompanyIdAndStatus(@Param("companyId") String companyId, @Param("status") ApplicationStatus status);
}
