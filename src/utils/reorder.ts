import { executeUpdate } from './database';

type ReorderResourceConfig = {
  table: string;
  orderColumn: string;
  scopeColumn?: string;
};

export const REORDER_RESOURCES = {
  news: { table: 'news', orderColumn: 'display_order' },
  slides: { table: 'slides', orderColumn: 'display_order' },
  members: { table: 'members', orderColumn: 'display_order' },
  'education-content': { table: 'education_content', orderColumn: 'display_order', scopeColumn: 'section' },
  principles: { table: 'principles', orderColumn: 'display_order' },
  frameworks: { table: 'frameworks', orderColumn: 'display_order' },
  'investment-products': { table: 'investment_products', orderColumn: 'display_order' },
  publications: { table: 'publications', orderColumn: 'display_order' },
  programs: { table: 'programs', orderColumn: 'display_order' },
  portals: { table: 'portals', orderColumn: 'display_order' },
  'alerts-bulletins': { table: 'alerts_bulletins', orderColumn: 'display_order' },
  'about-sections': { table: 'about_sections', orderColumn: '`order`' },
  glossary: { table: 'glossary_terms', orderColumn: 'display_order' },
  benchmarking: { table: 'benchmarking_records', orderColumn: 'display_order' },
  'global-policy-areas': { table: 'global_policy_areas', orderColumn: 'display_order' },
  'member-strategies-projects': { table: 'member_strategies_projects', orderColumn: 'display_order' },
} satisfies Record<string, ReorderResourceConfig>;

export type ReorderResource = keyof typeof REORDER_RESOURCES;

export function isReorderResource(value: string): value is ReorderResource {
  return value in REORDER_RESOURCES;
}

export async function reorderRecords(
  resource: ReorderResource,
  ids: number[],
  scope?: string,
): Promise<void> {
  const config = REORDER_RESOURCES[resource];

  for (let i = 0; i < ids.length; i++) {
    let query = `UPDATE ${config.table} SET ${config.orderColumn} = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const values: (string | number)[] = [i + 1, ids[i]];

    const scopeColumn = 'scopeColumn' in config ? config.scopeColumn : undefined;
    if (scopeColumn) {
      if (!scope) {
        throw new Error(`Scope is required for resource: ${resource}`);
      }
      query += ` AND ${scopeColumn} = ?`;
      values.push(scope);
    }

    await executeUpdate(query, values);
  }
}
