# Pune Walk-In Drive & Hiring Management Platform
## Candidate Module Developer Documentation

**Module Owner:** Sagar (Lead Candidate Experience & Frontend Architect)  
**Assigned Responsibility:** Candidate Dashboard, Profile Management, Education & Technical Skills, Resume Lifecycle, Walk-In Drive Discovery, Drive Details, Slot Registration & Entry Token Generation, Application Tracking & Timelines, Interview Schedules, In-App Notification Center, and Candidate Settings.  
**Tech Stack:** React 19, Vite, Tailwind CSS v4, React Router DOM v7 (Frontend-Only Architecture, LocalStorage Mock Persistence Layer, Zero Server Secrets).

---

## 1. Module Overview & Platform Workflow

The **Candidate Module** delivers a specialized, responsive, and unified career portal for students, freshers, and experienced job seekers targeting Pune's premier IT corridors (Hinjawadi, Magarpatta Cybercity, Kharadi EON, Baner, and Viman Nagar).

### End-to-End Candidate Experience Flow
$$\text{Candidate Sign-In} \longrightarrow \text{Personalized Dashboard} \longrightarrow \text{Profile \& Resume Readiness} \longrightarrow \text{Walk-In Drive Discovery} \longrightarrow \text{Slot Reservation (Token Generated)} \longrightarrow \text{Official Walk-In Pass Issued} \longrightarrow \text{Status Timeline Audit (Screening / Shortlisting)} \longrightarrow \text{Interview Attendance}$$

---

## 2. Team Division & Shared Integration Touchpoints

| Module Owner | Assigned Domain | Integration Contract with Sagar's Candidate Module |
|---|---|---|
| **Sagar** | **Candidate Experience** | Manages Candidate Dashboard, Profile, Skills, Resume, Drive Discovery, Registration Flow, Application Tracking, Interviews, Notifications, and Settings. |
| **Ritik** | **Employer & Recruitment** | Creates walk-in drives (`approvalStatus === 'Approved'`). Receives candidate registrations in real-time (`/employer/applications` & `/employer/drives/:driveId/candidates`). Updates candidate statuses (`Under Review`, `Shortlisted`, `Interview Scheduled`, `Selected`, `Rejected`, `On Hold`). Candidate views recruiter feedback directly in their application timeline. |
| **Krushna** | **System Admin & Moderation** | Approves draft drives submitted by Ritik. Coordinates interview queues when candidates transition to `Interview Scheduled`. |

---

## 3. Candidate Route Map & Authorization

All candidate routes are nested under `CandidateLayout` and strictly guarded by `<ProtectedRoute>` and `<RequireRole allowedRoles={["CANDIDATE"]}>`:

| Route | Page Component | Description |
|---|---|---|
| `/candidate/dashboard` | `CandidateDashboardPage` | Personalized greeting, profile completion meter, application metrics, recommended walk-in drives, and upcoming interview cards. |
| `/candidate/profile` | `CandidateProfilePage` | Full candidate profile overview: contact details, education history, technical skills chips, experience, and resume attachment. |
| `/candidate/profile/edit` | `CandidateProfileEditPage` | Validated profile editor: education record builder, interactive skill tags manager, fresher toggle, and internship/job experience history. |
| `/candidate/resume` | `CandidateResumePage` | Safe frontend prototype for resume management: file picker with PDF/DOC/DOCX extension checks, size validation (max 5MB), and replacement/removal. |
| `/candidate/drives` | `CandidateDrivesPage` | Searchable, filterable walk-in drive catalogue with Pune cluster filter (Hinjawadi, Magarpatta, Kharadi, Baner), date filter, and quick registration action. |
| `/candidate/drives/:driveId` | `CandidateDriveDetailsPage` | Complete drive specifications, Pune campus venue address & gate instructions, selection rounds breakdown, required documents checklist, and slot booking. |
| `/candidate/applications` | `CandidateApplicationsPage` | Application tracking table with search, status filtering (`Registered`, `Under Review`, `Shortlisted`, `Interview Scheduled`, `Selected`, `On Hold`, `Rejected`), and token badges. |
| `/candidate/applications/:applicationId` | `CandidateApplicationDetailsPage` | Official printable **Walk-In Entry Ticket / Token Pass** with simulated barcode, timestamped status audit trail with recruiter notes, and venue reporting guidelines. |
| `/candidate/interviews` | `CandidateInterviewsPage` | Schedule breakdown of confirmed interview slots, reporting windows, campus directions, and selection rounds. |
| `/candidate/notifications` | `CandidateNotificationsPage` | In-app notification feed with read/unread indicators, mark all as read action, and direct navigation links to application passes. |
| `/candidate/settings` | `CandidateSettingsPage` | Account information overview, recruitment notification preference toggles, Pune recruiter visibility options, and safe logout action. |

---

## 4. Feature Highlights by Implementation Phase

