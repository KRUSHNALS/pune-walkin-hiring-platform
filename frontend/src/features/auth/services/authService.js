/**
 * Development-Only Mock Authentication Service
 * 
 * Strict Role Support: Exactly THREE roles:
 * - ADMIN
 * - EMPLOYER
 * - CANDIDATE
 * 
 * Future Production Note:
 * This will be replaced by a REST client consuming Spring Boot Spring Security JWT endpoints:
 * POST /api/v1/auth/login
 * POST /api/v1/auth/register/candidate
 * POST /api/v1/auth/register/employer
 * POST /api/v1/auth/logout
 */

const STORAGE_KEYS = {
  SESSION: "punewalkin_auth_session",
  USERS: "punewalkin_auth_users",
};

export const INITIAL_DEMO_USERS = [
  {
    id: "user-admin-01",
    name: "Sahil (System Admin)",
    email: "admin@punewalkin.gov.in",
    password: "Admin@123",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2026-01-01",
  },
  {
    id: "user-emp-01",
    name: "Ritik Sawarkar",
    email: "careers@techsprint.io",
    password: "Employer@123",
    role: "EMPLOYER",
    status: "VERIFIED",
    companyName: "TechSprint Innovations Pvt. Ltd.",
    companyId: "comp-pune-01",
    designation: "Lead Technical Recruiter",
    phone: "+91 98230 45678",
    createdAt: "2026-01-15",
  },
  {
    id: "user-cand-01",
    name: "Amit Deshmukh",
    email: "candidate@example.com",
    password: "Candidate@123",
    role: "CANDIDATE",
    status: "ACTIVE",
    phone: "+91 98901 23456",
    qualification: "B.E. Computer Engineering (SPPU, 2025)",
    createdAt: "2026-02-10",
  },
];

function getUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_USERS;
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (err) {
    console.warn("Storage error saving users", err);
  }
}

