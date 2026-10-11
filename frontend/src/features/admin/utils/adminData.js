import { INITIAL_DEMO_USERS } from "../../auth/services/authService";
import { storageService } from "../../../services/storageService";

const ADMIN_COMPANIES_KEY = "punewalkin_admin_companies";
const ADMIN_USERS_KEY = "punewalkin_admin_users";
const ADMIN_NOTIFICATIONS_KEY = "punewalkin_admin_notifications";
const ADMIN_SETTINGS_KEY = "punewalkin_admin_settings";

export function getAdminCompanies() {
  try {
    const stored = localStorage.getItem(ADMIN_COMPANIES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Unable to read admin companies", error);
  }

  const primaryCompany = storageService.getCompany();
  const defaultCompanies = [
    {
      id: primaryCompany.id || "comp-pune-01",
      name: primaryCompany.name || "TechSprint Innovations Pvt. Ltd.",
      employerName: "Ritik Sawarkar",
      email: primaryCompany.officialEmail || "careers@techsprint.io",
      industry: primaryCompany.industry || "Information Technology & Software Services",
      registrationDate: "2026-01-15",
      verificationStatus: "VERIFIED",
      website: primaryCompany.website || "https://techsprint.io",
      contactNumber: primaryCompany.contactNumber || "+91 98230 45678",
      location: `${primaryCompany.city || "Pune"}, ${primaryCompany.state || "Maharashtra"}`,
      description: primaryCompany.description || "Enterprise software development company serving Fortune 500 clients across product engineering and cloud transformation.",
      reviewReason: "",
      documents: ["GST registration", "Incorporation certificate", "Bank verification", "Director KYC"],
    },
    {
      id: "comp-02",
      name: "CloudCore Systems",
      employerName: "Ananya Kulkarni",
      email: "hr@cloudcore.in",
      industry: "Cloud Infrastructure & DevOps",
      registrationDate: "2026-09-18",
      verificationStatus: "PENDING",
      website: "https://cloudcore.in",
      contactNumber: "+91 97642 88012",
      location: "Hinjawadi, Pune",
      description: "Cloud infrastructure and digital transformation consultancy helping SMEs modernize their deployment pipelines.",
      reviewReason: "Awaiting business proof and GST document validation.",
      documents: ["GST proof", "Business registration", "PAN verification"],
    },
    {
      id: "comp-03",
      name: "MotiveWorks Labs",
      employerName: "Saurabh Phadke",
      email: "careers@motifworks.com",
      industry: "Product Engineering & SaaS",
      registrationDate: "2026-09-22",
      verificationStatus: "PENDING",
      website: "https://motifworks.com",
      contactNumber: "+91 98902 68945",
      location: "Baner, Pune",
      description: "B2B SaaS studio focused on data intelligence and workflow automation products for enterprise buyers.",
      reviewReason: "Awaiting office address confirmation and founder identity verification.",
      documents: ["Address proof", "Founder KYC", "Company PAN"],
    },
    {
      id: "comp-04",
      name: "UrbanNest Talent Group",
      employerName: "Nisha Rane",
      email: "hello@urbannesttalent.com",
      industry: "Recruitment & Staffing Services",
      registrationDate: "2026-09-27",
      verificationStatus: "REJECTED",
      website: "https://urbannesttalent.com",
      contactNumber: "+91 99728 55230",
      location: "Kharadi, Pune",
      description: "Specialized recruitment concierge serving retail, logistics, and enterprise operations hiring programs.",
      reviewReason: "Submitted incomplete registration documents and mismatch in contact information.",
      documents: ["Registration File", "Employee list"],
    },
  ];

  localStorage.setItem(ADMIN_COMPANIES_KEY, JSON.stringify(defaultCompanies));
  return defaultCompanies;
}

export function saveAdminCompanies(companies) {
  localStorage.setItem(ADMIN_COMPANIES_KEY, JSON.stringify(companies));
  return companies;
}

export function getAdminUsers() {
  try {
    const stored = localStorage.getItem(ADMIN_USERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Unable to read admin users", error);
  }

  const defaultUsers = [
    ...INITIAL_DEMO_USERS.filter((user) => user.role !== "ADMIN").map((user) => ({
      ...user,
      status: user.role === "EMPLOYER" ? "VERIFIED" : "ACTIVE",
      lastActive: user.role === "EMPLOYER" ? "2026-10-11" : "2026-10-10",
    })),
    {
      id: "user-emp-02",
      name: "Ananya Kulkarni",
      email: "ananya.kulkarni@cloudcore.in",
      role: "EMPLOYER",
      status: "PENDING_VERIFICATION",
      companyName: "CloudCore Systems",
      designation: "Director - Talent Acquisition",
      createdAt: "2026-09-12",
      lastActive: "2026-10-09",
    },
    {
      id: "user-cand-02",
      name: "Ritika Bhosale",
      email: "ritika.bhosale@gmail.com",
      role: "CANDIDATE",
      status: "SUSPENDED",
      createdAt: "2026-09-17",
      lastActive: "2026-10-08",
    },
    {
      id: "user-cand-03",
      name: "Prathamesh Nalage",
      email: "prathamesh.nalage@gmail.com",
      role: "CANDIDATE",
      status: "ACTIVE",
      createdAt: "2026-09-28",
      lastActive: "2026-10-11",
    },
  ];

  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

export function saveAdminUsers(users) {
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
  return users;
}

export function getAdminNotifications() {
  try {
    const stored = localStorage.getItem(ADMIN_NOTIFICATIONS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Unable to read admin notifications", error);
  }

  const defaultNotifications = [
    {
      id: "notif-01",
      title: "Drive approval pending",
      detail: "CloudCore Systems submitted a DevOps drive for review.",
      timestamp: "8 mins ago",
      unread: true,
      category: "Approval",
    },
    {
      id: "notif-02",
      title: "Company verification request",
      detail: "MotiveWorks Labs submitted documents for verification.",
      timestamp: "22 mins ago",
      unread: true,
      category: "Verification",
    },
    {
      id: "notif-03",
      title: "Test score report ready",
      detail: "The latest candidate assessment report is ready for download.",
      timestamp: "1 hour ago",
      unread: false,
      category: "Reports",
    },
    {
      id: "notif-04",
      title: "User activity alert",
      detail: "Three candidates were flagged for profile review today.",
      timestamp: "2 hours ago",
      unread: false,
      category: "Users",
    },
  ];

  localStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(defaultNotifications));
  return defaultNotifications;
}

export function saveAdminNotifications(notifications) {
  localStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(notifications));
  return notifications;
}

export function getAdminSettings() {
  try {
    const stored = localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Unable to read admin settings", error);
  }

  const defaults = {
    emailAlerts: true,
    autoApproval: false,
    requireTwoStepReview: true,
    candidateReports: true,
    dailyDigest: true,
    weeklyAudit: false,
  };

  localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(defaults));
  return defaults;
}

export function saveAdminSettings(settings) {
  localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
  return settings;
}
