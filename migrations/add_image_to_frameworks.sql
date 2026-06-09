-- Add image field to frameworks table
ALTER TABLE frameworks ADD COLUMN image_url VARCHAR(500) DEFAULT '' AFTER file_url;
