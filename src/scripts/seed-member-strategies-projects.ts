/**
 * Seeds member strategies & projects from legacy UASA website data.
 * Run: npx ts-node src/scripts/seed-member-strategies-projects.ts
 */
import 'dotenv/config';
import { initConnection, executeQuery } from '../utils/database';
import { MEMBER_STRATEGIES_PROJECTS_SEED_DATA } from '../data/memberStrategiesProjectsSeed';

async function ensureSchema() {
  const cols = await executeQuery<{ Field: string }>(
    "SHOW COLUMNS FROM member_strategies_projects LIKE 'authority_name'",
  );
  if (cols.length === 0) {
    await executeQuery(
      'ALTER TABLE member_strategies_projects ADD COLUMN authority_name VARCHAR(255) NULL AFTER member_id',
    );
  }

  const fileCols = await executeQuery<{ Field: string }>(
    "SHOW COLUMNS FROM member_strategies_projects LIKE 'file_url'",
  );
  if (fileCols.length === 0) {
    await executeQuery(
      'ALTER TABLE member_strategies_projects ADD COLUMN file_url VARCHAR(1000) NULL AFTER description',
    );
  }

  await executeQuery(
    'ALTER TABLE member_strategies_projects MODIFY member_id INT NULL',
  );
}

async function main() {
  await initConnection();
  await ensureSchema();

  await executeQuery('DELETE FROM member_strategies_projects');

  for (const row of MEMBER_STRATEGIES_PROJECTS_SEED_DATA) {
    await executeQuery(
      `INSERT INTO member_strategies_projects
        (title, description, authority_name, type, status, file_url, is_active)
       VALUES (?, ?, ?, ?, 'Active', ?, true)`,
      [row.title, row.description, row.authority_name, row.type, row.file_url],
    );
  }

  console.log(`✅ Seeded ${MEMBER_STRATEGIES_PROJECTS_SEED_DATA.length} member strategies & projects`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
