-- Create Global Policy Areas Table
CREATE TABLE IF NOT EXISTS global_policy_areas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    institution VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    file_url VARCHAR(1000),
    date_published DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_institution (institution),
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    INDEX idx_date_published (date_published)
);

INSERT INTO global_policy_areas (title, description, institution, category, file_url, date_published) VALUES
('SME Finance Access and Growth Strategy', 'Strategic approach to improving SME access to financial services.', 'OECD', 'SME Finance', 'https://www.oecd.org/sme-finance', '2023-11-15'),
('Consumer Protection Guidelines for Digital Banking', 'Guidelines to protect consumers in digital banking environments.', 'Alliance For Financial Inclusion', 'Consumer Empowerment and Market Conduct', 'https://www.afi.org/digital-banking', '2023-10-20'),
('Financial Inclusion Measurement Index', 'Standardized methodology for measuring financial inclusion.', 'Alliance For Financial Inclusion', 'Measuring Financial Inclusion', 'https://www.afi.org/inclusion-index', '2022-09-10'),
('Emerging Technologies in Financial Services', 'Analysis of emerging technologies and their impact on financial inclusion.', 'OECD', 'Digital Financial Services', 'https://www.oecd.org/fintech-report', '2022-08-15'),
('Market Integrity and Stability Framework', 'Framework for maintaining market integrity while promoting financial inclusion.', 'Alliance For Financial Inclusion', 'Integrity and Stability', 'https://www.afi.org/market-integrity', '2022-07-20'),
('National Financial Inclusion Strategy Toolkit', 'Practical toolkit for developing and implementing national financial inclusion strategies.', 'Alliance For Financial Inclusion', 'Financial Inclusion Strategy', 'https://www.afi.org/strategy-toolkit', '2022-05-12'),
('G20 High-Level Principles for Digital Financial Inclusion', 'High-level principles to guide policy makers on digital financial inclusion.', 'OECD', 'Digital Financial Services', 'https://www.oecd.org/digital-inclusion', '2021-11-08'),
('Emerging Policy Areas in Inclusive Finance', 'Overview of emerging policy areas shaping inclusive finance agendas.', 'Alliance For Financial Inclusion', 'Emerging Financial Inclusion Areas', 'https://www.afi.org/emerging-areas', '2021-09-30'),
('Global Financial Inclusion Report', 'Annual report on global financial inclusion trends and policy developments.', 'OECD', 'Report', 'https://www.oecd.org/financial-inclusion-report', '2021-06-18'),
('Regional Policy Coordination on Consumer Protection', 'Regional coordination framework for consumer protection in financial services.', 'Others', 'Consumer Empowerment and Market Conduct', '#', '2020-12-01');
