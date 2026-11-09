-- Add image_url column to about_sections table
ALTER TABLE about_sections
  ADD COLUMN image_url VARCHAR(500) DEFAULT NULL AFTER content_ar;
