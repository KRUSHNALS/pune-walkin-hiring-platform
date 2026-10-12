-- =============================================================================
-- Pune Walk-In Drive & Hiring Management Platform
-- Database Migration: V2__seed_demo_data.sql
-- =============================================================================

-- Seed Users
-- Passwords:
-- Admin: Admin@123
-- Employer: Employer@123
-- Candidate: Candidate@123

INSERT INTO users (id, full_name, email, password_hash, role, account_status, email_verified, created_at, updated_at)
VALUES
('user-admin-01', 'Sahil (System Admin)', 'admin@punewalkin.gov.in', '$2a$10$nbUc4jdMT2B0PlAsBzcrgOvho9anDbLkKpfgJXdvor306Fi.MjsNW', 'ADMIN', 'ACTIVE', TRUE, '2026-01-01 09:00:00', '2026-01-01 09:00:00'),
('user-emp-01', 'Ritik Sawarkar', 'careers@techsprint.io', '$2a$10$CezYOe62ZTiZJdrCN7neWu5cYVttMO0q1CnZ1gIJYGIFHCRTaF1Wa', 'EMPLOYER', 'VERIFIED', TRUE, '2026-01-15 10:30:00', '2026-01-15 10:30:00'),
('user-cand-01', 'Amit Deshmukh', 'candidate@example.com', '$2a$10$ZofM5BVLicoiPxQAwGhuweZS6LWKM6scjFlLnVmcVnlduZybnlZ76', 'CANDIDATE', 'ACTIVE', TRUE, '2026-02-10 11:00:00', '2026-02-10 11:00:00'),
('user-emp-02', 'Ananya Kulkarni', 'ananya.kulkarni@cloudcore.in', '$2a$10$CezYOe62ZTiZJdrCN7neWu5cYVttMO0q1CnZ1gIJYGIFHCRTaF1Wa', 'EMPLOYER', 'PENDING_VERIFICATION', TRUE, '2026-09-12 14:00:00', '2026-09-12 14:00:00'),
('user-cand-02', 'Pooja Shinde', 'pooja.shinde@example.com', '$2a$10$ZofM5BVLicoiPxQAwGhuweZS6LWKM6scjFlLnVmcVnlduZybnlZ76', 'CANDIDATE', 'ACTIVE', TRUE, '2026-09-15 12:00:00', '2026-09-15 12:00:00'),
('user-cand-03', 'Rohan Kulkarni', 'rohan.kulkarni@example.com', '$2a$10$ZofM5BVLicoiPxQAwGhuweZS6LWKM6scjFlLnVmcVnlduZybnlZ76', 'CANDIDATE', 'ACTIVE', TRUE, '2026-09-18 10:00:00', '2026-09-18 10:00:00'),
('user-cand-04', 'Snehal Patil', 'snehal.patil@example.com', '$2a$10$ZofM5BVLicoiPxQAwGhuweZS6LWKM6scjFlLnVmcVnlduZybnlZ76', 'CANDIDATE', 'ACTIVE', TRUE, '2026-09-20 09:30:00', '2026-09-20 09:30:00')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Companies
INSERT INTO companies (
    id, employer_user_id, company_name, tagline, company_email, phone, alternate_contact,
    industry, website, description, headquarters_address, landmark, city, state, pincode,
    employee_size, founded_year, hr_contact_person, hr_contact_role, active_locations,
    verification_status, rejection_reason, verified_by, verified_at, created_at
) VALUES
(
    'comp-pune-01', 'user-emp-01', 'TechSprint Innovations Pvt. Ltd.',
    'Accelerating Enterprise Cloud & Next-Gen Engineering in Pune',
    'careers@techsprint.io', '+91 98230 45678', '+91 20 6789 1200',
    'Information Technology & Software Services', 'https://techsprint.io',
    'TechSprint Innovations is a premier software engineering and cloud solutions provider headquartered at Magarpatta Cybercity, Pune. We partner with Fortune 500 enterprises to deliver modern web platforms, distributed cloud infrastructure, and AI-enabled business workflows.',
    'Level 6, Tower B, Cybercity Magarpatta, Hadapsar', 'Near South Gate, Opposite Destination Centre',
    'Pune', 'Maharashtra', '411028', '250 - 500 Employees', 2018,
    'Ritik Sawarkar', 'Lead Technical Recruiter',
    'Magarpatta City, Pune, Hinjawadi Phase 1, Pune, Kharadi EON, Pune',
    'VERIFIED', NULL, 'user-admin-01', '2026-01-15 12:00:00', '2026-01-15 10:30:00'
),
(
    'comp-02', 'user-emp-02', 'CloudCore Systems',
    'Next Generation Multi-Cloud Automation & Kubernetes Engineering',
    'hr@cloudcore.in', '+91 97642 88012', NULL,
    'Cloud Infrastructure & DevOps', 'https://cloudcore.in',
    'Specialists in automated cloud migrations and enterprise observability for financial services.',
    'EON IT Park, Cluster C, Kharadi', 'Near World Trade Center',
    'Pune', 'Maharashtra', '411014', '100 - 250 Employees', 2021,
    'Ananya Kulkarni', 'Director - Talent Acquisition',
    'Kharadi EON, Pune, Hinjawadi Phase 2, Pune',
    'PENDING', 'Awaiting administrative verification of company registration and CIN certificate.', NULL, NULL, '2026-09-18 14:00:00'
)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Candidate Profiles
INSERT INTO candidate_profiles (
    id, user_id, phone, city, state, address, headline, about,
    highest_qualification, aggregate, is_fresher, experience_years,
    current_designation, previous_company, resume_file_name, resume_file_size, resume_file_type, resume_uploaded_at
) VALUES
(
    'cand-101', 'user-cand-01', '+91 98901 23456', 'Pune', 'Maharashtra',
    'Flat 402, Shivajinagar Residency, FC Road, Pune - 411005',
    'Aspiring Full Stack Software Engineer | React, Java & Spring Boot',
    'Proactive computer engineering graduate from Savitribai Phule Pune University (SPPU). Built high-performance web applications using modern React and Spring Boot microservices. Seeking entry-level software engineering roles in Pune IT hubs (Hinjawadi / Magarpatta / Kharadi).',
    'B.E. Computer Engineering (SPPU Pune, 2025)', '8.4 CGPA', FALSE, 0.5,
    'Software Engineering Intern', 'Persistent Systems Pune',
    'Amit_Deshmukh_Resume_2026.pdf', '245 KB', 'application/pdf', '2026-10-08 10:00:00'
),
(
    'cand-102', 'user-cand-02', '+91 97654 32109', 'Pune (Wakad)', 'Maharashtra',
    'Wakad Main Road, Pune', 'Java Backend Engineer | Spring Boot & REST APIs',
    'Academic topper with deep understanding of Java backend architectures. Published a research paper on distributed microservices. Active problem solver on LeetCode (350+ solved).',
    'B.Tech Information Technology (PCCOE Pune, 2025)', '8.8 CGPA', TRUE, 0.0,
    'Fresher', 'None', 'Pooja_Shinde_CV.pdf', '310 KB', 'application/pdf', '2026-10-08 11:30:00'
),
(
    'cand-103', 'user-cand-03', '+91 98220 11223', 'Pune (Aundh)', 'Maharashtra',
    'Aundh, Pune', 'Junior Full Stack Engineer (React, Node, Express)',
    '1.2 years of industrial experience designing responsive web portals using modern React ecosystem and state machines.',
    'MCA (MIT World Peace University, Pune, 2024)', '7.9 CGPA', FALSE, 1.2,
    'Junior Web Developer', 'WebCraft Solutions Pune', 'Rohan_Kulkarni_FullStack.pdf', '280 KB', 'application/pdf', '2026-10-09 09:15:00'
),
(
    'cand-104', 'user-cand-04', '+91 91580 44556', 'Pune (Pimpri)', 'Maharashtra',
    'Pimpri, Pune', 'QA Automation Engineer | Selenium, TestNG, Java',
    '1.5 years experience in building data-driven test automation frameworks in Java and Selenium. Created regression pipelines on Jenkins for retail banking apps.',
    'B.E. E&TC (COEP Technological University, Pune, 2024)', '8.1 CGPA', FALSE, 1.5,
    'QA Associate', 'Capgemini Pune', 'Snehal_Patil_QA_Engineer.pdf', '295 KB', 'application/pdf', '2026-10-09 10:45:00'
)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Candidate Education
INSERT INTO candidate_education (id, candidate_id, qualification, course, institution, graduation_year, score, education_type)
VALUES
('edu-1', 'cand-101', 'Bachelor of Engineering (B.E.)', 'Computer Engineering', 'Savitribai Phule Pune University (SPPU)', '2025', '8.4 CGPA', 'Full-Time'),
('edu-2', 'cand-101', 'Higher Secondary Certificate (HSC)', 'Science (PCMB)', 'Fergusson Junior College, Pune', '2021', '88.5%', 'Full-Time'),
('edu-3', 'cand-102', 'B.Tech', 'Information Technology', 'Pimpri Chinchwad College of Engineering (PCCOE)', '2025', '8.8 CGPA', 'Full-Time')
ON DUPLICATE KEY UPDATE score = VALUES(score);

