-- Manual sort order for homepage news cards
ALTER TABLE news ADD COLUMN display_order INT NOT NULL DEFAULT 0;

SET @row := 0;
UPDATE news SET display_order = (@row := @row + 1) ORDER BY date DESC, id DESC;
