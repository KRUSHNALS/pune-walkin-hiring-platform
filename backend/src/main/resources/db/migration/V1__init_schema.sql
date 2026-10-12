-- =============================================================================
-- Pune Walk-In Drive & Hiring Management Platform
-- Database Migration: V1__init_schema.sql
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    account_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS candidate_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    phone VARCHAR(25),
    city VARCHAR(100) DEFAULT 'Pune',
    state VARCHAR(100) DEFAULT 'Maharashtra',
    address VARCHAR(255),
    headline VARCHAR(255),
    about TEXT,
    highest_qualification VARCHAR(150),
    aggregate VARCHAR(50),
    is_fresher BOOLEAN NOT NULL DEFAULT FALSE,
    experience_years DECIMAL(4, 1) DEFAULT 0.0,
    current_designation VARCHAR(150),
    previous_company VARCHAR(150),
    resume_file_name VARCHAR(255),
    resume_file_size VARCHAR(50),
    resume_file_type VARCHAR(50),
    resume_uploaded_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_candidate_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_candidate_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS candidate_education (
    id VARCHAR(36) PRIMARY KEY,
    candidate_id VARCHAR(36) NOT NULL,
    qualification VARCHAR(150) NOT NULL,
    course VARCHAR(150),
    institution VARCHAR(200) NOT NULL,
    graduation_year VARCHAR(10),
    score VARCHAR(50),
    education_type VARCHAR(50) DEFAULT 'Full-Time',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_education_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    INDEX idx_education_candidate (candidate_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS candidate_skills (
    id VARCHAR(36) PRIMARY KEY,
    candidate_id VARCHAR(36) NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    CONSTRAINT fk_skills_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    UNIQUE KEY uk_candidate_skill (candidate_id, skill_name),
    INDEX idx_skills_name (skill_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS candidate_experiences (
    id VARCHAR(36) PRIMARY KEY,
    candidate_id VARCHAR(36) NOT NULL,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    duration VARCHAR(100),
    location VARCHAR(150),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_experience_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    INDEX idx_experience_candidate (candidate_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(36) PRIMARY KEY,
    employer_user_id VARCHAR(36) NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    tagline VARCHAR(255),
    company_email VARCHAR(150) NOT NULL,
    phone VARCHAR(25),
    alternate_contact VARCHAR(25),
    industry VARCHAR(150),
    website VARCHAR(255),
    description TEXT,
    headquarters_address VARCHAR(255),
    landmark VARCHAR(150),
    city VARCHAR(100) DEFAULT 'Pune',
    state VARCHAR(100) DEFAULT 'Maharashtra',
    pincode VARCHAR(20),
    employee_size VARCHAR(50),
    founded_year INT,
    hr_contact_person VARCHAR(150),
    hr_contact_role VARCHAR(150),
    active_locations TEXT,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT,
    verified_by VARCHAR(36) NULL,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_company_employer FOREIGN KEY (employer_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_company_verification (verification_status),
    INDEX idx_company_name (company_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    created_by VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    department VARCHAR(100),
    employment_type VARCHAR(50) DEFAULT 'Full-Time',
    work_mode VARCHAR(50) DEFAULT 'On-site (Walk-In)',
    location VARCHAR(150) DEFAULT 'Pune',
    vacancies INT NOT NULL DEFAULT 1,
    min_experience DECIMAL(4, 1) DEFAULT 0.0,
    max_experience DECIMAL(4, 1) DEFAULT 0.0,
    salary_range VARCHAR(100),
    qualification VARCHAR(255),
    eligibility_criteria TEXT,
    required_skills TEXT,
    description TEXT,
    responsibilities TEXT,
    deadline DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_job_creator FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_job_status (status),
    INDEX idx_job_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS walk_in_drives (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    job_id VARCHAR(36) NOT NULL,
    created_by VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    drive_date DATE NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    registration_deadline DATE NOT NULL,
    venue_name VARCHAR(200) NOT NULL,
    venue_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) DEFAULT 'Pune',
    state VARCHAR(100) DEFAULT 'Maharashtra',
    pincode VARCHAR(20),
    vacancies INT NOT NULL DEFAULT 1,
    max_registrations INT NOT NULL DEFAULT 100,
    registered_count INT NOT NULL DEFAULT 0,
    approval_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    drive_status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    admin_feedback TEXT,
    selection_rounds TEXT,
    required_documents TEXT,
    recruiter_name VARCHAR(150),
    recruiter_email VARCHAR(150),
    recruiter_phone VARCHAR(50),
    candidate_instructions TEXT,
    submitted_at TIMESTAMP NULL,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_drive_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_drive_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT fk_drive_creator FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_drive_approval (approval_status),
    INDEX idx_drive_status (drive_status),
    INDEX idx_drive_date (drive_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(36) PRIMARY KEY,
    candidate_id VARCHAR(36) NOT NULL,
    drive_id VARCHAR(36) NOT NULL,
    job_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(36) NOT NULL,
    token_number VARCHAR(50) NOT NULL UNIQUE,
    registration_slot VARCHAR(100),
    resume_file_name VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'REGISTERED',
    reviewer_notes TEXT,
    rating DECIMAL(3, 1) DEFAULT 0.0,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_updated_by VARCHAR(36) NULL,
    CONSTRAINT fk_app_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_drive FOREIGN KEY (drive_id) REFERENCES walk_in_drives(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT uk_cand_drive_application UNIQUE (candidate_id, drive_id),
    INDEX idx_app_status (status),
    INDEX idx_app_candidate (candidate_id),
    INDEX idx_app_drive (drive_id),
    INDEX idx_app_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS application_status_history (
    id VARCHAR(36) PRIMARY KEY,
    application_id VARCHAR(36) NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(150) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_history_app (application_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS interviews (
    id VARCHAR(36) PRIMARY KEY,
    application_id VARCHAR(36) NOT NULL,
    drive_id VARCHAR(36) NOT NULL,
    candidate_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(36) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    end_at TIMESTAMP NULL,
    venue_or_location VARCHAR(255),
    interview_type VARCHAR(100) DEFAULT 'In-Person Walk-In',
    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
    instructions TEXT,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_interview_app FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_interview_drive FOREIGN KEY (drive_id) REFERENCES walk_in_drives(id) ON DELETE CASCADE,
    CONSTRAINT fk_interview_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_interview_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_interview_candidate (candidate_id),
    INDEX idx_interview_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    recipient_user_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) DEFAULT 'INFO',
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    link VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    CONSTRAINT fk_notif_user FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_recipient (recipient_user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(36) PRIMARY KEY,
    actor_user_id VARCHAR(36) NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    title VARCHAR(200),
    description TEXT,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activity_time (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
