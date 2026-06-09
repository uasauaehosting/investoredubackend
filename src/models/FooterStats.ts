import { executeQuery, executeInsert, executeUpdate } from '../utils/database';

export interface IFooterStat {
  id?: number;
  label: string;
  value: string;
  displayOrder: number;
  isActive: boolean;
}

function mapRow(row: any): IFooterStat {
  return {
    id: row.id,
    label: row.label,
    value: row.value,
    displayOrder: row.display_order,
    isActive: row.is_active,
  };
}

export class FooterStatsModel {
  static async findAll(): Promise<IFooterStat[]> {
    const results = await executeQuery<any>(
      'SELECT * FROM footer_stats WHERE is_active = true ORDER BY display_order ASC',
    );
    return results.map(mapRow);
  }

  static async upsertAll(stats: Omit<IFooterStat, 'id'>[]): Promise<void> {
    await executeUpdate('UPDATE footer_stats SET is_active = false', []);
    for (const stat of stats) {
      await executeInsert(
        'INSERT INTO footer_stats (label, value, display_order, is_active) VALUES (?, ?, ?, ?)',
        [stat.label, stat.value, stat.displayOrder, true],
      );
    }
  }

  static async update(id: number, data: Partial<IFooterStat>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];
    if (data.label !== undefined) { fields.push('label = ?'); values.push(data.label); }
    if (data.value !== undefined) { fields.push('value = ?'); values.push(data.value); }
    if (data.displayOrder !== undefined) { fields.push('display_order = ?'); values.push(data.displayOrder); }
    if (data.isActive !== undefined) { fields.push('is_active = ?'); values.push(data.isActive); }
    if (fields.length === 0) return false;
    values.push(id);
    const result = await executeUpdate(`UPDATE footer_stats SET ${fields.join(', ')} WHERE id = ?`, values);
    return result > 0;
  }
}

export { FooterStatsModel as FooterStats };
