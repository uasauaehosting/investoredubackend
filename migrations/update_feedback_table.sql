-- ── Migrate feedback table to full schema ─────────────────────────────────
-- Renames the legacy `org` column to `organization` and adds all columns
-- that the application model expects but were missing from the original table.

-- Step 1: rename `org` → `organization` (safe even if already renamed)
ALTER TABLE feedback
  CHANGE COLUMN `org` `organization` VARCHAR(255) DEFAULT NULL;

-- Step 2: add missing columns (IF NOT EXISTS guards prevent duplicate errors)
ALTER TABLE feedback
  ADD COLUMN IF NOT EXISTS `phone`         VARCHAR(50)   DEFAULT NULL        AFTER `email`,
  ADD COLUMN IF NOT EXISTS `rating`        TINYINT       NOT NULL DEFAULT 0  AFTER `message`,
  ADD COLUMN IF NOT EXISTS `category`      ENUM('General','Complaint','Suggestion','Technical Issue','Content Request')
                                           NOT NULL DEFAULT 'General'         AFTER `rating`,
  ADD COLUMN IF NOT EXISTS `response`      TEXT          DEFAULT NULL         AFTER `category`,
  ADD COLUMN IF NOT EXISTS `responded_by`  VARCHAR(100)  DEFAULT NULL         AFTER `response`,
  ADD COLUMN IF NOT EXISTS `responded_at`  DATETIME      DEFAULT NULL         AFTER `responded_by`,
  ADD COLUMN IF NOT EXISTS `is_active`     BOOLEAN       NOT NULL DEFAULT TRUE AFTER `responded_at`;

-- Step 3: widen the status enum to include all values the model uses
ALTER TABLE feedback
  MODIFY COLUMN `status` ENUM('Pending','In Progress','Resolved','Closed')
                         NOT NULL DEFAULT 'Pending';