### Phase 1: Candidate Dashboard
- **Welcome Card:** Candidate's full name, greeting, and reactive **Profile Completion Bar** that updates dynamically based on filled fields.
- **Dynamic Application Statistics:** Six metrics calculated from shared mock storage (`punewalkin_employer_applications`): Total Applied, Registered, Under Review, Shortlisted, Interviews Scheduled, and Selected.
- **Recommended Walk-In Drives:** Displays only approved and published drives with company name, job role, date, Pune venue, vacancies count, and registration shortcuts.
- **Upcoming Interviews:** Scoped to confirmed applications with reporting slots and token number badges.
- **Recent Activity:** Real-time stream of status updates, shortlisting notices, and registration confirmations.

### Phase 2: Candidate Profile & Editor
- **Personal Details:** Full name, email, phone, city, state, address, headline, and bio/objective.
- **Education Manager:** Add, edit, and remove education records with qualification, branch, college name, graduation batch year, and CGPA/percentage.
- **Interactive Skills System:** Add skills with Enter key or click from popular Pune tech tags (`React.js`, `Core Java`, `Spring Boot`, `MySQL`, `Selenium`, `Docker`, `Git`). Prevents duplicate skill additions.
- **Experience & Fresher Toggle:** One-click Fresher toggle for 2024-2026 graduates; optional support for internships and work history records.

### Phase 3: Resume Management
- Prototype file dropzone and selector.
- Validates supported extensions (`.pdf`, `.doc`, `.docx`) and file size limits (5MB).
- Clearly labeled as an honest frontend prototype operating in local storage metadata mode.
- Avoids large base64 strings in localStorage to preserve browser performance.

### Phase 4 & 5: Walk-In Drive Discovery & Details
- Scoped to approved drives (`approvalStatus === 'Approved'` and `driveStatus !== 'Draft'`).
- Multi-facet filters: Search keyword, Pune location cluster (Magarpatta, Hinjawadi, Kharadi, Baner, Viman Nagar), date timeframe, and sorting.
- Comprehensive Drive Details page presenting selection rounds (Aptitude, Hands-on Coding, Managerial, HR), campus gate instructions, and required document checklists.

### Phase 6: Slot Reservation & Token Pass Generation
- `RegistrationModal` provides:
  - Time slot selection (Morning Batch, Mid-Day Batch, Afternoon Batch).
  - Profile completeness prompt if < 75%.
  - Mandatory declarations (eligibility confirmation, document agreement).
- On confirmation, generates a unique token pass (e.g., `TS-W26-004`) and registers an application in shared storage.
- Automatically increments `registeredCount` on the drive and emits an in-app notification.
- Prevents duplicate applications for the same candidate and drive.

### Phase 7 & 8: My Applications & My Interviews
- Complete tracking with status badges matching Ritik's recruitment pipeline.
- Printable `TokenPassCard` simulating an official Pune Walk-In Hall Ticket with barcode, token number, candidate credentials, venue directions, and print shortcut.
- Detailed audit history with recruiter feedback notes (read-only for candidates).
- Dedicated interview schedule view separated into Upcoming and Concluded tabs.

### Phase 9 & 10: Notifications & Settings
- In-app notification center with read/unread tracking and unread counter badge in the header.
- Account settings with notification toggles and recruiter visibility preferences.

---

## 5. Shared Mock Data Schema & Contracts

### Candidate Application Schema (`punewalkin_employer_applications`)
```javascript
{
  id: "app-001",
  employerId: "emp-ritik-01",
  candidateId: "cand-101",
  candidateName: "Amit Deshmukh",
  email: "candidate@example.com",
  phone: "+91 98901 23456",
  city: "Pune",
  qualification: "B.E. Computer Engineering (SPPU, 2025)",
  skills: ["React.js", "Core Java", "Spring Boot", "MySQL"],
  experienceYears: 0.5,
  driveId: "drive-01",
  driveTitle: "Mega Walk-In Drive for Freshers & Junior Full Stack Engineers - Pune 2026",
  jobId: "job-01",
  jobTitle: "Junior Full Stack Developer (React & Java)",
  registrationDate: "2026-10-08",
  registrationSlot: "09:30 AM - Slot A",
  tokenNumber: "TS-W26-004",
  resumeFileName: "Amit_Deshmukh_Resume_2026.pdf",
  status: "Shortlisted", // Registered | Under Review | Shortlisted | Interview Scheduled | Selected | Rejected | On Hold
  statusHistory: [
    {
      status: "Registered",
      date: "2026-10-08 10:14",
      updatedBy: "Candidate Portal (Sagar)",
      note: "Online registration completed for Slot A"
    },
    {
      status: "Shortlisted",
      date: "2026-10-09 11:30",
      updatedBy: "Ritik Sawarkar (Employer)",
      note: "Academic criteria and skills verified (8.4 CGPA). Shortlisted for Round 1."
    }
  ],
  reviewerNotes: "Strong candidate with full-stack skills. Good academic score from SPPU.",
  rating: 4.5
}
```

---

## 6. How to Test Locally

1. Start the Vite development server:
   ```bash
   cd frontend
   npm run dev
   ```
2. Navigate to `http://localhost:5173/login`.
3. Click the **Candidate** quick demo credential button:
   - **Email:** `candidate@example.com`
   - **Password:** `Candidate@123`
4. Click **Sign In** to access the Candidate Dashboard (`/candidate/dashboard`).
5. Explore the Candidate Portal navigation across Profile, Resume, Walk-In Drives, Applications, Interviews, Notifications, and Settings.
