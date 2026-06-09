-- Add full detail, image, and PDF file columns to news table
ALTER TABLE news 
ADD COLUMN fullDetail TEXT NULL;

ALTER TABLE news 
ADD COLUMN image VARCHAR(1000) NULL;

ALTER TABLE news 
ADD COLUMN pdfFile VARCHAR(1000) NULL;

-- Show the updated table structure
PRAGMA table_info(news);
