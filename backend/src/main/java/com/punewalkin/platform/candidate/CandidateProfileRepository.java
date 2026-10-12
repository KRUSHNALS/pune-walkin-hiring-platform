package com.punewalkin.platform.candidate;

import com.punewalkin.platform.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, String> {

    Optional<CandidateProfile> findByUser(User user);

    Optional<CandidateProfile> findByUserId(String userId);

    boolean existsByUserId(String userId);
}
