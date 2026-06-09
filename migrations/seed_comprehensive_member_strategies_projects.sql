-- Comprehensive seeding script for Member Strategies & Projects
-- This script creates necessary categories and inserts sample data

-- First, ensure we have the necessary categories for financial inclusion strategies and reports
INSERT IGNORE INTO categories (name, authorityId, description, isActive, created_at, updated_at) VALUES
('Financial Inclusion Strategy', 1, 'Financial inclusion strategies and frameworks', 1, NOW(), NOW()),
('Financial Inclusion Report', 1, 'Financial inclusion reports and analyses', 1, NOW(), NOW()),
('Central Bank Policy', 1, 'Central bank policies and programs', 1, NOW(), NOW()),
('Strategic Plan', 1, 'Organizational strategic plans', 1, NOW(), NOW()),
('Banking Observatory', 1, 'Banking sector observatory reports', 1, NOW(), NOW()),
('Activity Report', 1, 'Annual activity reports', 1, NOW(), NOW()),
('Regulatory Framework', 1, 'Regulatory frameworks and guidelines', 1, NOW(), NOW());

-- Now insert the sample data for Member Strategies & Projects
-- Using category IDs that should exist after the above insertions

-- Jordan Securities Commission (ID: 1)
INSERT INTO member_strategies_projects (title, description, member_id, category_id, date, file_url, views, downloads, is_active, created_at, updated_at) VALUES
('The Financial Inclusion National Strategy', 'Comprehensive national strategy for financial inclusion in Jordan, covering policy frameworks, implementation plans, and progress metrics', 1, 1, '2024-01-15', 'https://jsc.gov.jo/files/financial-inclusion-national-strategy.pdf', 0, 0, 1, NOW(), NOW()),
('Central Bank of Jordan''s Policy and Program', 'Central Bank of Jordan''s comprehensive policy framework and program initiatives for financial market development and inclusion', 1, 3, '2024-02-20', 'https://cbj.gov.jo/files/policy-program.pdf', 0, 0, 1, NOW(), NOW());

-- Commission d’Organisation et de Surveillance des opérations de Bourse - Algeria (ID: 2)
INSERT INTO member_strategies_projects (title, description, member_id, category_id, date, file_url, views, downloads, is_active, created_at, updated_at) VALUES
('INCLUSION FINANCIERE', 'Algeria''s financial inclusion strategy focusing on expanding access to financial services and promoting financial literacy', 2, 1, '2024-03-10', 'https://cosob.org.dz/files/financial-inclusion-strategy.pdf', 0, 0, 1, NOW(), NOW()),
('Financial Inclusion', 'Annual report on financial inclusion progress and initiatives in Algeria', 2, 2, '2024-04-05', 'https://cosob.org.dz/files/financial-inclusion-report.pdf', 0, 0, 1, NOW(), NOW());

-- Iraqi Securities Commission (ID: 3)
INSERT INTO member_strategies_projects (title, description, member_id, category_id, date, file_url, views, downloads, is_active, created_at, updated_at) VALUES
('Strategic Plan', 'Iraqi Securities Commission strategic plan for market development and investor protection', 3, 4, '2024-05-12', 'https://isc.gov.iq/files/strategic-plan.pdf', 0, 0, 1, NOW(), NOW()),
('Financial Inclusion', 'Iraq''s approach to financial inclusion and market development initiatives', 3, 2, '2024-06-18', 'https://isc.gov.iq/files/financial-inclusion.pdf', 0, 0, 1, NOW(), NOW());

-- Palestine Capital Market Authority (ID: 4)
INSERT INTO member_strategies_projects (title, description, member_id, category_id, date, file_url, views, downloads, is_active, created_at, updated_at) VALUES
('Financial Inclusion In Palestine', 'Palestine''s comprehensive financial inclusion strategy and implementation framework', 4, 1, '2024-07-22', 'https://pcma.ps/files/financial-inclusion-palestine.pdf', 0, 0, 1, NOW(), NOW());

-- Qatar Financial Markets Authority (ID: 5)
INSERT INTO member_strategies_projects (title, description, member_id, category_id, date, file_url, views, downloads, is_active, created_at, updated_at) VALUES
('Strategic Plan', 'Qatar Financial Markets Authority strategic plan for market development and innovation', 5, 4, '2024-08-15', 'https://qfma.org.qa/files/strategic-plan.pdf', 0, 0, 1, NOW(), NOW());

-- Kuwait Capital Markets Authority (ID: 6)
INSERT INTO member_strategies_projects (title, description, member_id, category_id, date, file_url, views, downloads, is_active, created_at, updated_at) VALUES
('Eda''at', 'Kuwait Capital Markets Authority''s comprehensive regulatory framework and market development initiatives', 6, 6, '2024-09-10', 'https://cma.gov.kw/files/edaat.pdf', 0, 0, 1, NOW(), NOW());

-- Conseil du Marché Financier - Tunisia (ID: 7)
INSERT INTO member_strategies_projects (title, description, member_id, category_id, date, file_url, views, downloads, is_active, created_at, updated_at) VALUES
('L''observatoire des services bancaires', 'Tunisia''s banking sector observatory report analyzing market trends and developments', 7, 5, '2024-10-05', 'https://cmf.tn/files/banking-observatory.pdf', 0, 0, 1, NOW(), NOW()),
('Rapport d''activité', 'Annual activity report of Tunisia''s Financial Market Council', 7, 7, '2024-11-20', 'https://cmf.tn/files/activity-report.pdf', 0, 0, 1, NOW(), NOW());

-- Update statistics for demonstration
UPDATE member_strategies_projects SET views = FLOOR(RAND() * 100) + 50, downloads = FLOOR(RAND() * 50) + 20 WHERE is_active = 1;
