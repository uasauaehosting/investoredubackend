-- Add per-language active/inactive flags to member_strategies_projects
-- is_active_en  → controls English content visibility
-- is_active_ar  → controls Arabic content visibility
-- The existing is_active column remains and acts as the master switch
--   (i.e. if is_active = false the record is hidden regardless of language flags)

ALTER TABLE member_strategies_projects
  ADD COLUMN is_active_en BOOLEAN NOT NULL DEFAULT TRUE
    COMMENT 'Whether the English version of this entry is visible on site',
  ADD COLUMN is_active_ar BOOLEAN NOT NULL DEFAULT TRUE
    COMMENT 'Whether the Arabic version of this entry is visible on site';

-- Back-fill: mirror the existing is_active value so current data stays consistent
UPDATE member_strategies_projects
SET
  is_active_en = is_active,
  is_active_ar = is_active;
