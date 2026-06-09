import { executeQuery, executeSingleQuery, executeInsert, executeUpdate } from '../utils/database';

export interface IBenchmarkingRecord {
  id?: number;
  authorityName: string;
  year: string;
  indicator: string | null;
  value: string | null;
  data: Record<string, unknown> | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

function mapRow(row: any): IBenchmarkingRecord {
  const data = row.data
    ? (typeof row.data === 'string' ? JSON.parse(row.data) : row.data)
    : null;
  return {
    id: row.id,
    authorityName: row.authority_name,
    year: row.year,
    indicator: row.indicator,
    value: row.value,
    data,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class BenchmarkingModel {
  static async create(data: Omit<IBenchmarkingRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const query = `
      INSERT INTO benchmarking_records (authority_name, year, indicator, value, data, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    return executeInsert(query, [
      data.authorityName, data.year, data.indicator, data.value,
      data.data ? JSON.stringify(data.data) : null,
      data.isActive !== false,
    ]);
  }

  static async findAll(filters?: { years?: string[]; authority?: string }): Promise<IBenchmarkingRecord[]> {
    let query = 'SELECT * FROM benchmarking_records WHERE is_active = true';
    const params: any[] = [];

    if (filters?.years?.length) {
      const placeholders = filters.years.map(() => '?').join(', ');
      query += ` AND year IN (${placeholders})`;
      params.push(...filters.years);
    }
    if (filters?.authority) {
      query += ' AND authority_name = ?';
      params.push(filters.authority);
    }

    query += ' ORDER BY year DESC, authority_name ASC';
    const results = await executeQuery<any>(query, params);
    return results.map(mapRow);
  }

  static async findById(id: number): Promise<IBenchmarkingRecord | null> {
    const result = await executeSingleQuery<any>(
      'SELECT * FROM benchmarking_records WHERE id = ? AND is_active = true',
      [id],
    );
    return result ? mapRow(result) : null;
  }

  static async update(id: number, data: Partial<IBenchmarkingRecord>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.authorityName !== undefined) { fields.push('authority_name = ?'); values.push(data.authorityName); }
    if (data.year !== undefined) { fields.push('year = ?'); values.push(data.year); }
    if (data.indicator !== undefined) { fields.push('indicator = ?'); values.push(data.indicator); }
    if (data.value !== undefined) { fields.push('value = ?'); values.push(data.value); }
    if (data.data !== undefined) { fields.push('data = ?'); values.push(data.data ? JSON.stringify(data.data) : null); }
    if (data.isActive !== undefined) { fields.push('is_active = ?'); values.push(data.isActive); }

    if (fields.length === 0) return false;
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await executeUpdate(`UPDATE benchmarking_records SET ${fields.join(', ')} WHERE id = ?`, values);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await executeUpdate(
      'UPDATE benchmarking_records SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id],
    );
    return result > 0;
  }

  static async getFilterOptions(): Promise<{ years: string[]; authorities: string[] }> {
    const years = await executeQuery<{ year: string }>(
      'SELECT DISTINCT year FROM benchmarking_records WHERE is_active = true ORDER BY year DESC',
    );
    const authorities = await executeQuery<{ authority_name: string }>(
      'SELECT DISTINCT authority_name FROM benchmarking_records WHERE is_active = true ORDER BY authority_name ASC',
    );
    return {
      years: years.map((r) => r.year),
      authorities: authorities.map((r) => r.authority_name),
    };
  }
}

export { BenchmarkingModel as Benchmarking };
