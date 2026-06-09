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

INSERT INTO global_policy_areas (title, description, institution, category, file_url) VALUES
('Financial literacy and inclusion', 'View Description', 'OECD', 'Report', 'https://www.oecd.org/daf/fin/financial-education/TrustFund2013_OECD_INFE_Fin_Lit_and_Incl_SurveyResults_by_Country_and_Gender.pdf'),
('Latest Documents', 'View Description', 'OECD', 'Others', 'http://www.oecd.org/finance/financial-education/latestdocuments/'),
('Alliance for Financial Inclusion Policy Area', 'View Description', 'Alliance For Financial Inclusion', 'Integrity and Stability', 'https://www.afi-global.org/policy-areas/balancing-inclusion-integrity-and-stability'),
('Alliance for Financial Inclusion Policy Area', 'View Description', 'Alliance For Financial Inclusion', 'Consumer Empowerment and Market Conduct', 'https://www.afi-global.org/policy-areas/consumer-empowerment-and-market-conduct'),
('Alliance for Financial Inclusion Policy Area', 'View Description', 'Alliance For Financial Inclusion', 'Digital Financial Services', 'https://www.afi-global.org/policy-areas/digital-financial-services'),
('Alliance for Financial Inclusion Policy Area', 'View Description', 'Alliance For Financial Inclusion', 'Financial Inclusion Strategy', 'https://www.afi-global.org/policy-areas/financial-inclusion-strategy'),
('Alliance for Financial Inclusion Policy Area', 'View Description', 'Alliance For Financial Inclusion', 'Measuring Financial Inclusion', 'https://www.afi-global.org/policy-areas/measuring-financial-inclusion'),
('Alliance for Financial Inclusion Policy Area', 'View Description', 'Alliance For Financial Inclusion', 'SME Finance', 'https://www.afi-global.org/policy-areas/sme-finance'),
('Alliance for Financial Inclusion Policy Area', 'View Description', 'Alliance For Financial Inclusion', 'Emerging Financial Inclusion Areas', 'https://www.afi-global.org/policy-areas/other-financial-inclusion-policies');
