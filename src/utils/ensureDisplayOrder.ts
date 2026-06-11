import { executeQuery } from './database';

type TableConfig = {
  table: string;
  backfillOrder: string;
};

const DISPLAY_ORDER_TABLES: TableConfig[] = [
  { table: 'news', backfillOrder: 'date DESC, id DESC' },
  { table: 'slides', backfillOrder: 'id ASC' },
  { table: 'members', backfillOrder: 'created_at DESC, id DESC' },
  { table: 'principles', backfillOrder: 'date DESC, id DESC' },
  { table: 'frameworks', backfillOrder: 'date DESC, id DESC' },
  { table: 'investment_products', backfillOrder: 'date DESC, id DESC' },
  { table: 'publications', backfillOrder: 'date_published DESC, id DESC' },
  { table: 'programs', backfillOrder: 'created_at DESC, id DESC' },
  { table: 'glossary_terms', backfillOrder: 'term ASC, id ASC' },
  { table: 'benchmarking_records', backfillOrder: 'year DESC, authority_name ASC, id DESC' },
  { table: 'global_policy_areas', backfillOrder: 'date_published DESC, id DESC' },
  { table: 'member_strategies_projects', backfillOrder: 'authority_name ASC, title ASC, id ASC' },
  { table: 'alerts_bulletins', backfillOrder: 'date_published DESC, id DESC' },
  { table: 'education_content', backfillOrder: 'section ASC, id ASC' },
  { table: 'portals', backfillOrder: 'created_at DESC, id DESC' },
  { table: 'footer_stats', backfillOrder: 'id ASC' },
];

async function hasColumn(table: string, column: string): Promise<boolean> {
  const rows = await executeQuery<{ cnt: number }>(
    `SELECT COUNT(*) AS cnt
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [table, column],
  );
  return Number(rows[0]?.cnt ?? 0) > 0;
}

async function tableExists(table: string): Promise<boolean> {
  const rows = await executeQuery<{ cnt: number }>(
    `SELECT COUNT(*) AS cnt
     FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?`,
    [table],
  );
  return Number(rows[0]?.cnt ?? 0) > 0;
}

async function backfillDisplayOrder(table: string, orderBy: string): Promise<void> {
  await executeQuery('SET @row := 0');
  await executeQuery(
    `UPDATE ${table} SET display_order = (@row := @row + 1) ORDER BY ${orderBy}`,
  );
}

/** Ensure display_order exists on sortable tables (safe to run on every startup). */
export async function ensureDisplayOrderColumns(): Promise<void> {
  for (const { table, backfillOrder } of DISPLAY_ORDER_TABLES) {
    if (!(await tableExists(table))) {
      continue;
    }

    if (await hasColumn(table, 'display_order')) {
      continue;
    }

    console.log(`Adding display_order column to ${table}...`);
    await executeQuery(
      `ALTER TABLE ${table} ADD COLUMN display_order INT NOT NULL DEFAULT 0`,
    );
    await backfillDisplayOrder(table, backfillOrder);
    console.log(`✓ ${table}.display_order ready`);
  }
}
