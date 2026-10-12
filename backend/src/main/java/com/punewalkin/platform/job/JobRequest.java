package com.punewalkin.platform.job;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class JobRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 200)
    private String title;

    private String department;
    private String employmentType;
    private String workMode;
    private String location;

    @Min(value = 1, message = "At least 1 vacancy required")
    private Integer vacancies;

    private Double minExperience;
    private Double maxExperience;
    private String salaryRange;
    private String qualification;
    private String eligibilityCriteria;
    private String requiredSkills;
    private String description;
    private String responsibilities;
    private LocalDate deadline;
    private JobStatus status;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }

    public String getWorkMode() { return workMode; }
    public void setWorkMode(String workMode) { this.workMode = workMode; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getVacancies() { return vacancies; }
    public void setVacancies(Integer vacancies) { this.vacancies = vacancies; }

    public Double getMinExperience() { return minExperience; }
    public void setMinExperience(Double minExperience) { this.minExperience = minExperience; }

    public Double getMaxExperience() { return maxExperience; }
    public void setMaxExperience(Double maxExperience) { this.maxExperience = maxExperience; }

    public String getSalaryRange() { return salaryRange; }
    public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getEligibilityCriteria() { return eligibilityCriteria; }
    public void setEligibilityCriteria(String eligibilityCriteria) { this.eligibilityCriteria = eligibilityCriteria; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getResponsibilities() { return responsibilities; }
    public void setResponsibilities(String responsibilities) { this.responsibilities = responsibilities; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }
}
