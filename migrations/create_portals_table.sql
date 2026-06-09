-- Create Portals Table
CREATE TABLE IF NOT EXISTS portals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    short_title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(1000),
    link VARCHAR(1000) NOT NULL,
    authority_name VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_authority (authority_name),
    INDEX idx_country (country),
    INDEX idx_active (is_active),
    INDEX idx_display_order (display_order)
);

-- Insert sample data
INSERT INTO portals (title, short_title, description, image_url, link, authority_name, country, display_order) VALUES
('Conseil du Marché Financier - Tunisia', 'CMF - Tunisia', 'Financial market regulatory authority for Tunisia', 'http://uasa.ae/en/galorg/30312018123118Tunisia2.png', 'https://www.myinvestia.com/', 'Conseil du Marché Financier - Tunisia', 'Tunisia', 1),
('Commission d''Organisation et de Surveillance des opérations de Bourse', 'COSOB - Algeria', 'Securities exchange commission for Algeria', 'http://uasa.ae/en/galorg/30532018125329Algeria.png', 'http://www.cosob.org/guides/', 'Commission d''Organisation et de Surveillance des opérations de Bourse', 'Algeria', 2),
('Saudi Capital Market Authority', 'CMA - Saudi Arabia', 'Capital market authority for Saudi Arabia', 'http://uasa.ae/en/galorg/30542018125450KSA2.png', 'https://www.si.org.sa/?lang=en', 'Saudi Capital Market Authority', 'Saudi Arabia', 3),
('Syrian Commission on financial markets and securities', 'SCFMS - Syria', 'Financial markets and securities commission for Syria', 'http://uasa.ae/en/galorg/30552018125546Syria.png', 'http://scfms.sy/awarenessLetters/ar/37/0/?????-???????', 'Syrian Commission on financial markets and securities', 'Syria', 4),
('Palestine Capital Market Authority', 'PCMA - Palestine', 'Capital market authority for Palestine', 'http://uasa.ae/en/galorg/30572018125706Palestine.png', 'http://www.pcma.ps/portal/awareness/SitePages/Home.aspx', 'Palestine Capital Market Authority', 'Palestine', 5),
('Qatar Financial Markets Authority', 'QFMA - Qatar', 'Financial markets authority for Qatar', 'http://uasa.ae/en/galorg/30592018125923Qatar.png', 'https://www.qfma.org.qa/English/mediacenter/pages/investorawareness.aspx', 'Qatar Financial Markets Authority', 'Qatar', 6),
('Kuwait Capital Markets Authority', 'CMA - Kuwait', 'Capital markets authority for Kuwait', 'http://uasa.ae/en/galorg/30042018010402Kuwait.png', 'https://www.cma.gov.kw/ar/web/cma/awareness', 'Kuwait Capital Markets Authority', 'Kuwait', 7),
('Capital Markets Authority of Lebanon', 'CMA - Lebanon', 'Capital markets authority for Lebanon', 'http://uasa.ae/en/galorg/30272018012743Lebanon.png', 'https://www.cma.gov.lb/investor-education/', 'Capital Markets Authority of Lebanon', 'Lebanon', 8),
('Financial Regulatory Authority - Egypt', 'FRA - Egypt', 'Financial regulatory authority for Egypt', 'http://uasa.ae/en/galorg/30432018014338Egypt.png', 'http://www.iinvest.org.eg/general/index.jsp', 'Financial Regulatory Authority - Egypt', 'Egypt', 9),
('Autorité Marocaine du Marché des Capitaux (AMMC)', 'AMMC - Morocco', 'Capital market authority for Morocco', 'http://uasa.ae/en/galorg/30442018014432Morocco.png', 'http://www.ammc.ma/en/espace-epargnants', 'Autorité Marocaine du Marché des Capitaux (AMMC)', 'Morocco', 10);