-- Seed Candidate Skills
INSERT INTO candidate_skills (id, candidate_id, skill_name) VALUES
('skill-1', 'cand-101', 'React.js'),
('skill-2', 'cand-101', 'Core Java'),
('skill-3', 'cand-101', 'Spring Boot'),
('skill-4', 'cand-101', 'MySQL'),
('skill-5', 'cand-101', 'Tailwind CSS'),
('skill-6', 'cand-101', 'REST APIs'),
('skill-7', 'cand-102', 'Core Java'),
('skill-8', 'cand-102', 'Spring Boot'),
('skill-9', 'cand-102', 'Hibernate'),
('skill-10', 'cand-102', 'Docker Basics')
ON DUPLICATE KEY UPDATE skill_name = VALUES(skill_name);

-- Seed Candidate Experiences
INSERT INTO candidate_experiences (id, candidate_id, title, company, duration, location, description) VALUES
('exp-1', 'cand-101', 'Software Engineering Intern', 'Persistent Systems Pune', 'Jan 2025 - Jun 2025 (6 months)', 'Hinjawadi Phase 1, Pune', 'Contributed to building enterprise dashboard interfaces with React.js and tested Spring Boot REST endpoints. Worked with Git and agile sprint ceremonies.')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Seed Jobs
INSERT INTO jobs (
    id, company_id, created_by, title, department, employment_type, work_mode, location,
    vacancies, min_experience, max_experience, salary_range, qualification, eligibility_criteria,
    required_skills, description, responsibilities, deadline, status, created_at, updated_at
) VALUES
(
    'job-01', 'comp-pune-01', 'user-emp-01',
    'Junior Full Stack Developer (React & Java)', 'Product Engineering',
    'Full-Time', 'On-site (Walk-In)', 'Magarpatta, Pune',
    12, 0.0, 2.0, '₹ 4,50,000 - ₹ 7,00,000 P.A.',
    'B.E. / B.Tech (CS/IT/E&TC), MCA, or B.Sc (Comp Sci)',
    'Minimum 60% or 6.5 CGPA in graduation. 2024, 2025, and 2026 batches eligible.',
    'React.js, JavaScript (ES6+), Core Java, Spring Boot, MySQL, Git',
    'Join our core product team at Magarpatta City, Pune. You will build and scale high-throughput web applications using modern React frontend and Spring Boot microservices. Fresh graduates with strong hands-on project experience are encouraged to attend.',
    'Develop responsive UI components in React and Tailwind CSS\nImplement RESTful APIs with Spring Boot and Spring Data JPA\nCollaborate with QA engineers to write unit and integration tests\nParticipate in code reviews and agile sprint rituals',
    '2026-10-25', 'ACTIVE', '2026-10-01 10:00:00', '2026-10-08 10:00:00'
),
(
    'job-02', 'comp-pune-01', 'user-emp-01',
    'QA Automation Engineer', 'Quality Engineering',
    'Full-Time', 'On-site', 'Hinjawadi Phase 1, Pune',
    8, 1.0, 3.0, '₹ 5,00,000 - ₹ 8,00,000 P.A.',
    'Any Technical Graduate (B.E./B.Tech/BCA/MCA)',
    'Hands-on experience in Selenium with Java or Cypress/Playwright with JavaScript.',
    'Selenium WebDriver, Java, TestNG, Postman, CI/CD Basics, SQL',
    'Looking for passionate automation testers for our Hinjawadi campus. You will design automation suites, execute automated regression runs, and validate REST APIs.',
    'Author modular and reusable automated test scripts\nPerform manual exploratory testing when needed\nLog defects with comprehensive logs and repro steps in Jira\nVerify API performance and payload contracts using Postman',
    '2026-10-30', 'ACTIVE', '2026-10-03 11:00:00', '2026-10-09 11:00:00'
),
(
    'job-03', 'comp-pune-01', 'user-emp-01',
    'Associate Cloud / DevOps Engineer', 'Cloud Infrastructure',
    'Full-Time', 'On-site', 'Kharadi EON IT Park, Pune',
    5, 1.0, 3.0, '₹ 6,00,000 - ₹ 9,50,000 P.A.',
    'B.E. / B.Tech in Computer Science, IT, or equivalent',
    'Practical understanding of Linux administration, Docker containerization, and AWS services.',
    'Linux, Docker, AWS (EC2, S3, RDS), Bash Scripting, GitHub Actions, Nginx',
    'Be part of our cloud operations hub in Kharadi. You will help maintain uptime, deploy containerized Spring/Node microservices, and automate deployment pipelines.',
    'Manage cloud environments and container clusters\nAutomate build and deployment pipelines with GitHub Actions\nMonitor system health and setup proactive alerts with Prometheus/Grafana\nTroubleshoot network and server configuration bottlenecks',
    '2026-11-05', 'ACTIVE', '2026-10-05 12:00:00', '2026-10-09 12:00:00'
),
(
    'job-04', 'comp-pune-01', 'user-emp-01',
    'Frontend Engineer (React & TypeScript)', 'Product Engineering',
    'Full-Time', 'On-site', 'Baner, Pune',
    6, 2.0, 4.0, '₹ 7,00,000 - ₹ 11,00,000 P.A.',
    'B.E./B.Tech/MCA',
    'Deep understanding of React state management, performance profiling, and TypeScript.',
    'React 18+, TypeScript, Tailwind CSS, Redux Toolkit / Zustand, Vite, REST APIs',
    'Craft high-performance, pixel-perfect user interfaces for our enterprise SaaS product suite in Baner.',
    'Architect reusable component design systems\nOptimize web vital metrics and bundle sizes\nIntegrate complex data grids and interactive visualization dashboards',
    '2026-11-15', 'DRAFT', '2026-10-07 14:00:00', '2026-10-07 14:00:00'
),
(
    'job-05', 'comp-pune-01', 'user-emp-01',
    'Technical Support Associate', 'Operations & Support',
    'Full-Time', 'On-site', 'Viman Nagar, Pune',
    15, 0.0, 1.0, '₹ 3,20,000 - ₹ 4,50,000 P.A.',
    'Any Graduate with excellent English communication',
    'Open to 24/7 rotational shifts. Basic understanding of software troubleshooting.',
    'Customer Communication, Troubleshooting, SQL Basics, Ticketing Tools, Documentation',
    'Provide L1/L2 technical support to enterprise customers, diagnose application logs, and resolve customer queries.',
    'Handle customer tickets and live queries within SLA\nEscalate unresolved bugs to engineering pods\nMaintain support knowledge base documentation',
    '2026-09-20', 'ARCHIVED', '2026-08-15 09:00:00', '2026-09-21 09:00:00'
)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Walk-In Drives
INSERT INTO walk_in_drives (
    id, company_id, job_id, created_by, title, description, drive_date, start_time, end_time,
    registration_deadline, venue_name, venue_address, city, state, pincode, vacancies,
    max_registrations, registered_count, approval_status, drive_status, admin_feedback,
    selection_rounds, required_documents, recruiter_name, recruiter_email, recruiter_phone,
    candidate_instructions, submitted_at, approved_at, created_at, updated_at
) VALUES
(
    'drive-01', 'comp-pune-01', 'job-01', 'user-emp-01',
    'Mega Walk-In Drive for Freshers & Junior Full Stack Engineers - Pune 2026',
    'Comprehensive on-the-spot walk-in hiring drive for entry-level developers. Direct face-to-face evaluations with our engineering leaders at Magarpatta Cybercity.',
    '2026-10-18', '09:00', '16:30', '2026-10-16',
    'TechSprint Auditorium, Tower B', 'Ground Floor Auditorium, Tower B, Cybercity Magarpatta, Hadapsar',
    'Pune', 'Maharashtra', '411028', 12, 120, 68,
    'APPROVED', 'PUBLISHED', NULL,
    '["Round 1: Online Technical Aptitude & Coding (45 mins)", "Round 2: Technical Hands-on Discussion & Machine Coding (45 mins)", "Round 3: Techno-Managerial Round (30 mins)", "Round 4: HR Interaction & Offer Discussion (20 mins)"]',
    '["Two copies of updated printed resume", "Original Government ID (Aadhaar / PAN Card / Passport) + 1 photocopy", "Graduation marks sheets / provisional certificate", "Passport size photographs (2 copies)"]',
    'Ritik Sawarkar', 'ritik.s@techsprint.io', '+91 98230 45678',
    'Please report 30 minutes before your allocated slot. Magarpatta South Gate visitor pass requires a physical government ID. Formal dress code is mandatory.',
    '2026-10-03 10:00:00', '2026-10-04 11:30:00', '2026-10-02 09:00:00', '2026-10-04 11:30:00'
),
(
    'drive-02', 'comp-pune-01', 'job-02', 'user-emp-01',
    'QA Automation & SDET Weekend Walk-In Drive - Hinjawadi',
    'Weekend walk-in drive specifically for QA professionals and automation enthusiasts in Pune West IT hub.',
    '2026-10-25', '10:00', '17:00', '2026-10-23',
    'TechSprint Delivery Centre, Hinjawadi', 'Plot 14, Phase 1, Hinjawadi Rajiv Gandhi Infotech Park',
    'Pune', 'Maharashtra', '411057', 8, 80, 34,
    'PENDING', 'DRAFT', NULL,
    '["Round 1: Automation Framework Quiz & Test Case Writing", "Round 2: Hands-on Selenium/Playwright Live Scripting", "Round 3: QA Lead & Management Fitment"]',
    '["Updated Resume", "Experience Letters / Payslips (if currently employed)", "Govt ID Proof"]',
    'Pooja Verma (HR Manager)', 'pooja.v@techsprint.io', '+91 98230 45679',
    'Bring personal laptop if available for live coding round (sample test environment will also be provided). Parking available at visitor lot P3.',
    '2026-10-07 15:00:00', NULL, '2026-10-06 14:00:00', '2026-10-07 15:00:00'
),
(
    'drive-03', 'comp-pune-01', 'job-03', 'user-emp-01',
    'Cloud & Infrastructure Operations Walk-In Drive (Kharadi EON)',
    'Walk-in recruitment drive targeting cloud and Linux systems engineers for our 24/7 reliability operations.',
    '2026-11-02', '09:30', '15:30', '2026-10-30',
    'EON Free Zone Facility', 'Cluster C, 2nd Floor, EON Free Zone, Kharadi',
    'Pune', 'Maharashtra', '411014', 5, 60, 19,
    'CHANGES_REQUESTED', 'DRAFT',
    'Admin (Sahil) Feedback: Please update venue gate instructions. EON security requires prior visitor listing. Also clarify whether AWS certification is mandatory or preferred in candidate instructions.',
    '["Round 1: Linux & Networking Diagnostic Test", "Round 2: Architecture & Troubleshooting Discussion", "Round 3: Director & Culture Round"]',
    '["Resume", "Certification copies (AWS/Linux)", "Valid Photo ID"]',
    'Ritik Sawarkar', 'ritik.s@techsprint.io', '+91 98230 45678',
    'Carry copies of certifications.',
    '2026-10-08 16:00:00', NULL, '2026-10-07 10:00:00', '2026-10-08 16:30:00'
),
(
    'drive-04', 'comp-pune-01', 'job-05', 'user-emp-01',
    'Customer Support & Technical Ops Walk-In Blitz - Pune Q3',
    'Previous quarter high-volume walk-in event conducted for graduate support engineers.',
    '2026-09-15', '09:00', '18:00', '2026-09-13',
    'Viman Nagar Training Hub', 'Sky Vista, 4th Floor, Viman Nagar',
    'Pune', 'Maharashtra', '411014', 15, 100, 95,
    'APPROVED', 'COMPLETED', NULL,
    '["Voice & Communication Evaluation", "Technical Aptitude", "HR Final"]',
    '["Resume", "Degree Certificate", "Aadhaar Card"]',
    'Ritik Sawarkar', 'ritik.s@techsprint.io', '+91 98230 45678',
    'Completed drive.',
    '2026-08-22 10:00:00', '2026-08-25 11:00:00', '2026-08-20 09:00:00', '2026-09-16 18:00:00'
)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Applications
INSERT INTO applications (
    id, candidate_id, drive_id, job_id, company_id, token_number, registration_slot,
    resume_file_name, status, reviewer_notes, rating, applied_at, updated_at
) VALUES
(
    'app-001', 'cand-101', 'drive-01', 'job-01', 'comp-pune-01',
    'TS-W26-004', '09:30 AM - Slot A', 'Amit_Deshmukh_Resume_2026.pdf',
    'SHORTLISTED', 'Strong candidate with full-stack skills. Good academic score from SPPU. Prioritize for Technical Panel 1.',
    4.5, '2026-10-08 10:14:00', '2026-10-09 11:30:00'
),
(
    'app-002', 'cand-102', 'drive-01', 'job-01', 'comp-pune-01',
    'TS-W26-012', '10:30 AM - Slot B', 'Pooja_Shinde_CV.pdf',
    'INTERVIEW_SCHEDULED', 'Exceptional Java core knowledge and LeetCode problem solving record. Scheduled for Round 1 Walk-In.',
    5.0, '2026-10-08 11:22:00', '2026-10-09 14:00:00'
),
(
    'app-003', 'cand-103', 'drive-01', 'job-01', 'comp-pune-01',
    'TS-W26-019', '11:30 AM - Slot C', 'Rohan_Kulkarni_FullStack.pdf',
    'UNDER_REVIEW', '1+ year full stack experience. Reviewing GitHub profile and project deployments.',
    4.0, '2026-10-08 13:45:00', '2026-10-09 16:15:00'
),
(
    'app-004', 'cand-104', 'drive-02', 'job-02', 'comp-pune-01',
    'TS-W26-025', '10:00 AM - Slot A', 'Snehal_Patil_QA_Engineer.pdf',
    'REGISTERED', 'Awaiting initial profile screening.',
    0.0, '2026-10-09 09:30:00', '2026-10-09 09:30:00'
)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Application Status History
INSERT INTO application_status_history (id, application_id, previous_status, new_status, changed_by, reason, created_at) VALUES
('hist-001', 'app-001', NULL, 'Registered', 'Candidate Portal (Sagar)', 'Online registration completed for Slot A', '2026-10-08 10:14:00'),
('hist-002', 'app-001', 'Registered', 'Under Review', 'Ritik Sawarkar', 'Resume screening commenced', '2026-10-08 14:20:00'),
('hist-003', 'app-001', 'Under Review', 'Shortlisted', 'Ritik Sawarkar', 'Academic criteria and skills verified (8.4 CGPA). Shortlisted for Round 1.', '2026-10-09 11:30:00'),
('hist-004', 'app-002', NULL, 'Registered', 'Candidate Portal (Sagar)', 'Online registration completed for Slot B', '2026-10-08 11:22:00'),
('hist-005', 'app-002', 'Registered', 'Interview Scheduled', 'Ritik Sawarkar', 'Interview slot confirmed for Oct 18, 10:30 AM', '2026-10-09 14:00:00')
ON DUPLICATE KEY UPDATE reason = VALUES(reason);

