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