export const authService = {
  /**
   * Authenticate user with credentials
   * The authenticated user's assigned role strictly determines the destination.
   */
  async login(email, password) {
    await new Promise((r) => setTimeout(r, 200));

    const cleanEmail = email.trim().toLowerCase();
    const users = getUsers();
    const matched = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (!matched) {
      throw new Error("Invalid email or password. Please verify credentials.");
    }

    if (matched.status === "SUSPENDED") {
      throw new Error("Your account has been suspended by the platform administrator. Please contact support.");
    }

    // Never return password in session object
    const { password: _, ...sessionUser } = matched;

    const sessionPayload = {
      user: sessionUser,
      token: `mock-jwt-token-${sessionUser.id}-${Date.now()}`,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };

    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionPayload));
    return sessionPayload;
  },

  /**
   * Register a new Candidate
   * Assigned role: CANDIDATE, Status: ACTIVE
   */
  async registerCandidate(data) {
    await new Promise((r) => setTimeout(r, 250));

    const cleanEmail = data.email.trim().toLowerCase();
    const users = getUsers();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error("An account with this email address already exists.");
    }

    const newUser = {
      id: `user-cand-${Date.now()}`,
      name: data.fullName.trim(),
      email: cleanEmail,
      phone: data.mobile.trim(),
      password: data.password,
      role: "CANDIDATE",
      status: "ACTIVE",
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    // Sync to admin users registry
    try {
      const rawAdmin = localStorage.getItem("punewalkin_admin_users");
      const adminUsers = rawAdmin ? JSON.parse(rawAdmin) : [];
      const updatedAdmin = [{ ...newUser, lastActive: "Today" }, ...adminUsers];
      localStorage.setItem("punewalkin_admin_users", JSON.stringify(updatedAdmin));

      // Record activity
      const rawAct = localStorage.getItem("punewalkin_employer_activities");
      const acts = rawAct ? JSON.parse(rawAct) : [];
      acts.unshift({
        id: `act-${Date.now()}`,
        timestamp: "Just now",
        type: "candidate_registered",
        title: "New Candidate Registered",
        description: `${newUser.name} created a candidate profile.`,
        entityId: newUser.id,
      });
      localStorage.setItem("punewalkin_employer_activities", JSON.stringify(acts.slice(0, 20)));
    } catch (e) {
      console.warn("Error syncing candidate registration to admin", e);
    }

    const { password: _, ...sessionUser } = newUser;
    const sessionPayload = {
      user: sessionUser,
      token: `mock-jwt-token-${sessionUser.id}-${Date.now()}`,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };

    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionPayload));
    return sessionPayload;
  },

  /**
   * Register a new Employer / Recruiter
   * Assigned role: EMPLOYER, Status: PENDING_VERIFICATION (Strictly not auto-verified)
   */
  async registerEmployer(data) {
    await new Promise((r) => setTimeout(r, 250));

    const cleanEmail = data.email.trim().toLowerCase();
    const users = getUsers();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error("An account with this corporate email address already exists.");
    }

    const newCompanyId = `comp-${Date.now()}`;
    const newUser = {
      id: `user-emp-${Date.now()}`,
      name: data.recruiterName.trim(),
      email: cleanEmail,
      phone: data.mobile.trim(),
      companyName: data.companyName.trim(),
      companyId: newCompanyId,
      website: data.website ? data.website.trim() : "",
      designation: data.designation.trim(),
      password: data.password,
      role: "EMPLOYER",
      status: "PENDING_VERIFICATION", // Strictly not auto-verified
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    // Sync to admin users and register new pending company
    try {
      const rawAdminUsers = localStorage.getItem("punewalkin_admin_users");
      const adminUsers = rawAdminUsers ? JSON.parse(rawAdminUsers) : [];
      const updatedAdmin = [{ ...newUser, lastActive: "Today" }, ...adminUsers];
      localStorage.setItem("punewalkin_admin_users", JSON.stringify(updatedAdmin));

      // Add to admin company verification queue
      const rawCompanies = localStorage.getItem("punewalkin_admin_companies");
      const adminCompanies = rawCompanies ? JSON.parse(rawCompanies) : [];
      const newCompany = {
        id: newCompanyId,
        employerId: newUser.id,
        name: data.companyName.trim(),
        employerName: newUser.name,
        email: cleanEmail,
        industry: "Information Technology",
        registrationDate: new Date().toISOString().split("T")[0],
        verificationStatus: "PENDING",
        website: newUser.website,
        contactNumber: newUser.phone,
        location: "Pune, Maharashtra",
        description: `Corporate profile for ${data.companyName.trim()} submitted by recruiter ${newUser.name}.`,
        reviewReason: "Awaiting administrator review of business credentials and KYC.",
        documents: ["Business Registration Proof", "Incorporation File"],
      };
      adminCompanies.unshift(newCompany);
      localStorage.setItem("punewalkin_admin_companies", JSON.stringify(adminCompanies));

      // Add admin notification
      const rawNotifs = localStorage.getItem("punewalkin_admin_notifications");
      const notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
      notifs.unshift({
        id: `notif-${Date.now()}`,
        title: "New Company Verification Request",
        detail: `${newCompany.name} (${newUser.name}) submitted corporate profile for verification.`,
        timestamp: "Just now",
        unread: true,
        category: "Verification",
      });
      localStorage.setItem("punewalkin_admin_notifications", JSON.stringify(notifs.slice(0, 20)));

      // Add activity
      const rawAct = localStorage.getItem("punewalkin_employer_activities");
      const acts = rawAct ? JSON.parse(rawAct) : [];
      acts.unshift({
        id: `act-${Date.now()}`,
        timestamp: "Just now",
        type: "company_registration",
        title: "Company Registered for Verification",
        description: `${newCompany.name} submitted for Admin verification.`,
        entityId: newCompanyId,
      });
      localStorage.setItem("punewalkin_employer_activities", JSON.stringify(acts.slice(0, 20)));
    } catch (e) {
      console.warn("Error registering company to admin queue", e);
    }

    const { password: _, ...safeUser } = newUser;
    return {
      user: safeUser,
      requiresVerification: true,
      message:
        "Employer account registered. Your corporate credentials have been submitted to Admin for verification.",
    };
  },

  /**
   * Retrieve current active session user
   */
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        return null;
      }
      return parsed.user || null;
    } catch {
      return null;
    }
  },

  /**
   * Clear session on logout
   */
  logout() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (err) {
      console.warn("Error removing auth session", err);
    }
  },

  /**
   * Request password reset simulation (Neutral message)
   */
  async requestPasswordReset(email) {
    await new Promise((r) => setTimeout(r, 200));
    // Neutral security response: Never reveal whether an email exists
    return {
      success: true,
      message:
        "If an account is associated with this email address, a password reset link has been dispatched.",
    };
  },
};
