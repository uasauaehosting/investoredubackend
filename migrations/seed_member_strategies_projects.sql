-- Sample data for Member Strategies & Projects
-- This script inserts sample data based on the provided information

-- Jordan Securities Commission
INSERT INTO member_strategies_projects (title, description, member_id, category_id, date, file_url, views, downloads, is_active, created_at, updated_at) VALUES
('The Financial Inclusion National Strategy', 'View Description', 1, 54, '2024-01-15', 'https://example.com/jordan-financial-inclusion-strategy.pdf', 0, 0, 1, NOW(), NOW()),
('Central Bank of Jordan''s Policy and Program', 'View Description', 1, 55, '2024-02-20', 'https://example.com/jordan-central-bank-policy.pdf', 0, 0, 1, NOW(), NOW());

-- Commission d’Organisation et de Surveillance des opérations de Bourse (COSOB) - Algeria
INSERT INTO member_strategies_projects (title, description, member_id, category_id, date, file_url, views, downloads, is_active, created_at, updated_at) VALUES
('INCLUSION FINANCIERE', 'View Description', 2, 56, '2024-03-10', 'https://example.com/algeria-financial-inclusion.pdf', 0, 0, 1, NOW(), NOW()),
('Financial Inclusion', 'View Description', 2, 57, '2024-04-05', 'https://example.com/algeria-financial-inclusion-report.pdf', 0, 0, 1, NOW(), NOW());

-- Iraqi Securities Commission
INSERT INTO member_strategies_projects (title, description, member_id, category_id, date, file_url, views, downloads, is_active, created_at, updated_at) VALUES
('Strategic Plan', 'View Description', 3, 58, '2024-05-12', 'https://example.com/iraq-strategic-plan.pdf', 0, 0, 1, NOW(), NOW()),
('Financial Inclusion', 'View Description', 3, 59, '2024-06-18', 'https://example.com/iraq-financial-inclusion.pdf', 0, 0, 1, NOW(), NOW());

-- Palestine Capital Market Authority
INSERT INTO member_strategies_projects (title, description, member_id, category_id, date, file_url, views, downloads, is_active, created_at, updated_at) VALUES
('Financial Inclusion In Palestine', 'View Description', 4, 60, '2024-07-22', 'https://example.com/palestine-financial-inclusion.pdf', 0, 0, 1, NOW(), NOW());

-- Qatar Financial Markets Authority
INSERT INTO member_strategies_projects (title, description, member_id, category_id, date, file_url, views, downloads, is_active, created_at, updated_at) VALUES
('Strategic Plan', 'View Description', 5, 61, '2024-08-15', 'https://example.com/qatar-strategic-plan.pdf', 0, 0, 1, NOW(), NOW());

-- Kuwait Capital Markets Authority
INSERT INTO member_strategies_projects (title, description, member_id, category_id, date, file_url, views, downloads, is_active, created_at, updated_at) VALUES
('Eda''at', 'View Description', 6, 62, '2024-09-10', 'https://example.com/kuwait-edaat.pdf', 0, 0, 1, NOW(), NOW());

-- Conseil du Marché Financier - Tunisia
INSERT INTO member_strategies_projects (title, description, member_id, category_id, date, file_url, views, downloads, is_active, created_at, updated_at) VALUES
('L''observatoire des services bancaires', 'View Description', 7, 63, '2024-10-05', 'https://example.com/tunisia-banking-observatory.pdf', 0, 0, 1, NOW(), NOW()),
('Rapport d''activité', 'View Description', 7, 64, '2024-11-20', 'https://example.com/tunisia-activity-report.pdf', 0, 0, 1, NOW(), NOW());

-- Note: Members without content (UAE, Syria, Lebanon, Egypt, Morocco, Libya, Dubai) will not have sample data
-- You can add data for them later when content becomes available
