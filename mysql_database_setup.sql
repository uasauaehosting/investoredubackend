-- MySQL Database Setup for UASA Investor Education Portal
-- Run this script to create the database and all necessary tables

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS investoreduuasa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE investoreduuasa;

-- News table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content TEXT,
    link VARCHAR(500),
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Members table
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    website VARCHAR(500),
    logo VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Home Stats table
CREATE TABLE IF NOT EXISTS home_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reading_materials VARCHAR(50),
    members_activities VARCHAR(50),
    alerts_bulletins VARCHAR(50),
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('Super Admin', 'Admin', 'Editor') DEFAULT 'Admin',
    permissions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Alerts and Bulletins table
CREATE TABLE IF NOT EXISTS alerts_bulletins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type ENUM('Alert', 'Bulletin') NOT NULL,
    description TEXT,
    content TEXT,
    authority_name VARCHAR(255),
    year VARCHAR(10),
    date_published DATETIME,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    rating INT,
    category ENUM('General', 'Complaint', 'Suggestion', 'Technical Issue', 'Content Request') DEFAULT 'General',
    status ENUM('Pending', 'Reviewed', 'Resolved') DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Glossary table
CREATE TABLE IF NOT EXISTS glossary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    term VARCHAR(255) NOT NULL,
    definition TEXT NOT NULL,
    category ENUM('Basic Concepts', 'Investment Management', 'Risk Management', 'Corporate Finance', 'Market Operations', 'Regulatory Terms') DEFAULT 'Basic Concepts',
    language ENUM('English', 'Arabic', 'French') DEFAULT 'English',
    arabic_term VARCHAR(255),
    arabic_definition TEXT,
    french_term VARCHAR(255),
    french_definition TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- About Sections table
CREATE TABLE IF NOT EXISTS about_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    `order` INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Portals table
CREATE TABLE IF NOT EXISTS portals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    short_title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    link VARCHAR(500) NOT NULL,
    authority_name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_name VARCHAR(255) NOT NULL,
    general_info JSON,
    education_materials JSON,
    specific_materials JSON,
    assisting_groups JSON,
    evaluation TEXT,
    successful_programs JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Reading Materials table
CREATE TABLE IF NOT EXISTS reading_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    authority_name VARCHAR(255),
    file_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Publications table
CREATE TABLE IF NOT EXISTS publications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    authority_name VARCHAR(255) NOT NULL,
    category ENUM('Brochure', 'Code', 'General', 'Guide', 'Others', 'Report', 'Study') NOT NULL,
    file_url VARCHAR(1000),
    date_published DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Member Activities table
CREATE TABLE IF NOT EXISTS member_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100),
    status VARCHAR(50),
    authority_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Principles table
CREATE TABLE IF NOT EXISTS principles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Frameworks table
CREATE TABLE IF NOT EXISTS frameworks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Investment Products table
CREATE TABLE IF NOT EXISTS investment_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    risk_level VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Member Strategies Projects table
CREATE TABLE IF NOT EXISTS member_strategies_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    authority_name VARCHAR(255),
    status VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO admins (username, email, password, first_name, last_name, role, permissions) VALUES 
('admin', 'admin@uasa.ae', '$2a$10$K8ZpdrMwK5wYmXZ8Z5Z5Z.O5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'System', 'Administrator', 'Super Admin', '["all"]')
ON DUPLICATE KEY UPDATE username = username;

INSERT INTO home_stats (reading_materials, members_activities, alerts_bulletins) VALUES 
('1,200+', '350+', '120+')
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO programs (member_name, general_info, education_materials, specific_materials, assisting_groups, evaluation, successful_programs, is_active) VALUES 
('Jordan Securities Commission', '["Stated Goal of Investor Education Program", "Stated Institutional Support for Investor Education"]', '["Investing - Basic Materials", "Calculators / Tools"]', '["High School", "College"]', '["Single Young Adults", "Married Young Adults"]', '["How do you evaluate investor education initiatives?"]', '["Program"]', 1),
('Securities and Commodities Authority of UAE', '["What is New? (New programs, developments, policies etc.)"]', '["Investment and Understanding Risk and Rewards", "Materials Relating to Scams, Frauds, and/or Alerts to Investors"]', '["Youth (Grade School)", "Saving for College"]', '["Adults with Children", "Preparing for Retirement"]', '["How do you determine if the investor education program influences investors in their investment decisions?"]', '["Program", "Supporting Research"]', 1)
ON DUPLICATE KEY UPDATE id = id;

-- Create indexes for better performance
CREATE INDEX idx_news_is_active ON news(is_active);
CREATE INDEX idx_members_is_active ON members(is_active);
CREATE INDEX idx_alerts_bulletins_is_active ON alerts_bulletins(is_active);
CREATE INDEX idx_programs_is_active ON programs(is_active);
CREATE INDEX idx_reading_materials_is_active ON reading_materials(is_active);
CREATE INDEX idx_member_activities_is_active ON member_activities(is_active);

-- Display completion message
SELECT 'MySQL database setup completed successfully!' as message;
