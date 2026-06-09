-- Complete news table migration
-- This script adds the missing 'link' column to the news table

-- Add link column to news table
ALTER TABLE news 
ADD COLUMN link VARCHAR(500) NULL AFTER excerpt;

-- Update existing records to have a default link value (optional)
UPDATE news SET link = '#' WHERE link IS NULL;

-- Show the updated table structure
DESCRIBE news;
