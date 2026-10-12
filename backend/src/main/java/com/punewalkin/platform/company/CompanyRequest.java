package com.punewalkin.platform.company;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 200)
    private String companyName;

    private String tagline;

    @NotBlank(message = "Company email is required")
    @Email(message = "Invalid company email")
    @Size(max = 150)
    private String companyEmail;

    private String phone;
    private String alternateContact;
    private String industry;
    private String website;
    private String description;
    private String headquartersAddress;
    private String landmark;
    private String city;
    private String state;
    private String pincode;
    private String employeeSize;
    private Integer foundedYear;
    private String hrContactPerson;
    private String hrContactRole;
    private String activeLocations;

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getCompanyEmail() { return companyEmail; }
    public void setCompanyEmail(String companyEmail) { this.companyEmail = companyEmail; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAlternateContact() { return alternateContact; }
    public void setAlternateContact(String alternateContact) { this.alternateContact = alternateContact; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getHeadquartersAddress() { return headquartersAddress; }
    public void setHeadquartersAddress(String headquartersAddress) { this.headquartersAddress = headquartersAddress; }

    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getEmployeeSize() { return employeeSize; }
    public void setEmployeeSize(String employeeSize) { this.employeeSize = employeeSize; }

    public Integer getFoundedYear() { return foundedYear; }
    public void setFoundedYear(Integer foundedYear) { this.foundedYear = foundedYear; }

    public String getHrContactPerson() { return hrContactPerson; }
    public void setHrContactPerson(String hrContactPerson) { this.hrContactPerson = hrContactPerson; }

    public String getHrContactRole() { return hrContactRole; }
    public void setHrContactRole(String hrContactRole) { this.hrContactRole = hrContactRole; }

    public String getActiveLocations() { return activeLocations; }
    public void setActiveLocations(String activeLocations) { this.activeLocations = activeLocations; }
}
