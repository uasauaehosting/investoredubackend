-- Create Publications Table
CREATE TABLE IF NOT EXISTS publications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    authority_name VARCHAR(255) NOT NULL,
    category ENUM('Brochure', 'Code', 'General', 'Guide', 'Others', 'Report', 'Study') NOT NULL,
    file_url VARCHAR(1000),
    date_published DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_authority (authority_name),
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    INDEX idx_date_published (date_published)
);

INSERT INTO publications (title, description, authority_name, category, file_url, date_published) VALUES
('Investor Awareness Brochure', 'A brochure introducing capital market basics for retail investors.', 'Jordan Securities Commission', 'Brochure', '#', '2024-03-10'),
('Corporate Governance Code', 'Code of corporate governance for listed companies.', 'Saudi Capital Market Authority', 'Code', '#', '2024-02-18'),
('General Investor Education Materials', 'General educational resources for new investors.', 'Qatar Financial Markets Authority', 'General', '#', '2024-01-22'),
('Guide to Mutual Funds', 'A practical guide to understanding mutual fund investments.', 'Kuwait Capital Markets Authority', 'Guide', '#', '2023-12-05'),
('Annual Market Development Report', 'Annual report on market development and investor protection.', 'Financial Regulatory Authority - Egypt', 'Report', '#', '2023-11-30'),
('Financial Literacy Study', 'Regional study on financial literacy levels among retail investors.', 'Capital Market Authority', 'Study', '#', '2023-10-15'),
('Investor Protection Handbook', 'Handbook covering investor rights and complaint procedures.', 'Palestine Capital Market Authority', 'Others', '#', '2023-09-08');
