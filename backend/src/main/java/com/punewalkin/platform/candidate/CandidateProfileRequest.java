package com.punewalkin.platform.candidate;

import java.util.List;

public class CandidateProfileRequest {

    private String fullName;
    private String phone;
    private String city;
    private String state;
    private String address;
    private String headline;
    private String about;
    private String highestQualification;
    private String aggregate;
    private Boolean isFresher;
    private Double experienceYears;
    private String currentDesignation;
    private String previousCompany;
    private List<String> skills;
    private List<EducationDto> education;
    private List<ExperienceDto> experience;

    public static class EducationDto {
        private String qualification;
        private String course;
        private String institution;
        private String graduationYear;
        private String score;
        private String educationType;

        public String getQualification() { return qualification; }
        public void setQualification(String qualification) { this.qualification = qualification; }
        public String getCourse() { return course; }
        public void setCourse(String course) { this.course = course; }
        public String getInstitution() { return institution; }
        public void setInstitution(String institution) { this.institution = institution; }
        public String getGraduationYear() { return graduationYear; }
        public void setGraduationYear(String graduationYear) { this.graduationYear = graduationYear; }
        public String getScore() { return score; }
        public void setScore(String score) { this.score = score; }
        public String getEducationType() { return educationType; }
        public void setEducationType(String educationType) { this.educationType = educationType; }
    }

    public static class ExperienceDto {
        private String title;
        private String company;
        private String duration;
        private String location;
        private String description;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }
        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }
    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }
    public String getHighestQualification() { return highestQualification; }
    public void setHighestQualification(String highestQualification) { this.highestQualification = highestQualification; }
    public String getAggregate() { return aggregate; }
    public void setAggregate(String aggregate) { this.aggregate = aggregate; }
    public Boolean getIsFresher() { return isFresher; }
    public void setIsFresher(Boolean isFresher) { this.isFresher = isFresher; }
    public Double getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Double experienceYears) { this.experienceYears = experienceYears; }
    public String getCurrentDesignation() { return currentDesignation; }
    public void setCurrentDesignation(String currentDesignation) { this.currentDesignation = currentDesignation; }
    public String getPreviousCompany() { return previousCompany; }
    public void setPreviousCompany(String previousCompany) { this.previousCompany = previousCompany; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public List<EducationDto> getEducation() { return education; }
    public void setEducation(List<EducationDto> education) { this.education = education; }
    public List<ExperienceDto> getExperience() { return experience; }
    public void setExperience(List<ExperienceDto> experience) { this.experience = experience; }
}
