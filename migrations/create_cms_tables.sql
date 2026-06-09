-- CMS tables for fully dynamic website content management
USE investoreduuasa;

-- Education section list/detail content (reading-materials, members-activities, alerts)
CREATE TABLE IF NOT EXISTS education_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    content TEXT DEFAULT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_education_section (section),
    INDEX idx_education_active (is_active)
);

-- Key-value JSON store for page blocks (welcome, footer, principles, framework, etc.)
CREATE TABLE IF NOT EXISTS site_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_key VARCHAR(100) NOT NULL UNIQUE,
    content JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Benchmarking records
CREATE TABLE IF NOT EXISTS benchmarking_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    authority_name VARCHAR(255) NOT NULL,
    year VARCHAR(10) NOT NULL,
    indicator VARCHAR(255) DEFAULT NULL,
    value VARCHAR(255) DEFAULT NULL,
    data JSON DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_benchmarking_year (year),
    INDEX idx_benchmarking_authority (authority_name)
);

-- Add slug column to investment_products for URL routing
ALTER TABLE investment_products ADD COLUMN IF NOT EXISTS slug VARCHAR(255) DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_investment_products_slug ON investment_products(slug);

-- Footer stats (separate from home_stats for footer-specific counters)
CREATE TABLE IF NOT EXISTS footer_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    value VARCHAR(50) NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
