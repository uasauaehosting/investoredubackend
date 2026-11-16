-- Add Arabic portal image column to portals table (falls back to image_url when empty)
ALTER TABLE portals
  ADD COLUMN image_ar VARCHAR(1000) DEFAULT NULL AFTER image_url;
