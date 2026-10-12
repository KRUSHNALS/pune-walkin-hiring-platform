/**
 * Storage & Mock State Persistence Service
 * Simulates persistence layer with window.localStorage
 * 
 * Shared Unified Data Store:
 * Coordinates shared records across Admin, Employer, and Candidate modules:
 * - Companies (single source of truth with sync to Admin company registry)
 * - Walk-In Drives
 * - Jobs
 * - Candidate Applications
 * - Activity Logs
 */

import {
  INITIAL_COMPANY,
  INITIAL_JOBS,
  INITIAL_DRIVES,
  INITIAL_APPLICATIONS,
  INITIAL_ACTIVITIES,
} from "../mock/mockData.js";
import { normalizeCompanyStatus } from "../utils/statusUtils.js";

const STORAGE_KEYS = {
  COMPANY: "punewalkin_employer_company",
  ADMIN_COMPANIES: "punewalkin_admin_companies",
  JOBS: "punewalkin_employer_jobs",
  DRIVES: "punewalkin_employer_drives",
  APPLICATIONS: "punewalkin_employer_applications",
  ACTIVITIES: "punewalkin_employer_activities",
  USERS: "punewalkin_auth_users",
  ADMIN_USERS: "punewalkin_admin_users",
};

export const storageService = {
  /**
   * Get primary company for current employer profile
   * Synchronized with Admin company registry
   */
  getCompany() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPANY);
      const company = data ? JSON.parse(data) : INITIAL_COMPANY;

      // Cross-check with admin companies registry to ensure verificationStatus matches
      const adminCompaniesRaw = localStorage.getItem(STORAGE_KEYS.ADMIN_COMPANIES);
      if (adminCompaniesRaw) {
        const adminCompanies = JSON.parse(adminCompaniesRaw);
        const match = adminCompanies.find((c) => c.id === company.id);
        if (match && match.verificationStatus) {
          company.verificationStatus = match.verificationStatus;
          if (match.reviewReason !== undefined) {
            company.reviewReason = match.reviewReason;
          }
        }
      }

      return company;
    } catch {
      return INITIAL_COMPANY;
    }
  },

  /**
   * Set primary company and keep admin company list in sync
   */
  setCompany(company) {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company));

      // Synchronize changes to admin companies list if it exists
      const adminCompaniesRaw = localStorage.getItem(STORAGE_KEYS.ADMIN_COMPANIES);
      if (adminCompaniesRaw) {
        const adminCompanies = JSON.parse(adminCompaniesRaw);
        const idx = adminCompanies.findIndex((c) => c.id === company.id);
        if (idx !== -1) {
          adminCompanies[idx] = {
            ...adminCompanies[idx],
            name: company.name || adminCompanies[idx].name,
            email: company.officialEmail || adminCompanies[idx].email,
            industry: company.industry || adminCompanies[idx].industry,
            website: company.website || adminCompanies[idx].website,
            contactNumber: company.contactNumber || adminCompanies[idx].contactNumber,
            location: `${company.city || "Pune"}, ${company.state || "Maharashtra"}`,
            description: company.description || adminCompanies[idx].description,
            verificationStatus: company.verificationStatus || adminCompanies[idx].verificationStatus,
          };
          localStorage.setItem(STORAGE_KEYS.ADMIN_COMPANIES, JSON.stringify(adminCompanies));
        }
      }
    } catch (e) {
      console.warn("Storage error saving company", e);
    }
    return company;
  },

  /**
   * Get all registered companies (Admin company registry)
   */
  getCompanies() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_COMPANIES);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Error reading admin companies", e);
    }

    // Default seed companies if not yet saved
    const primary = this.getCompany();
    const defaultList = [
      {
        id: primary.id || "comp-pune-01",
        employerId: primary.employerId || "emp-ritik-01",
        name: primary.name || "TechSprint Innovations Pvt. Ltd.",
        employerName: primary.hrContactPerson || "Ritik Sawarkar",
        email: primary.officialEmail || "careers@techsprint.io",
        industry: primary.industry || "Information Technology & Software Services",
        registrationDate: primary.verifiedAt || "2026-01-15",
        verificationStatus: normalizeCompanyStatus(primary.verificationStatus) || "VERIFIED",
        website: primary.website || "https://techsprint.io",
        contactNumber: primary.contactNumber || "+91 98230 45678",
        location: `${primary.city || "Pune"}, ${primary.state || "Maharashtra"}`,
        description:
          primary.description ||
          "Enterprise software development company serving Fortune 500 clients.",
        reviewReason: "",
        documents: ["GST registration", "Incorporation certificate", "Director KYC"],
      },
      {
        id: "comp-02",
        employerId: "emp-02",
        name: "CloudCore Systems",
        employerName: "Ananya Kulkarni",
        email: "hr@cloudcore.in",
        industry: "Cloud Infrastructure & DevOps",
        registrationDate: "2026-09-18",
        verificationStatus: "PENDING",
        website: "https://cloudcore.in",
        contactNumber: "+91 97642 88012",
        location: "Hinjawadi, Pune",
        description: "Cloud infrastructure consultancy helping SMEs modernize pipelines.",
        reviewReason: "Awaiting business proof and GST document validation.",
        documents: ["GST proof", "Business registration"],
      },
      {
        id: "comp-03",
        employerId: "emp-03",
        name: "MotiveWorks Labs",
        employerName: "Saurabh Phadke",
        email: "careers@motifworks.com",
        industry: "Product Engineering & SaaS",
        registrationDate: "2026-09-22",
        verificationStatus: "PENDING",
        website: "https://motifworks.com",
        contactNumber: "+91 98902 68945",
        location: "Baner, Pune",
        description: "B2B SaaS studio focused on data intelligence workflows.",
        reviewReason: "Awaiting office address confirmation.",
        documents: ["Address proof", "Company PAN"],
      },
      {
        id: "comp-04",
        employerId: "emp-04",
        name: "UrbanNest Talent Group",
        employerName: "Nisha Rane",
        email: "hello@urbannesttalent.com",
        industry: "Recruitment & Staffing Services",
        registrationDate: "2026-09-27",
        verificationStatus: "REJECTED",
        website: "https://urbannesttalent.com",
        contactNumber: "+91 99728 55230",
        location: "Kharadi, Pune",
        description: "Specialized recruitment concierge serving retail hiring.",
        reviewReason: "Submitted incomplete registration documents and mismatch in contact information.",
        documents: ["Registration File"],
      },
    ];

    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_COMPANIES, JSON.stringify(defaultList));
    } catch (e) {
      console.warn("Storage error saving admin companies", e);
    }

    return defaultList;
  },

  /**
   * Save full company list
   */
  saveCompanies(companies) {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_COMPANIES, JSON.stringify(companies));
    } catch (e) {
      console.warn("Storage error saving admin companies", e);
    }
    return companies;
  },

  /**
   * Update company verification status and sync with primary company & employer user
   */
  updateCompanyVerification(companyId, nextStatus, reviewReason = "") {
    const companies = this.getCompanies();
    const updatedCompanies = companies.map((comp) => {
      if (comp.id === companyId) {
        return {
          ...comp,
          verificationStatus: nextStatus,
          reviewReason:
            reviewReason ||
            (nextStatus === "REJECTED"
              ? "Application did not meet required verification standards."
              : ""),
        };
      }
      return comp;
    });

    this.saveCompanies(updatedCompanies);

    // If matching primary company, sync it immediately
    const primary = this.getCompany();
    if (primary.id === companyId) {
      const updatedPrimary = {
        ...primary,
        verificationStatus: nextStatus,
        reviewReason: reviewReason || (nextStatus === "REJECTED" ? "Verification rejected by Admin" : ""),
        verifiedAt: nextStatus === "VERIFIED" ? new Date().toISOString().split("T")[0] : primary.verifiedAt,
      };
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(updatedPrimary));
    }

    // Also update associated employer user status in auth users and admin users
    try {
      const targetCompany = updatedCompanies.find((c) => c.id === companyId);
      if (targetCompany) {
        const userStatus = nextStatus === "VERIFIED" ? "VERIFIED" : nextStatus === "REJECTED" ? "SUSPENDED" : "PENDING_VERIFICATION";
        
        // Sync auth users
        const authUsersRaw = localStorage.getItem(STORAGE_KEYS.USERS);
        if (authUsersRaw) {
          const authUsers = JSON.parse(authUsersRaw);
          const updatedAuth = authUsers.map((u) => {
            if (
              (u.companyId && u.companyId === companyId) ||
              (u.companyName && targetCompany.name && u.companyName.toLowerCase() === targetCompany.name.toLowerCase()) ||
              (u.email && targetCompany.email && u.email.toLowerCase() === targetCompany.email.toLowerCase())
            ) {
              return { ...u, status: userStatus };
            }
            return u;
          });
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedAuth));
        }

        // Sync admin users
        const adminUsersRaw = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
        if (adminUsersRaw) {
          const adminUsers = JSON.parse(adminUsersRaw);
          const updatedAdmin = adminUsers.map((u) => {
            if (
              (u.companyId && u.companyId === companyId) ||
              (u.companyName && targetCompany.name && u.companyName.toLowerCase() === targetCompany.name.toLowerCase()) ||
              (u.email && targetCompany.email && u.email.toLowerCase() === targetCompany.email.toLowerCase())
            ) {
              return { ...u, status: userStatus };
            }
            return u;
          });
          localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(updatedAdmin));
        }
      }
    } catch (err) {
      console.warn("Error updating user status with company verification", err);
    }

    return updatedCompanies;
  },

  /**
   * Register a new employer company into the shared registry
   */
  registerNewEmployerCompany(companyData, employerUser) {
    const companies = this.getCompanies();
    const newId = `comp-${Date.now()}`;
    const newCompany = {
      id: newId,
      employerId: employerUser?.id || `user-emp-${Date.now()}`,
      name: companyData.name || companyData.companyName || "New Enterprise",
      employerName: employerUser?.name || "Corporate Recruiter",
      email: employerUser?.email || companyData.email || "",
      industry: companyData.industry || "Information Technology",
      registrationDate: new Date().toISOString().split("T")[0],
      verificationStatus: "PENDING",
      website: companyData.website || "",
      contactNumber: employerUser?.phone || companyData.contactNumber || "",
      location: companyData.location || "Pune, Maharashtra",
      description: companyData.description || "Corporate employer registration submitted for admin verification.",
      reviewReason: "Awaiting administrator review of business documents.",
      documents: ["Business Registration Proof"],
    };

    const updated = [newCompany, ...companies];
    this.saveCompanies(updated);

    this.addActivity({
      type: "company_registered",
      title: "New Company Registered",
      description: `${newCompany.name} submitted for admin verification.`,
      entityId: newId,
    });

    return newCompany;
  },

  getJobs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOBS);
      return data ? JSON.parse(data) : INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  },

  setJobs(jobs) {
    try {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    } catch (e) {
      console.warn("Storage error saving jobs", e);
    }
    return jobs;
  },

  getDrives() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DRIVES);
      return data ? JSON.parse(data) : INITIAL_DRIVES;
    } catch {
      return INITIAL_DRIVES;
    }
  },

  setDrives(drives) {
    try {
      localStorage.setItem(STORAGE_KEYS.DRIVES, JSON.stringify(drives));
    } catch (e) {
      console.warn("Storage error saving drives", e);
    }
    return drives;
  },

  getApplications() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  },

  setApplications(applications) {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch (e) {
      console.warn("Storage error saving applications", e);
    }
    return applications;
  },

  getActivities() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  },

  addActivity(activity) {
    try {
      const activities = this.getActivities();
      const updated = [
        {
          id: `act-${Date.now()}`,
          timestamp: "Just now",
          ...activity,
        },
        ...activities,
      ].slice(0, 20);
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  resetAllData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.COMPANY);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_COMPANIES);
      localStorage.removeItem(STORAGE_KEYS.JOBS);
      localStorage.removeItem(STORAGE_KEYS.DRIVES);
      localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    } catch (e) {
      console.warn("Error resetting storage", e);
    }
  },
};
