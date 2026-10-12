/**
 * Standardized Domain Statuses & Enums
 * Pune Walk-In Drive & Hiring Management Platform
 * 
 * Provides canonical status representations and safe normalization across all 3 modules:
 * - Admin Module (Krushna)
 * - Employer Module (Ritik)
 * - Candidate Module (Sagar)
 */

export const COMPANY_STATUS = {
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
};

export const DRIVE_APPROVAL_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
  REJECTED: "REJECTED",
  DRAFT: "DRAFT",
};

export const APPLICATION_STATUS = {
  REGISTERED: "Registered",
  UNDER_REVIEW: "Under Review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  SELECTED: "Selected",
  ON_HOLD: "On Hold",
  REJECTED: "Rejected",
};

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  VERIFIED: "VERIFIED",
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
};

/**
 * Normalizes company verification status to canonical uppercase enum
 */
export function normalizeCompanyStatus(status) {
  if (!status) return COMPANY_STATUS.PENDING;
  const s = String(status).trim().toUpperCase();
  if (s === "VERIFIED") return COMPANY_STATUS.VERIFIED;
  if (s === "REJECTED") return COMPANY_STATUS.REJECTED;
  return COMPANY_STATUS.PENDING;
}

/**
 * Returns human-readable label for company verification status
 */
export function formatCompanyStatus(status) {
  const norm = normalizeCompanyStatus(status);
  switch (norm) {
    case COMPANY_STATUS.VERIFIED:
      return "Verified";
    case COMPANY_STATUS.REJECTED:
      return "Rejected";
    case COMPANY_STATUS.PENDING:
    default:
      return "Pending Verification";
  }
}

/**
 * Normalizes drive approval status to canonical uppercase enum
 */
export function normalizeApprovalStatus(status) {
  if (!status) return DRIVE_APPROVAL_STATUS.PENDING;
  const s = String(status).trim().toUpperCase().replace(/\s+/g, "_");
  if (s === "APPROVED") return DRIVE_APPROVAL_STATUS.APPROVED;
  if (s === "REJECTED") return DRIVE_APPROVAL_STATUS.REJECTED;
  if (s === "CHANGES_REQUESTED") return DRIVE_APPROVAL_STATUS.CHANGES_REQUESTED;
  if (s === "DRAFT") return DRIVE_APPROVAL_STATUS.DRAFT;
  return DRIVE_APPROVAL_STATUS.PENDING;
}

/**
 * Formats drive approval status for display
 */
export function formatApprovalStatus(status) {
  const norm = normalizeApprovalStatus(status);
  switch (norm) {
    case DRIVE_APPROVAL_STATUS.APPROVED:
      return "Approved";
    case DRIVE_APPROVAL_STATUS.REJECTED:
      return "Rejected";
    case DRIVE_APPROVAL_STATUS.CHANGES_REQUESTED:
      return "Changes Requested";
    case DRIVE_APPROVAL_STATUS.DRAFT:
      return "Draft";
    case DRIVE_APPROVAL_STATUS.PENDING:
    default:
      return "Pending Approval";
  }
}

/**
 * Normalizes application status to canonical Title Case string
 */
export function normalizeApplicationStatus(status) {
  if (!status) return APPLICATION_STATUS.REGISTERED;
  const clean = String(status).trim().toUpperCase().replace(/[\s_-]+/g, "");
  if (clean === "REGISTERED") return APPLICATION_STATUS.REGISTERED;
  if (clean === "UNDERREVIEW") return APPLICATION_STATUS.UNDER_REVIEW;
  if (clean === "SHORTLISTED") return APPLICATION_STATUS.SHORTLISTED;
  if (clean === "INTERVIEWSCHEDULED") return APPLICATION_STATUS.INTERVIEW_SCHEDULED;
  if (clean === "SELECTED") return APPLICATION_STATUS.SELECTED;
  if (clean === "ONHOLD") return APPLICATION_STATUS.ON_HOLD;
  if (clean === "REJECTED") return APPLICATION_STATUS.REJECTED;
  return status;
}
