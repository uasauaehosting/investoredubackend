"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const database_1 = require("../utils/database");
const Publications_1 = require("../models/Publications");
const publicationsSeed_1 = require("../data/publicationsSeed");
async function main() {
    await (0, database_1.initConnection)();
    await (0, database_1.executeQuery)('DROP TABLE IF EXISTS publications');
    await (0, database_1.executeQuery)(`
    CREATE TABLE publications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      description TEXT,
      authority_name VARCHAR(255) NOT NULL,
      category ENUM('Brochure', 'Code', 'General', 'Guide', 'Others', 'Report', 'Study') NOT NULL,
      file_url VARCHAR(1000),
      date_published DATE,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_authority (authority_name),
      INDEX idx_category (category),
      INDEX idx_active (is_active),
      INDEX idx_date_published (date_published)
    )
  `);
    for (const row of publicationsSeed_1.PUBLICATIONS_SEED_DATA) {
        await Publications_1.PublicationsModel.create({
            title: row.title,
            description: row.description,
            authority_name: row.authority_name,
            category: row.category,
            file_url: row.file_url,
            is_active: true,
        });
    }
    console.log(`✅ Seeded ${publicationsSeed_1.PUBLICATIONS_SEED_DATA.length} publications`);
    process.exit(0);
}
main().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed-publications.js.map