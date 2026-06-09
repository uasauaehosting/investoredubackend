-- Add authority_id and category_id columns to reading_materials table
ALTER TABLE reading_materials 
ADD COLUMN authority_id INT NULL,
ADD COLUMN category_id INT NULL;

-- Add foreign key constraints if authorities and categories tables exist
-- (Optional - uncomment if you want to enforce referential integrity)
-- ALTER TABLE reading_materials 
-- ADD CONSTRAINT fk_reading_material_authority 
-- FOREIGN KEY (authority_id) REFERENCES authorities(id) ON DELETE SET NULL;

-- ALTER TABLE reading_materials 
-- ADD CONSTRAINT fk_reading_material_category 
-- FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
