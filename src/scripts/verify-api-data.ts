/**
 * Smoke-test key API data endpoints and admin login.
 * Run: npx ts-node src/scripts/verify-api-data.ts
 */
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { initConnection, executeQuery } from '../utils/database';
import { AdminModel } from '../models/Admin';

async function main() {
  await initConnection();
  let passed = 0;
  let failed = 0;

  const checks: { name: string; ok: boolean; detail: string }[] = [];

  const count = async (table: string, min: number) => {
    const rows = await executeQuery<{ cnt: number }>(`SELECT COUNT(*) AS cnt FROM \`${table}\``);
    const n = rows[0]?.cnt ?? 0;
    return { ok: n >= min, detail: `${n} rows (min ${min})` };
  };

  const tableChecks: [string, number][] = [
    ['site_content', 9],
    ['glossary_terms', 100],
    ['news', 1],
    ['members', 1],
    ['publications', 1],
    ['education_content', 6],
    ['global_policy_areas', 1],
    ['investment_products', 1],
    ['portals', 1],
  ];

  for (const [table, min] of tableChecks) {
    const result = await count(table, min);
    checks.push({ name: table, ...result });
  }

  const admin = await AdminModel.findByUsername('admin');
  if (admin) {
    const valid = await AdminModel.comparePassword('admin123', admin.password);
    checks.push({ name: 'admin login (admin/admin123)', ok: valid, detail: valid ? 'password valid' : 'password mismatch' });
    if (process.env.JWT_SECRET) {
      const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      checks.push({ name: 'JWT generation', ok: !!token, detail: token ? 'token created' : 'failed' });
    }
  } else {
    checks.push({ name: 'admin login', ok: false, detail: 'admin user not found' });
  }

  console.log('API data verification\n');
  for (const c of checks) {
    const icon = c.ok ? '✓' : '✗';
    console.log(`${icon} ${c.name}: ${c.detail}`);
    if (c.ok) passed++;
    else failed++;
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
