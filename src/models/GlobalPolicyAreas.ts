import { executeQuery, executeSingleQuery, executeInsert, executeUpdate } from '../utils/database';

export type PolicyInstitution = 'OECD' | 'Alliance For Financial Inclusion' | 'Others';

export type PolicyCategory =
  | 'Consumer Empowerment and Market Conduct'
  | 'Digital Financial Services'
  | 'Emerging Financial Inclusion Areas'
  | 'Financial Inclusion Strategy'
  | 'Integrity and Stability'
  | 'Measuring Financial Inclusion'
  | 'Others'
  | 'Report'
  | 'SME Finance';

export interface GlobalPolicyArea {
  id: number;
  title: string;
  description: string | null;
  institution: string;
  category: string;
  file_url: string | null;
  date_published: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GlobalPolicyAreaFilters {
  institutions?: string[];
  categories?: string[];
  is_active?: boolean;
}

export class GlobalPolicyAreasModel {
  static async getAll(filters: GlobalPolicyAreaFilters = {}): Promise<GlobalPolicyArea[]> {
    let query = `
      SELECT
        id, title, description, institution, category, file_url,
        DATE_FORMAT(date_published, '%Y-%m-%d') as date_published,
        is_active,
        DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.000Z') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.000Z') as updated_at
      FROM global_policy_areas
      WHERE 1=1
    `;
    const params: unknown[] = [];

    if (filters.is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.is_active);
    } else {
      query += ' AND is_active = true';
    }

    if (filters.institutions && filters.institutions.length > 0) {
      const placeholders = filters.institutions.map(() => '?').join(', ');
      query += ` AND institution IN (${placeholders})`;
      params.push(...filters.institutions);
    }

    if (filters.categories && filters.categories.length > 0) {
      const placeholders = filters.categories.map(() => '?').join(', ');
      query += ` AND category IN (${placeholders})`;
      params.push(...filters.categories);
    }

    query += ' ORDER BY date_published DESC, created_at DESC';

    return executeQuery<GlobalPolicyArea>(query, params);
  }

  static async getById(id: number): Promise<GlobalPolicyArea | null> {
    const query = `
      SELECT
        id, title, description, institution, category, file_url,
        DATE_FORMAT(date_published, '%Y-%m-%d') as date_published,
        is_active,
        DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.000Z') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.000Z') as updated_at
      FROM global_policy_areas
      WHERE id = ?
    `;
    return executeSingleQuery<GlobalPolicyArea>(query, [id]);
  }

  static async create(data: {
    title: string;
    description?: string | null;
    institution: string;
    category: string;
    file_url?: string | null;
    date_published?: string | null;
    is_active?: boolean;
  }): Promise<GlobalPolicyArea | null> {
    const query = `
      INSERT INTO global_policy_areas (title, description, institution, category, file_url, date_published, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const insertId = await executeInsert(query, [
      data.title,
      data.description ?? null,
      data.institution,
      data.category,
      data.file_url ?? null,
      data.date_published ?? null,
      data.is_active !== undefined ? data.is_active : true,
    ]);
    return this.getById(insertId);
  }

  static async update(
    id: number,
    data: Partial<{
      title: string;
      description: string | null;
      institution: string;
      category: string;
      file_url: string | null;
      date_published: string | null;
      is_active: boolean;
    }>,
  ): Promise<GlobalPolicyArea | null> {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (data.title !== undefined) {
      fields.push('title = ?');
      params.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      params.push(data.description);
    }
    if (data.institution !== undefined) {
      fields.push('institution = ?');
      params.push(data.institution);
    }
    if (data.category !== undefined) {
      fields.push('category = ?');
      params.push(data.category);
    }
    if (data.file_url !== undefined) {
      fields.push('file_url = ?');
      params.push(data.file_url);
    }
    if (data.date_published !== undefined) {
      fields.push('date_published = ?');
      params.push(data.date_published);
    }
    if (data.is_active !== undefined) {
      fields.push('is_active = ?');
      params.push(data.is_active);
    }

    if (fields.length === 0) return this.getById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await executeUpdate(`UPDATE global_policy_areas SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.getById(id);
  }

  static async softDelete(id: number): Promise<boolean> {
    const affected = await executeUpdate(
      'UPDATE global_policy_areas SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id],
    );
    return affected > 0;
  }
}

export default GlobalPolicyAreasModel;
