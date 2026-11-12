-- ============================================================
-- UASA Investor Education Portal — Full MySQL Database Setup
-- Run once on a fresh database.  Safe to re-run (IF NOT EXISTS).
-- Encoding: utf8mb4 / utf8mb4_unicode_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS investoreduuasa
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE investoreduuasa;

-- ── Admins ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id          INT          AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(50)  NOT NULL UNIQUE,
  email       VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  first_name  VARCHAR(50)  NOT NULL,
  last_name   VARCHAR(50)  NOT NULL,
  role        ENUM('Super Admin','Admin','Editor') NOT NULL DEFAULT 'Admin',
  last_login  DATETIME     DEFAULT NULL,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_permissions (
  id         INT         AUTO_INCREMENT PRIMARY KEY,
  admin_id   INT         NOT NULL,
  permission VARCHAR(100) NOT NULL,
  INDEX idx_admin_permissions_admin (admin_id),
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- ── Slides (hero carousel) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS slides (
  id            INT          AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255) NOT NULL DEFAULT '',
  title_ar      VARCHAR(255) DEFAULT NULL,
  subtitle      TEXT         DEFAULT NULL,
  subtitle_ar   TEXT         DEFAULT NULL,
  image_url     VARCHAR(500) DEFAULT NULL,
  cta_text      VARCHAR(100) DEFAULT NULL,
  cta_text_ar   VARCHAR(100) DEFAULT NULL,
  cta_href      VARCHAR(500) DEFAULT NULL,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slides_active_order (is_active, display_order)
);

-- ── News ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id            INT          AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255) NOT NULL DEFAULT '',
  title_ar      VARCHAR(255) DEFAULT NULL,
  summary       TEXT         DEFAULT NULL,
  summary_ar    TEXT         DEFAULT NULL,
  content       TEXT         DEFAULT NULL,
  content_ar    TEXT         DEFAULT NULL,
  full_detail   LONGTEXT     DEFAULT NULL,
  full_detail_ar LONGTEXT    DEFAULT NULL,
  category      VARCHAR(100) NOT NULL DEFAULT 'News',
  link          VARCHAR(500) DEFAULT NULL,
  image         VARCHAR(500) DEFAULT NULL,
  pdf_file      VARCHAR(500) DEFAULT NULL,
  date          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_news_active_order (is_active, display_order)
);

-- ── Members (authority logos on homepage) ───────────────────
CREATE TABLE IF NOT EXISTS members (
  id            INT          AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  name_ar       VARCHAR(255) DEFAULT NULL,
  country       VARCHAR(100) DEFAULT NULL,
  country_ar    VARCHAR(100) DEFAULT NULL,
  website       VARCHAR(500) DEFAULT NULL,
  logo          VARCHAR(500) DEFAULT NULL,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_members_active_order (is_active, display_order)
);

