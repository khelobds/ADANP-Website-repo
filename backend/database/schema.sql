-- Run this in phpMyAdmin or MySQL to create the tables

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery table for images and videos
CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type ENUM('image', 'video') NOT NULL,
    file_size INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default admin user (password: admin123)
-- Hash generated using password_hash('admin123', PASSWORD_BCRYPT)
INSERT INTO admin_user (email, password)
VALUES (
    'admin@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
) ON DUPLICATE KEY UPDATE email = email;

-- Non-members / Guest registration table
CREATE TABLE IF NOT EXISTS non_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(50),
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Non-Member Applications table (submitted by non-members to become members)
CREATE TABLE IF NOT EXISTS non_member_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    non_member_id INT,
    license_number VARCHAR(100) NOT NULL,
    proof_of_payment_path VARCHAR(500) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    age INT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (non_member_id) REFERENCES non_members(id) ON DELETE CASCADE
);

-- Verified members table
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(50),
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Failed login attempts, used by config/RateLimit.php to slow down password guessing
CREATE TABLE IF NOT EXISTS login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_login_attempts_email_ip (email, ip_address, attempted_at),
    INDEX idx_login_attempts_ip (ip_address, attempted_at)
);

-- PRC license of each member. The expiry date ends the member's 3-year CPD cycle (see config/Cpd.php)
CREATE TABLE IF NOT EXISTS member_licenses (
    member_id INT PRIMARY KEY,
    license_number VARCHAR(100),
    expiry_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- ADANP-run seminars. Creating one credits the selected attendees with approved CPD records
CREATE TABLE IF NOT EXISTS cpd_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    units DECIMAL(5,2) NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admin_user(id) ON DELETE SET NULL
);

-- CPD units per member: certificates members submit (reviewed by an admin) and ADANP seminar credits
CREATE TABLE IF NOT EXISTS cpd_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    event_id INT NULL,
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    activity_date DATE NOT NULL,
    units DECIMAL(5,2) NOT NULL,
    certificate_path VARCHAR(500) NULL,
    source ENUM('external', 'adanp') NOT NULL DEFAULT 'external',
    status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    review_note TEXT NULL,
    reviewed_by INT NULL,
    reviewed_at TIMESTAMP NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES cpd_events(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES admin_user(id) ON DELETE SET NULL,
    UNIQUE KEY uniq_cpd_event_member (event_id, member_id),
    INDEX idx_cpd_member_status (member_id, status, activity_date)
);

-- Electronic logbook: procedures a member performed, verified by an admin (see config/Logbook.php).
-- patient_code is a code the member makes up, never a patient name. There is no notes column on purpose.
CREATE TABLE IF NOT EXISTS logbook_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    procedure_date DATE NOT NULL,
    procedure_type VARCHAR(100) NOT NULL,
    treatment_area VARCHAR(100) NULL,
    patient_code VARCHAR(20) NOT NULL,
    duration_minutes SMALLINT UNSIGNED NULL,
    outcome VARCHAR(50) NOT NULL,
    status ENUM('Pending', 'Verified', 'Rejected') NOT NULL DEFAULT 'Pending',
    review_note TEXT NULL,
    reviewed_by INT NULL,
    reviewed_at TIMESTAMP NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES admin_user(id) ON DELETE SET NULL,
    INDEX idx_logbook_member (member_id, procedure_date),
    INDEX idx_logbook_status (status, submitted_at)
);

-- Member profile details edited on My Profile (see config/Profile.php). One row per member, created on first save.
-- The name and email stay in members. photo_path is a private file in storage/photos/.
-- The privacy settings are stored for the member directory, which does not exist yet.
CREATE TABLE IF NOT EXISTS member_profiles (
    member_id INT PRIMARY KEY,
    current_workplace VARCHAR(255) NULL,
    professional_bio TEXT NULL,
    photo_path VARCHAR(500) NULL,
    privacy_visibility TINYINT(1) NOT NULL DEFAULT 1,
    privacy_show_bio TINYINT(1) NOT NULL DEFAULT 1,
    privacy_show_workplace TINYINT(1) NOT NULL DEFAULT 1,
    privacy_show_email TINYINT(1) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);
