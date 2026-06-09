-- Add missing columns to news table
ALTER TABLE news 
ADD COLUMN excerpt TEXT NULL,
ADD COLUMN link VARCHAR(500) NULL;
