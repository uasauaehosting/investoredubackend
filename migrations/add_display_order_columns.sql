-- Manual sort order for admin drag-and-drop (skip if column already exists)

ALTER TABLE members ADD COLUMN display_order INT NOT NULL DEFAULT 0;
ALTER TABLE principles ADD COLUMN display_order INT NOT NULL DEFAULT 0;
ALTER TABLE frameworks ADD COLUMN display_order INT NOT NULL DEFAULT 0;
ALTER TABLE investment_products ADD COLUMN display_order INT NOT NULL DEFAULT 0;
ALTER TABLE publications ADD COLUMN display_order INT NOT NULL DEFAULT 0;
ALTER TABLE programs ADD COLUMN display_order INT NOT NULL DEFAULT 0;
ALTER TABLE glossary_terms ADD COLUMN display_order INT NOT NULL DEFAULT 0;
ALTER TABLE benchmarking_records ADD COLUMN display_order INT NOT NULL DEFAULT 0;
ALTER TABLE global_policy_areas ADD COLUMN display_order INT NOT NULL DEFAULT 0;
ALTER TABLE member_strategies_projects ADD COLUMN display_order INT NOT NULL DEFAULT 0;
ALTER TABLE alerts_bulletins ADD COLUMN display_order INT NOT NULL DEFAULT 0;

SET @row := 0;
UPDATE members SET display_order = (@row := @row + 1) ORDER BY created_at DESC, id DESC;

SET @row := 0;
UPDATE principles SET display_order = (@row := @row + 1) ORDER BY date DESC, id DESC;

SET @row := 0;
UPDATE frameworks SET display_order = (@row := @row + 1) ORDER BY date DESC, id DESC;

SET @row := 0;
UPDATE investment_products SET display_order = (@row := @row + 1) ORDER BY date DESC, id DESC;

SET @row := 0;
UPDATE publications SET display_order = (@row := @row + 1) ORDER BY date_published DESC, id DESC;

SET @row := 0;
UPDATE programs SET display_order = (@row := @row + 1) ORDER BY created_at DESC, id DESC;

SET @row := 0;
UPDATE glossary_terms SET display_order = (@row := @row + 1) ORDER BY term ASC, id ASC;

SET @row := 0;
UPDATE benchmarking_records SET display_order = (@row := @row + 1) ORDER BY year DESC, authority_name ASC, id DESC;

SET @row := 0;
UPDATE global_policy_areas SET display_order = (@row := @row + 1) ORDER BY date_published DESC, id DESC;

SET @row := 0;
UPDATE member_strategies_projects SET display_order = (@row := @row + 1) ORDER BY authority_name ASC, title ASC, id ASC;

SET @row := 0;
UPDATE alerts_bulletins SET display_order = (@row := @row + 1) ORDER BY date_published DESC, id DESC;