-- ── Home Stats ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS home_stats (
  id                  INT         AUTO_INCREMENT PRIMARY KEY,
  reading_materials   VARCHAR(50) DEFAULT NULL,
  members_activities  VARCHAR(50) DEFAULT NULL,
  alerts_bulletins    VARCHAR(50) DEFAULT NULL,
  last_updated        DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at          DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Footer Stats ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS footer_stats (
  id            INT          AUTO_INCREMENT PRIMARY KEY,
  label         VARCHAR(255) NOT NULL,
  label_ar      VARCHAR(255) DEFAULT NULL,
  value         VARCHAR(100) NOT NULL,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE
);

-- ── About Sections ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS about_sections (
  id         INT      AUTO_INCREMENT PRIMARY KEY,
  title      TEXT     NOT NULL,
  title_ar   TEXT     DEFAULT NULL,
  content    LONGTEXT NOT NULL,
  content_ar LONGTEXT DEFAULT NULL,
  `order`    INT      NOT NULL DEFAULT 0,
  is_active  BOOLEAN  NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Contact Info ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_info (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  type       VARCHAR(50)  NOT NULL,
  value      VARCHAR(500) NOT NULL,
  value_ar   VARCHAR(500) DEFAULT NULL,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Portals (member authority portal links) ─────────────────
CREATE TABLE IF NOT EXISTS portals (
  id                INT          AUTO_INCREMENT PRIMARY KEY,
  title             VARCHAR(255) NOT NULL,
  title_ar          VARCHAR(255) DEFAULT NULL,
  short_title       VARCHAR(100) NOT NULL DEFAULT '',
  short_title_ar    VARCHAR(100) DEFAULT NULL,
  description       TEXT         NOT NULL,
  description_ar    TEXT         DEFAULT NULL,
  image_url         VARCHAR(500) NOT NULL DEFAULT '',
  link              VARCHAR(500) NOT NULL DEFAULT '',
  authority_name    VARCHAR(255) NOT NULL,
  authority_name_ar VARCHAR(255) DEFAULT NULL,
  country           VARCHAR(100) NOT NULL DEFAULT '',
  country_ar        VARCHAR(100) DEFAULT NULL,
  display_order     INT          NOT NULL DEFAULT 0,
  is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_portals_active_order (is_active, display_order)
);

-- ── Principles ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS principles (
  id            INT          AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  title_ar      VARCHAR(255) DEFAULT NULL,
  description   TEXT         DEFAULT NULL,
  description_ar TEXT        DEFAULT NULL,
  author        VARCHAR(255) DEFAULT NULL,
  date          DATE         DEFAULT NULL,
  file_url      VARCHAR(500) DEFAULT NULL,
  image_url     VARCHAR(500) DEFAULT NULL,
  content       LONGTEXT     DEFAULT NULL,
  content_ar    LONGTEXT     DEFAULT NULL,
  authority_id  INT          DEFAULT NULL,
  category_id   INT          DEFAULT NULL,
  views         INT          NOT NULL DEFAULT 0,
  downloads     INT          NOT NULL DEFAULT 0,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_principles_active_order (is_active, display_order)
);

-- ── Frameworks ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS frameworks (
  id            INT          AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  title_ar      VARCHAR(255) DEFAULT NULL,
  description   TEXT         DEFAULT NULL,
  description_ar TEXT        DEFAULT NULL,
  author        VARCHAR(255) DEFAULT NULL,
  date          DATE         DEFAULT NULL,
  file_url      VARCHAR(500) DEFAULT NULL,
  image_url     VARCHAR(500) DEFAULT NULL,
  content       LONGTEXT     DEFAULT NULL,
  content_ar    LONGTEXT     DEFAULT NULL,
  authority_id  INT          DEFAULT NULL,
  category_id   INT          DEFAULT NULL,
  views         INT          NOT NULL DEFAULT 0,
  downloads     INT          NOT NULL DEFAULT 0,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_frameworks_active_order (is_active, display_order)
);

-- ── Investment Products ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS investment_products (
  id            INT          AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  title_ar      VARCHAR(255) DEFAULT NULL,
  description   TEXT         DEFAULT NULL,
  description_ar TEXT        DEFAULT NULL,
  author        VARCHAR(255) DEFAULT NULL,
  date          DATE         DEFAULT NULL,
  file_url      VARCHAR(500) DEFAULT NULL,
  image_url     VARCHAR(500) DEFAULT NULL,
  content       LONGTEXT     DEFAULT NULL,
  content_ar    LONGTEXT     DEFAULT NULL,
  slug          VARCHAR(255) DEFAULT NULL,
  authority_id  INT          DEFAULT NULL,
  category_id   INT          DEFAULT NULL,
  views         INT          NOT NULL DEFAULT 0,
  downloads     INT          NOT NULL DEFAULT 0,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_investment_products_active_order (is_active, display_order)
);

-- ── Publications ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS publications (
  id             INT           AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(500)  NOT NULL,
  title_ar       VARCHAR(500)  DEFAULT NULL,
  description    TEXT          DEFAULT NULL,
  description_ar TEXT          DEFAULT NULL,
  authority_name VARCHAR(255)  NOT NULL,
  category       ENUM('Brochure','Code','General','Guide','Others','Report','Study') NOT NULL DEFAULT 'General',
  file_url       VARCHAR(1000) DEFAULT NULL,
  date_published DATE          DEFAULT NULL,
  display_order  INT           NOT NULL DEFAULT 0,
  is_active      BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_publications_active_order (is_active, display_order)
);

-- ── Programs ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS programs (
  id                     INT          AUTO_INCREMENT PRIMARY KEY,
  member_name            VARCHAR(255) NOT NULL,
  member_name_ar         VARCHAR(255) DEFAULT NULL,
  general_info           JSON         DEFAULT NULL,
  general_info_ar        JSON         DEFAULT NULL,
  education_materials    JSON         DEFAULT NULL,
  education_materials_ar JSON         DEFAULT NULL,
  specific_materials     JSON         DEFAULT NULL,
  specific_materials_ar  JSON         DEFAULT NULL,
  assisting_groups       JSON         DEFAULT NULL,
  assisting_groups_ar    JSON         DEFAULT NULL,
  evaluation             JSON         DEFAULT NULL,
  evaluation_ar          JSON         DEFAULT NULL,
  successful_programs    JSON         DEFAULT NULL,
  successful_programs_ar JSON         DEFAULT NULL,
  display_order          INT          NOT NULL DEFAULT 0,
  is_active              BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_programs_active_order (is_active, display_order)
);

-- ── Alerts & Bulletins ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts_bulletins (
  id             INT          AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  title_ar       VARCHAR(255) DEFAULT NULL,
  type           ENUM('Alert','Bulletin') NOT NULL,
  description    TEXT         DEFAULT NULL,
  description_ar TEXT         DEFAULT NULL,
  content        LONGTEXT     DEFAULT NULL,
  content_ar     LONGTEXT     DEFAULT NULL,
  authority_name VARCHAR(255) DEFAULT NULL,
  year           VARCHAR(10)  DEFAULT NULL,
  date_published DATETIME     DEFAULT NULL,
  link           VARCHAR(500) DEFAULT NULL,
  display_order  INT          NOT NULL DEFAULT 0,
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_alerts_bulletins_active_order (is_active, display_order)
);

-- ── Global Policy Areas ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS global_policy_areas (
  id             INT          AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(500) NOT NULL,
  title_ar       VARCHAR(500) DEFAULT NULL,
  description    TEXT         DEFAULT NULL,
  description_ar TEXT         DEFAULT NULL,
  institution    VARCHAR(255) NOT NULL,
  category       VARCHAR(255) NOT NULL,
  file_url       VARCHAR(1000) DEFAULT NULL,
  date_published DATE         DEFAULT NULL,
  display_order  INT          NOT NULL DEFAULT 0,
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_global_policy_areas_active_order (is_active, display_order)
);

-- ── Member Strategies & Projects ─────────────────────────────
CREATE TABLE IF NOT EXISTS member_strategies_projects (
  id             INT          AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  title_ar       VARCHAR(255) DEFAULT NULL,
  description    TEXT         DEFAULT NULL,
  description_ar TEXT         DEFAULT NULL,
  authority_name VARCHAR(255) NOT NULL DEFAULT '',
  type           VARCHAR(50)  NOT NULL DEFAULT 'Strategy',
  status         VARCHAR(50)  DEFAULT NULL,
  file_url       VARCHAR(500) DEFAULT NULL,
  date           DATE         DEFAULT NULL,
  display_order  INT          NOT NULL DEFAULT 0,
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_member_strategies_projects_active (is_active, display_order)
);

-- ── Benchmarking Records ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS benchmarking_records (
  id                INT          AUTO_INCREMENT PRIMARY KEY,
  authority_name    VARCHAR(255) NOT NULL,
  authority_name_ar VARCHAR(255) DEFAULT NULL,
  year              VARCHAR(10)  NOT NULL,
  indicator         TEXT         DEFAULT NULL,
  indicator_ar      TEXT         DEFAULT NULL,
  value             TEXT         DEFAULT NULL,
  data              JSON         DEFAULT NULL,
  display_order     INT          NOT NULL DEFAULT 0,
  is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_benchmarking_active_order (is_active, display_order)
);

-- ── Glossary Terms ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS glossary_terms (
  id          INT          AUTO_INCREMENT PRIMARY KEY,
  term        VARCHAR(255) NOT NULL,
  term_ar     VARCHAR(255) DEFAULT NULL,
  term_fr     VARCHAR(255) DEFAULT NULL,
  explanation TEXT         DEFAULT NULL,
  explanation_ar TEXT      DEFAULT NULL,
  display_order INT        NOT NULL DEFAULT 0,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_glossary_terms_active_order (is_active, display_order)
);

-- ── Education Content (section landing cards) ────────────────
CREATE TABLE IF NOT EXISTS education_content (
  id            INT          AUTO_INCREMENT PRIMARY KEY,
  section       VARCHAR(100) NOT NULL,
  title         VARCHAR(255) NOT NULL,
  title_ar      VARCHAR(255) DEFAULT NULL,
  description   TEXT         DEFAULT NULL,
  description_ar TEXT        DEFAULT NULL,
  image_url     VARCHAR(500) DEFAULT NULL,
  content       LONGTEXT     DEFAULT NULL,
  content_ar    LONGTEXT     DEFAULT NULL,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_education_content_section (section, is_active, display_order)
);

-- ── Site Content (CMS key-value blocks) ──────────────────────
CREATE TABLE IF NOT EXISTS site_content (
  id          INT          AUTO_INCREMENT PRIMARY KEY,
  content_key VARCHAR(100) NOT NULL UNIQUE,
  content     JSON         NOT NULL,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_site_content_key (content_key)
);

-- ── Feedback ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feedback (
  id             INT          AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  email          VARCHAR(100) NOT NULL,
  phone          VARCHAR(50)  DEFAULT NULL,
  organization   VARCHAR(255) DEFAULT NULL,
  country        VARCHAR(100) DEFAULT NULL,
  subject        VARCHAR(255) NOT NULL DEFAULT 'General',
  message        TEXT         NOT NULL,
  rating         TINYINT      NOT NULL DEFAULT 0,
  category       ENUM('General','Complaint','Suggestion','Technical Issue','Content Request')
                              NOT NULL DEFAULT 'General',
  status         ENUM('Pending','In Progress','Resolved','Closed')
                              NOT NULL DEFAULT 'Pending',
  response       TEXT         DEFAULT NULL,
  responded_by   VARCHAR(100) DEFAULT NULL,
  responded_at   DATETIME     DEFAULT NULL,
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_feedback_status (status),
  INDEX idx_feedback_active (is_active)
);

-- ── Media Uploads (audit log) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS media_uploads (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  filename     VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type    VARCHAR(100) NOT NULL,
  file_url     VARCHAR(500) NOT NULL,
  storage_type ENUM('ftp','local') NOT NULL DEFAULT 'ftp',
  file_size    INT          DEFAULT NULL,
  uploaded_by  INT          DEFAULT NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_media_uploads_storage (storage_type),
  INDEX idx_media_uploads_created (created_at)
);

-- ── Authorities ──────────────────────────────────────────────
-- Used by reading materials (principles, frameworks, investment products)
CREATE TABLE IF NOT EXISTS authorities (
  id            INT          AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  name_ar       VARCHAR(255) DEFAULT NULL,
  type          VARCHAR(100) NOT NULL DEFAULT 'Other',
  description   TEXT         DEFAULT NULL,
  description_ar TEXT        DEFAULT NULL,
  website       VARCHAR(500) DEFAULT NULL,
  logo          VARCHAR(500) DEFAULT NULL,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Categories ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  authority_id INT          NOT NULL,
  description  TEXT         DEFAULT NULL,
  is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (authority_id) REFERENCES authorities(id) ON DELETE CASCADE
);

-- ── Reading Materials (legacy — superseded by principles/frameworks) ──
CREATE TABLE IF NOT EXISTS reading_materials (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  description  TEXT         DEFAULT NULL,
  category     VARCHAR(100) DEFAULT NULL,
  author       VARCHAR(255) DEFAULT NULL,
  date         DATE         DEFAULT NULL,
  file_url     VARCHAR(500) DEFAULT NULL,
  authority_id INT          DEFAULT NULL,
  category_id  INT          DEFAULT NULL,
  views        INT          NOT NULL DEFAULT 0,
  downloads    INT          NOT NULL DEFAULT 0,
  is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Member Activities (legacy) ───────────────────────────────
CREATE TABLE IF NOT EXISTS member_activities (
  id             INT          AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  description    TEXT         DEFAULT NULL,
  type           VARCHAR(100) DEFAULT NULL,
  status         VARCHAR(50)  DEFAULT NULL,
  authority_name VARCHAR(255) DEFAULT NULL,
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- Seed: default Super Admin
-- Password below is a bcrypt hash of "admin123" (salt=12).
-- CHANGE the password immediately after first login.
-- ============================================================
INSERT INTO admins (username, email, password, first_name, last_name, role, is_active)
VALUES (
  'superadmin',
  'admin@uasa.ae',
  '$2a$12$ksNwMJhUxIj2R0iy7AvP8eY2.GW3vD6oXHHQoqR8VNI6WcGtCz.mG',
  'System',
  'Administrator',
  'Super Admin',
  TRUE
) ON DUPLICATE KEY UPDATE username = username;

-- Seed: default home stats
INSERT INTO home_stats (reading_materials, members_activities, alerts_bulletins)
VALUES ('1,200+', '350+', '120+')
ON DUPLICATE KEY UPDATE id = id;

SELECT 'UASA database setup completed successfully!' AS message;
