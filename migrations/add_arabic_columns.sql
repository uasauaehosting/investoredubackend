-- Add Arabic (_ar) columns for bilingual RTL support across CMS tables
USE investoreduuasa;

-- News
ALTER TABLE news ADD COLUMN title_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE news ADD COLUMN summary_ar TEXT DEFAULT NULL;
ALTER TABLE news ADD COLUMN content_ar TEXT DEFAULT NULL;
ALTER TABLE news ADD COLUMN full_detail_ar TEXT DEFAULT NULL;

-- Members
ALTER TABLE members ADD COLUMN name_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE members ADD COLUMN country_ar VARCHAR(100) DEFAULT NULL;

-- Slides
ALTER TABLE slides ADD COLUMN title_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE slides ADD COLUMN subtitle_ar VARCHAR(500) DEFAULT NULL;
ALTER TABLE slides ADD COLUMN cta_text_ar VARCHAR(255) DEFAULT NULL;

-- Education content
ALTER TABLE education_content ADD COLUMN title_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE education_content ADD COLUMN description_ar TEXT DEFAULT NULL;
ALTER TABLE education_content ADD COLUMN content_ar TEXT DEFAULT NULL;

-- About sections
ALTER TABLE about_sections ADD COLUMN title_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE about_sections ADD COLUMN content_ar TEXT DEFAULT NULL;

-- Portals
ALTER TABLE portals ADD COLUMN title_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE portals ADD COLUMN short_title_ar VARCHAR(100) DEFAULT NULL;
ALTER TABLE portals ADD COLUMN description_ar TEXT DEFAULT NULL;
ALTER TABLE portals ADD COLUMN authority_name_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE portals ADD COLUMN country_ar VARCHAR(100) DEFAULT NULL;

-- Alerts & bulletins
ALTER TABLE alerts_bulletins ADD COLUMN title_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE alerts_bulletins ADD COLUMN description_ar TEXT DEFAULT NULL;
ALTER TABLE alerts_bulletins ADD COLUMN content_ar TEXT DEFAULT NULL;

-- Principles
ALTER TABLE principles ADD COLUMN title_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE principles ADD COLUMN description_ar TEXT DEFAULT NULL;
ALTER TABLE principles ADD COLUMN content_ar TEXT DEFAULT NULL;

-- Investment products
ALTER TABLE investment_products ADD COLUMN title_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE investment_products ADD COLUMN description_ar TEXT DEFAULT NULL;
ALTER TABLE investment_products ADD COLUMN content_ar TEXT DEFAULT NULL;

-- Publications
ALTER TABLE publications ADD COLUMN title_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE publications ADD COLUMN description_ar TEXT DEFAULT NULL;

-- Programs (JSON array fields stored as TEXT)
ALTER TABLE programs ADD COLUMN member_name_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE programs ADD COLUMN general_info_ar TEXT DEFAULT NULL;
ALTER TABLE programs ADD COLUMN education_materials_ar TEXT DEFAULT NULL;
ALTER TABLE programs ADD COLUMN specific_materials_ar TEXT DEFAULT NULL;
ALTER TABLE programs ADD COLUMN assisting_groups_ar TEXT DEFAULT NULL;
ALTER TABLE programs ADD COLUMN evaluation_ar TEXT DEFAULT NULL;
ALTER TABLE programs ADD COLUMN successful_programs_ar TEXT DEFAULT NULL;

-- Global policy areas
ALTER TABLE global_policy_areas ADD COLUMN title_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE global_policy_areas ADD COLUMN description_ar TEXT DEFAULT NULL;

-- Member strategies & projects
ALTER TABLE member_strategies_projects ADD COLUMN title_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE member_strategies_projects ADD COLUMN description_ar TEXT DEFAULT NULL;

-- Benchmarking
ALTER TABLE benchmarking_records ADD COLUMN authority_name_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE benchmarking_records ADD COLUMN indicator_ar VARCHAR(255) DEFAULT NULL;

-- Footer stats
ALTER TABLE footer_stats ADD COLUMN label_ar VARCHAR(100) DEFAULT NULL;

-- Authorities (if table exists)
ALTER TABLE authorities ADD COLUMN name_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE authorities ADD COLUMN description_ar TEXT DEFAULT NULL;

-- Frameworks
ALTER TABLE frameworks ADD COLUMN title_ar VARCHAR(255) DEFAULT NULL;
ALTER TABLE frameworks ADD COLUMN description_ar TEXT DEFAULT NULL;
ALTER TABLE frameworks ADD COLUMN content_ar TEXT DEFAULT NULL;
