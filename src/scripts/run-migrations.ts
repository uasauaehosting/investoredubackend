/**
 * Run pending SQL migration files against the configured MySQL database.
 * Run: npx ts-node src/scripts/run-migrations.ts
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { executeQuery, initConnection } from '../utils/database';

const MIGRATIONS_DIR = path.resolve(__dirname, '../../migrations');

const MIGRATION_FILES = [
  'create_global_policy_areas_table.sql',
  'create_cms_tables.sql',
  'create_slides_table.sql',
];

function splitStatements(sql: string): string[] {
  const withoutBlockComments = sql.replace(/\/\*[\s\S]*?\*\//g, '');
  return withoutBlockComments
    .split(/;\s*\n/)
    .map((s) =>
      s
        .split('\n')
        .filter((line) => !line.trim().startsWith('--'))
        .join('\n')
        .trim(),
    )
    .filter((s) => s.length > 0 && !/^USE\s/i.test(s));
}

async function runFile(filename: string) {
  const filePath = path.join(MIGRATIONS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`  ⊘ ${filename} not found`);
    return;
  }

  const sql = fs.readFileSync(filePath, 'utf-8');
  const statements = splitStatements(sql);

  for (const statement of statements) {
    try {
      await executeQuery(statement);
    } catch (err: any) {
      const msg = err.message ?? String(err);
      if (
        msg.includes('Duplicate column') ||
        msg.includes('already exists') ||
        msg.includes('Duplicate entry')
      ) {
        continue;
      }
      throw err;
    }
  }
  console.log(`  ✓ ${filename} (${statements.length} statements)`);
}

async function main() {
  await initConnection();
  console.log('Running SQL migrations...\n');
  for (const file of MIGRATION_FILES) {
    await runFile(file);
  }
  console.log('\n✅ Migrations complete');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
