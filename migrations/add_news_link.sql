-- Add link column to news table
ALTER TABLE news 
ADD COLUMN link VARCHAR(500) NULL AFTER excerpt;
