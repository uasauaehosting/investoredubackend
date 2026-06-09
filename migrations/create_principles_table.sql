-- Create principles table
CREATE TABLE IF NOT EXISTS principles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  author VARCHAR(255) DEFAULT '',
  date DATE NOT NULL,
  file_url VARCHAR(500) DEFAULT '',
  image_url VARCHAR(500) DEFAULT '',
  content TEXT,
  authority_id INT NULL,
  category_id INT NULL,
  views INT DEFAULT 0,
  downloads INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (authority_id) REFERENCES authorities(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_is_active (is_active),
  INDEX idx_date (date)
);
