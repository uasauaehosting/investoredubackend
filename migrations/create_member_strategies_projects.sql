-- Create member_strategies_projects table
CREATE TABLE IF NOT EXISTS member_strategies_projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  member_id INT NOT NULL,
  category_id INT NOT NULL,
  date DATE NOT NULL,
  file_url VARCHAR(500),
  views INT DEFAULT 0,
  downloads INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  INDEX idx_member_id (member_id),
  INDEX idx_category_id (category_id),
  INDEX idx_is_active (is_active),
  INDEX idx_date (date)
);
