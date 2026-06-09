/**
 * Seeds publications from legacy UASA website data.
 * Run: npx ts-node src/scripts/seed-publications.ts
 */
import 'dotenv/config';
import { initConnection, executeQuery } from '../utils/database';
import { PublicationsModel } from '../models/Publications';
import { PUBLICATIONS_SEED_DATA } from '../data/publicationsSeed';

async function main() {
  await initConnection();

  await executeQuery('DROP TABLE IF EXISTS publications');
  await executeQuery(`
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

  for (const row of PUBLICATIONS_SEED_DATA) {
    await PublicationsModel.create({
      title: row.title,
      description: row.description,
      authority_name: row.authority_name,
      category: row.category,
      file_url: row.file_url,
      is_active: true,
    });
  }

  console.log(`✅ Seeded ${PUBLICATIONS_SEED_DATA.length} publications`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
