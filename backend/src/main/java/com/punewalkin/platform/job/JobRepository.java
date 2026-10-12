package com.punewalkin.platform.job;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, String> {

    List<Job> findByCompanyId(String companyId);

    List<Job> findByCreatedById(String createdById);

    Page<Job> findByCompanyId(String companyId, Pageable pageable);

    Page<Job> findByStatus(JobStatus status, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' AND " +
           "(:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(j.department) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Job> searchActiveJobs(@Param("search") String search, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.status = :status AND " +
           "(:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(j.department) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Job> searchPublishedJobs(@Param("status") JobStatus status,
                                  @Param("search") String search,
                                  Pageable pageable);

    long countByStatus(JobStatus status);

    long countByCompanyIdAndStatus(String companyId, JobStatus status);
}

