package com.punewalkin.platform.candidate;

import com.punewalkin.platform.common.exception.ForbiddenException;
import com.punewalkin.platform.common.exception.ResourceNotFoundException;
import com.punewalkin.platform.user.User;
import com.punewalkin.platform.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CandidateService {

    private final CandidateProfileRepository profileRepository;
    private final UserRepository userRepository;

    public CandidateService(CandidateProfileRepository profileRepository,
                             UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public CandidateProfile getProfileByUserId(String userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found for user: " + userId));
    }

    public CandidateProfile getProfileById(String profileId) {
        return profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found: " + profileId));
    }

    public Page<CandidateProfile> getAllProfiles(Pageable pageable) {
        return profileRepository.findAll(pageable);
    }

    @Transactional
    public CandidateProfile updateProfile(String userId, CandidateProfileRequest request) {
        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        // Update User full name if provided
        if (request.getFullName() != null) {
            userRepository.findById(userId).ifPresent(user -> {
                user.setFullName(request.getFullName());
                userRepository.save(user);
            });
        }

        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getState() != null) profile.setState(request.getState());
        if (request.getAddress() != null) profile.setAddress(request.getAddress());
        if (request.getHeadline() != null) profile.setHeadline(request.getHeadline());
        if (request.getAbout() != null) profile.setAbout(request.getAbout());
        if (request.getHighestQualification() != null) profile.setHighestQualification(request.getHighestQualification());
        if (request.getAggregate() != null) profile.setAggregate(request.getAggregate());
        if (request.getIsFresher() != null) profile.setFresher(request.getIsFresher());
        if (request.getExperienceYears() != null) profile.setExperienceYears(request.getExperienceYears());
        if (request.getCurrentDesignation() != null) profile.setCurrentDesignation(request.getCurrentDesignation());
        if (request.getPreviousCompany() != null) profile.setPreviousCompany(request.getPreviousCompany());

        // Handle skills
        if (request.getSkills() != null) {
            profile.getSkills().clear();
            for (String skillName : request.getSkills()) {
                CandidateSkill skill = new CandidateSkill();
                skill.setId(UUID.randomUUID().toString());
                skill.setCandidate(profile);
                skill.setSkillName(skillName);
                profile.getSkills().add(skill);
            }
        }

        // Handle education
        if (request.getEducation() != null) {
            profile.getEducation().clear();
            for (CandidateProfileRequest.EducationDto edDto : request.getEducation()) {
                CandidateEducation ed = new CandidateEducation();
                ed.setId(UUID.randomUUID().toString());
                ed.setCandidate(profile);
                ed.setQualification(edDto.getQualification());
                ed.setCourse(edDto.getCourse());
                ed.setInstitution(edDto.getInstitution());
                ed.setGraduationYear(edDto.getGraduationYear());
                ed.setScore(edDto.getScore());
                ed.setEducationType(edDto.getEducationType());
                profile.getEducation().add(ed);
            }
        }

        // Handle experience
        if (request.getExperience() != null) {
            profile.getExperience().clear();
            for (CandidateProfileRequest.ExperienceDto expDto : request.getExperience()) {
                CandidateExperience exp = new CandidateExperience();
                exp.setId(UUID.randomUUID().toString());
                exp.setCandidate(profile);
                exp.setTitle(expDto.getTitle());
                exp.setCompany(expDto.getCompany());
                exp.setDuration(expDto.getDuration());
                exp.setLocation(expDto.getLocation());
                exp.setDescription(expDto.getDescription());
                profile.getExperience().add(exp);
            }
        }

        return profileRepository.save(profile);
    }

    @Transactional
    public CandidateProfile updateResumeInfo(String userId, String fileName, String fileSize, String fileType) {
        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));
        profile.setResumeFileName(fileName);
        profile.setResumeFileSize(fileSize);
        profile.setResumeFileType(fileType);
        profile.setResumeUploadedAt(LocalDateTime.now());
        return profileRepository.save(profile);
    }
}
