-- Placement Management Portal Database Schema
-- Designed for optimal performance and scalability

-- Create database
CREATE DATABASE IF NOT EXISTS placement_portal;
USE placement_portal;

-- Users table for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'hod', 'tpo') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Student profiles
CREATE TABLE student_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    batch_year INT NOT NULL,
    cgpa DECIMAL(3,2),
    phone VARCHAR(15),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    profile_image VARCHAR(255),
    resume_file VARCHAR(255),
    skills TEXT, -- JSON array of skills
    experience TEXT, -- JSON array of experience
    education TEXT, -- JSON array of education records
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    INDEX idx_student_id (student_id),
    INDEX idx_department (department_id),
    INDEX idx_batch (batch_year)
);

-- Departments
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    hod_user_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hod_user_id) REFERENCES users(id),
    INDEX idx_code (code)
);

-- HOD profiles
CREATE TABLE hod_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    phone VARCHAR(15),
    qualification VARCHAR(200),
    experience_years INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    INDEX idx_employee_id (employee_id),
    INDEX idx_department (department_id)
);

-- Companies
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    description TEXT,
    contact_person VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(15),
    address TEXT,
    logo VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_industry (industry)
);

-- Placement drives
CREATE TABLE placement_drives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    job_description TEXT,
    job_role VARCHAR(100) NOT NULL,
    eligibility_criteria TEXT,
    required_skills TEXT, -- JSON array
    package_offered DECIMAL(10,2),
    location VARCHAR(100),
    drive_date DATE,
    application_deadline DATE,
    status ENUM('draft', 'active', 'closed', 'cancelled') DEFAULT 'draft',
    max_applicants INT,
    min_cgpa DECIMAL(3,2),
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_company (company_id),
    INDEX idx_drive_date (drive_date),
    INDEX idx_status (status)
);

-- Recruitment rounds
CREATE TABLE recruitment_rounds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    drive_id INT NOT NULL,
    round_name VARCHAR(100) NOT NULL,
    round_type ENUM('screening', 'written', 'technical', 'hr', 'final') NOT NULL,
    description TEXT,
    duration_minutes INT,
    max_marks DECIMAL(5,2),
    is_elimination BOOLEAN DEFAULT TRUE,
    scheduled_date TIMESTAMP,
    venue VARCHAR(200),
    instructions TEXT,
    order_sequence INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drive_id) REFERENCES placement_drives(id) ON DELETE CASCADE,
    INDEX idx_drive (drive_id),
    INDEX idx_round_type (round_type)
);

-- Student applications
CREATE TABLE student_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    drive_id INT NOT NULL,
    application_status ENUM('applied', 'under_review', 'shortlisted', 'rejected', 'selected', 'offer_sent', 'offer_accepted') DEFAULT 'applied',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    notes TEXT,
    ai_score DECIMAL(5,2), -- AI-generated match score
    resume_extracted_data TEXT, -- JSON data from AI resume parsing
    FOREIGN KEY (student_id) REFERENCES student_profiles(id),
    FOREIGN KEY (drive_id) REFERENCES placement_drives(id),
    UNIQUE KEY unique_application (student_id, drive_id),
    INDEX idx_student (student_id),
    INDEX idx_drive (drive_id),
    INDEX idx_status (application_status)
);

-- Round results
CREATE TABLE round_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    round_id INT NOT NULL,
    student_id INT NOT NULL,
    status ENUM('pending', 'passed', 'failed', 'absent') DEFAULT 'pending',
    marks_obtained DECIMAL(5,2),
    feedback TEXT,
    evaluated_by INT,
    evaluated_at TIMESTAMP NULL,
    next_round_eligible BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES student_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (round_id) REFERENCES recruitment_rounds(id),
    FOREIGN KEY (student_id) REFERENCES student_profiles(id),
    FOREIGN KEY (evaluated_by) REFERENCES users(id),
    INDEX idx_application (application_id),
    INDEX idx_round (round_id),
    INDEX idx_student (student_id)
);

