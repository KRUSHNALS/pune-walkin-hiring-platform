import { storageService } from "../../../services/storageService.js";
import { INITIAL_DEMO_USERS } from "../../auth/services/authService.js";

const ADMIN_USERS_KEY = "punewalkin_admin_users";
const AUTH_USERS_KEY = "punewalkin_auth_users";
const ADMIN_NOTIFICATIONS_KEY = "punewalkin_admin_notifications";
const ADMIN_SETTINGS_KEY = "punewalkin_admin_settings";

/**
 * Get companies for Admin portal from shared storage service
 */
export function getAdminCompanies() {
  return storageService.getCompanies();
}

/**
 * Save companies from Admin portal
 */
export function saveAdminCompanies(companies) {
  return storageService.saveCompanies(companies);
}

/**
 * Get unified list of all users across auth and admin registries
 */
export function getAdminUsers() {
  let storedUsers = [];
  try {
    const stored = localStorage.getItem(ADMIN_USERS_KEY);
    if (stored) {
      storedUsers = JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Unable to read admin users", error);
  }

  // Also read newly registered users from authService
  let authUsers = [];
  try {
    const rawAuth = localStorage.getItem(AUTH_USERS_KEY);
    if (rawAuth) {
      authUsers = JSON.parse(rawAuth);
    }
  } catch (error) {
    console.warn("Unable to read auth users", error);
  }

  // If both empty, seed default users
  if (storedUsers.length === 0 && authUsers.length === 0) {
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

    try {
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(defaultUsers));
    } catch (e) {
      console.warn("Storage error saving admin users", e);
    }

    return defaultUsers;
  }

  // Merge auth users into stored users by ID/email to ensure newly registered users show up
  const mergedMap = new Map();
  storedUsers.forEach((u) => mergedMap.set(u.id || u.email, u));
  authUsers
    .filter((u) => u.role !== "ADMIN")
    .forEach((u) => {
      const key = u.id || u.email;
      if (!mergedMap.has(key)) {
        mergedMap.set(key, {
          ...u,
          lastActive: "Today",
        });
      } else {
        // sync status if modified
        const existing = mergedMap.get(key);
        mergedMap.set(key, {
          ...existing,
          status: existing.status || u.status || "ACTIVE",
        });
      }
    });

  const merged = Array.from(mergedMap.values());
  return merged;
}

/**
 * Save admin users and propagate account status changes to auth storage
 */
export function saveAdminUsers(users) {
  try {
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));

    // Propagate status updates (e.g. SUSPENDED / ACTIVE) to auth service users
    const rawAuth = localStorage.getItem(AUTH_USERS_KEY);
    if (rawAuth) {
      const authUsers = JSON.parse(rawAuth);
      const updatedAuth = authUsers.map((authUser) => {
        const match = users.find(
          (u) => u.id === authUser.id || u.email?.toLowerCase() === authUser.email?.toLowerCase()
        );
        if (match && match.status) {
          return { ...authUser, status: match.status };
        }
        return authUser;
      });
      localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(updatedAuth));
    }
  } catch (err) {
    console.warn("Storage error saving users", err);
  }
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
      detail: "TechSprint Innovations submitted Hinjawadi Walk-In Drive for review.",
      timestamp: "8 mins ago",
      unread: true,
      category: "Approval",
    },
    {
      id: "notif-02",
      title: "Company verification request",
      detail: "CloudCore Systems submitted documents for verification.",
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
      detail: "New candidate registered for Pune West drive.",
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

export function addAdminNotification(notif) {
  const list = getAdminNotifications();
  const newNotif = {
    id: `notif-${Date.now()}`,
    timestamp: "Just now",
    unread: true,
    ...notif,
  };
  const updated = [newNotif, ...list];
  saveAdminNotifications(updated);
  return updated;
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
