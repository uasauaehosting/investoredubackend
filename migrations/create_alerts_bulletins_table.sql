-- Create Alerts & Bulletins Table
CREATE TABLE IF NOT EXISTS alerts_bulletins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    type ENUM('Alert', 'Bulletin') NOT NULL,
    description TEXT,
    content LONGTEXT,
    authority_name VARCHAR(255) NOT NULL,
    year VARCHAR(10),
    date_published DATE,
    link VARCHAR(1000),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_authority (authority_name),
    INDEX idx_year (year),
    INDEX idx_active (is_active),
    INDEX idx_display_order (display_order)
);

-- Insert sample data
INSERT INTO alerts_bulletins (title, type, description, content, authority_name, year, date_published, link, display_order) VALUES
('New Investment Guidelines for Retail Investors', 'Alert', 'Updated guidelines for retail investment protection and risk disclosure requirements.', '<p>Comprehensive guidelines for retail investment protection and risk disclosure requirements have been updated to enhance investor safety and market transparency.</p><p>Key changes include enhanced disclosure requirements for investment products and improved risk assessment protocols.</p>', 'Saudi Capital Market Authority', '2024', '2024-01-15', 'https://www.cma.gov.sa/new-guidelines', 1),
('Market Alert: Increased Volatility in Technology Stocks', 'Alert', 'Warning about increased volatility in technology sector investments.', '<p>Investors are advised to exercise caution when investing in technology stocks due to recent market volatility.</p><p>Market analysis shows significant price fluctuations in technology sector securities.</p>', 'Qatar Financial Markets Authority', '2024', '2024-01-10', 'https://www.qfma.org.qa/market-alert', 2),
('Regulatory Changes for Cryptocurrency Trading', 'Bulletin', 'New regulatory framework for cryptocurrency trading platforms.', '<p>A comprehensive regulatory framework has been established for cryptocurrency trading platforms operating in the region.</p><p>The framework includes licensing requirements, consumer protection measures, and anti-money laundering compliance.</p>', 'Financial Regulatory Authority - Egypt', '2023', '2023-12-20', 'https://www.fra.gov.eg/crypto-framework', 3),
('SME Finance Access and Growth Strategy', 'Bulletin', 'Strategic approach to improving SME access to financial services.', '<p>A comprehensive strategy has been developed to improve Small and Medium Enterprise access to financial services.</p><p>The strategy includes new financing products and simplified application processes.</p>', 'OECD', '2023', '2023-11-15', 'https://www.oecd.org/sme-finance', 4),
('Consumer Protection Guidelines for Digital Banking', 'Bulletin', 'Guidelines to protect consumers in digital banking environments.', '<p>New guidelines have been issued to protect consumers using digital banking services.</p><p>The guidelines cover data protection, fraud prevention, and dispute resolution mechanisms.</p>', 'Alliance For Financial Inclusion', '2023', '2023-10-20', 'https://www.afi.org/digital-banking', 5),
('Financial Inclusion Measurement Index', 'Bulletin', 'Standardized methodology for measuring financial inclusion.', '<p>A standardized methodology for measuring financial inclusion across different regions and demographics.</p><p>The index provides comparable data for policy makers and financial institutions.</p>', 'Alliance For Financial Inclusion', '2022', '2022-09-10', 'https://www.afi.org/inclusion-index', 6),
('Emerging Technologies in Financial Services', 'Bulletin', 'Analysis of emerging technologies and their impact on financial inclusion.', '<p>Analysis of emerging technologies including blockchain, AI, and digital payments in financial services.</p><p>The report examines opportunities and challenges for financial inclusion.</p>', 'OECD', '2022', '2022-08-15', 'https://www.oecd.org/fintech-report', 7),
('Market Integrity and Stability Framework', 'Bulletin', 'Framework for maintaining market integrity while promoting financial inclusion.', '<p>A comprehensive framework for maintaining market integrity while promoting financial inclusion initiatives.</p><p>The framework balances regulatory oversight with innovation support.</p>', 'Alliance For Financial Inclusion', '2022', '2022-07-20', 'https://www.afi.org/market-integrity', 8);