-- Offer letters
CREATE TABLE offer_letters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    student_id INT NOT NULL,
    company_id INT NOT NULL,
    offer_letter_file VARCHAR(255),
    salary_package DECIMAL(10,2) NOT NULL,
    position_title VARCHAR(100) NOT NULL,
    start_date DATE,
    offer_status ENUM('sent', 'accepted', 'rejected', 'withdrawn') DEFAULT 'sent',
    sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_date TIMESTAMP NULL,
    additional_terms TEXT,
    FOREIGN KEY (application_id) REFERENCES student_applications(id),
    FOREIGN KEY (student_id) REFERENCES student_profiles(id),
    FOREIGN KEY (company_id) REFERENCES companies(id),
    INDEX idx_application (application_id),
    INDEX idx_student (student_id),
    INDEX idx_company (company_id),
    INDEX idx_status (offer_status)
);

-- Email templates
CREATE TABLE email_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    template_type ENUM('application_received', 'round_scheduled', 'result_announced', 'offer_sent', 'offer_accepted', 'rejection') NOT NULL,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_template_type (template_type)
);

-- Email logs
CREATE TABLE email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('sent', 'failed', 'bounced') DEFAULT 'sent',
    template_id INT,
    recipient_user_id INT,
    FOREIGN KEY (template_id) REFERENCES email_templates(id),
    FOREIGN KEY (recipient_user_id) REFERENCES users(id),
    INDEX idx_recipient (recipient_email),
    INDEX idx_sent_at (sent_at)
);

-- System settings
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setting_key (setting_key)
);

-- Insert default data
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('max_file_upload_size', '5242880', 'Maximum file upload size in bytes (5MB)'),
('allowed_file_types', '["pdf", "doc", "docx"]', 'Allowed file extensions for resume upload'),
('default_page_size', '10', 'Default pagination size for listings'),
('ai_api_key', '', 'OpenAI API key for AI features'),
('smtp_host', 'smtp.gmail.com', 'SMTP server host'),
('smtp_port', '587', 'SMTP server port'),
('smtp_username', '', 'SMTP username'),
('smtp_password', '', 'SMTP password');

-- Insert default email templates
INSERT INTO email_templates (template_name, subject, content, template_type, is_ai_generated) VALUES
('Application Received', 'Application Received - {{company_name}} - {{position}}', 
'Dear {{student_name}},\n\nThank you for applying for the position of {{position}} at {{company_name}}.\n\nYour application has been received and is under review. We will contact you with further updates soon.\n\nBest regards,\nTPO Office', 
'application_received', FALSE),

('Selection Results', 'Selection Results - {{company_name}} - {{drive_title}}', 
'Dear {{student_name}},\n\nWe are pleased to inform you that you have {{result}} the {{round_name}} for {{position}} at {{company_name}}.\n\n{{result_message}}\n\nBest regards,\nTPO Office', 
'result_announced', FALSE),

('Offer Letter', 'Offer Letter - {{company_name}} - {{position}}', 
'Dear {{student_name}},\n\nCongratulations! We are delighted to offer you the position of {{position}} at {{company_name}}.\n\nPlease find the attached offer letter with detailed terms and conditions.\n\nLooking forward to working with you.\n\nBest regards,\n{{company_name}} HR Team', 
'offer_sent', FALSE);

-- Insert sample departments
INSERT INTO departments (name, code, description) VALUES
('Computer Science Engineering', 'CSE', 'Computer Science and Engineering Department'),
('Electronics and Communication Engineering', 'ECE', 'Electronics and Communication Engineering Department'),
('Mechanical Engineering', 'ME', 'Mechanical Engineering Department'),
('Civil Engineering', 'CE', 'Civil Engineering Department'),
('Information Technology', 'IT', 'Information Technology Department'),
('Electrical Engineering', 'EE', 'Electrical Engineering Department');

COMMIT;