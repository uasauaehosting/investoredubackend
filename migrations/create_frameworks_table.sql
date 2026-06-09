-- Create frameworks table
CREATE TABLE frameworks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  author VARCHAR(255) DEFAULT '',
  date DATE NOT NULL,
  file_url VARCHAR(500) DEFAULT '',
  content TEXT DEFAULT '',
  authority_id INT NULL,
  category_id INT NULL,
  views INT DEFAULT 0,
  downloads INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_frameworks_active (is_active),
  INDEX idx_frameworks_date (date),
  INDEX idx_frameworks_authority (authority_id),
  INDEX idx_frameworks_category (category_id)
);

-- Add foreign key constraints (optional - uncomment if authorities and categories tables exist)
-- ALTER TABLE frameworks 
-- ADD CONSTRAINT fk_framework_authority 
-- FOREIGN KEY (authority_id) REFERENCES authorities(id) ON DELETE SET NULL;

-- ALTER TABLE frameworks 
-- ADD CONSTRAINT fk_framework_category 
-- FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
