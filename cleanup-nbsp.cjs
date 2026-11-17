/**
 * One-time script: replace &nbsp; with regular spaces in HTML content fields.
 * Runs against the production database using .env credentials.
 *
 * Usage: node cleanup-nbsp.cjs
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     parseInt(process.env.DB_PORT || '3306', 10),
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl:      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });

  console.log('Connected to database:', process.env.DB_NAME);

  // Tables and their HTML content columns to sanitize
  const targets = [
    { table: 'principles',         columns: ['content', 'content_ar'] },
    { table: 'education_content',  columns: ['content', 'content_ar'] },
    { table: 'publications',       columns: ['content', 'content_ar'] },
    { table: 'news',               columns: ['content', 'content_ar', 'full_content', 'full_content_ar'] },
    { table: 'frameworks',         columns: ['content', 'content_ar', 'description', 'description_ar'] },
    { table: 'about_sections',     columns: ['content', 'content_ar'] },
  ];

  let totalFixed = 0;

  for (const { table, columns } of targets) {
    // Check table exists
    const [tables] = await conn.execute(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
      [process.env.DB_NAME, table]
    );
    if (tables.length === 0) {
      console.log(`  Skipping ${table} (table not found)`);
      continue;
    }

    for (const col of columns) {
      // Check column exists
      const [cols] = await conn.execute(
        `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        [process.env.DB_NAME, table, col]
      );
      if (cols.length === 0) {
        console.log(`  Skipping ${table}.${col} (column not found)`);
        continue;
      }

      // Count affected rows
      const [countRows] = await conn.execute(
        `SELECT COUNT(*) as cnt FROM \`${table}\` WHERE \`${col}\` LIKE '%&nbsp;%'`
      );
      const count = countRows[0].cnt;

      if (count === 0) {
        console.log(`  ${table}.${col}: no &nbsp; found`);
        continue;
      }

      // Replace &nbsp; with a regular space
      const [result] = await conn.execute(
        `UPDATE \`${table}\` SET \`${col}\` = REPLACE(\`${col}\`, '&nbsp;', ' ') WHERE \`${col}\` LIKE '%&nbsp;%'`
      );
      console.log(`  ✔ ${table}.${col}: fixed ${result.affectedRows} rows`);
      totalFixed += result.affectedRows;
    }
  }

  console.log(`\nDone. Total rows updated: ${totalFixed}`);
  await conn.end();
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
