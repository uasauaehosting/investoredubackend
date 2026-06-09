/**
 * Seeds global policy areas from legacy UASA website data.
 * Run: npx ts-node src/scripts/seed-global-policy-areas.ts
 */
import 'dotenv/config';
import { initConnection, executeQuery } from '../utils/database';
import { GLOBAL_POLICY_AREAS_SEED_DATA } from '../data/globalPolicyAreasSeed';

async function main() {
  await initConnection();

  await executeQuery('DELETE FROM global_policy_areas');

  for (const row of GLOBAL_POLICY_AREAS_SEED_DATA) {
    await executeQuery(
      `INSERT INTO global_policy_areas
        (title, description, institution, category, file_url, is_active)
       VALUES (?, ?, ?, ?, ?, true)`,
      [row.title, row.description, row.institution, row.category, row.file_url],
    );
  }

  console.log(`✅ Seeded ${GLOBAL_POLICY_AREAS_SEED_DATA.length} global policy areas`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