-- Seed Interviews
INSERT INTO interviews (
    id, application_id, drive_id, candidate_id, company_id, scheduled_at, end_at,
    venue_or_location, interview_type, status, instructions, created_by, created_at
) VALUES
(
    'int-001', 'app-002', 'drive-01', 'cand-102', 'comp-pune-01',
    '2026-10-18 10:30:00', '2026-10-18 11:30:00',
    'TechSprint Auditorium, Tower B, Cybercity Magarpatta', 'In-Person Walk-In',
    'SCHEDULED', 'Report to Reception Desk 2. Carry printed token TS-W26-012 and photo ID.',
    'user-emp-01', '2026-10-09 14:00:00'
)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed In-App Notifications
INSERT INTO notifications (id, recipient_user_id, title, message, notification_type, resource_type, resource_id, link, is_read, created_at) VALUES
('notif-01', 'user-cand-01', 'Application Shortlisted!', 'Congratulations! TechSprint Innovations has shortlisted your profile for the Junior Full Stack Developer drive.', 'shortlist', 'APPLICATION', 'app-001', '/candidate/applications/app-001', FALSE, '2026-10-09 11:30:00'),
('notif-02', 'user-cand-01', 'Walk-In Drive Confirmed', 'Your registration for Mega Walk-In Drive for Freshers & Junior Full Stack Engineers is confirmed. Token TS-W26-004.', 'drive', 'APPLICATION', 'app-001', '/candidate/applications/app-001', FALSE, '2026-10-08 10:14:00'),
('notif-03', 'user-admin-01', 'New Drive Submitted for Approval', 'TechSprint Innovations submitted drive: QA Automation & SDET Weekend Walk-In Drive - Hinjawadi.', 'drive_submitted', 'DRIVE', 'drive-02', '/admin/drive-approvals', FALSE, '2026-10-07 15:00:00'),
('notif-04', 'user-admin-01', 'New Company Verification Request', 'CloudCore Systems submitted corporate profile for verification.', 'company_verification', 'COMPANY', 'comp-02', '/admin/companies', FALSE, '2026-09-18 14:00:00')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Seed Activity Logs
INSERT INTO activity_logs (id, actor_user_id, action, entity_type, entity_id, title, description, previous_status, new_status, created_at) VALUES
('act-001', 'user-emp-01', 'DRIVE_SUBMITTED', 'DRIVE', 'drive-02', 'Walk-In Drive Submitted', 'TechSprint submitted QA Automation Drive for approval.', 'DRAFT', 'PENDING', '2026-10-07 15:00:00'),
('act-002', 'user-admin-01', 'DRIVE_APPROVED', 'DRIVE', 'drive-01', 'Walk-In Drive Approved', 'Admin approved Mega Walk-In Drive for Freshers.', 'PENDING', 'APPROVED', '2026-10-04 11:30:00'),
('act-003', 'user-admin-01', 'COMPANY_VERIFIED', 'COMPANY', 'comp-pune-01', 'Company Profile Verified', 'Admin verified TechSprint Innovations corporate profile.', 'PENDING', 'VERIFIED', '2026-01-15 12:00:00')
ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP;
