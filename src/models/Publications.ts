import { executeQuery, executeSingleQuery, executeInsert, executeUpdate } from '../utils/database';

export type PublicationCategory =
  | 'Brochure'
  | 'Code'
  | 'General'
  | 'Guide'
  | 'Others'
  | 'Report'
  | 'Study';

export interface Publication {
  id: number;
  title: string;
  title_ar?: string | null;
  description: string | null;
  description_ar?: string | null;
  authority_name: string;
  category: PublicationCategory;
  file_url: string | null;
  date_published: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicationFilters {
  authorities?: string[];
  categories?: string[];
  /** Omit for active-only (public default). `null` returns all records (admin). */
  is_active?: boolean | null;
}

export class PublicationsModel {
  static async getAll(filters: PublicationFilters = {}): Promise<Publication[]> {
    let query = `
      SELECT
        id, title, title_ar, description, description_ar, authority_name, category, file_url,
        DATE_FORMAT(date_published, '%Y-%m-%d') as date_published,
        is_active,
        DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.000Z') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.000Z') as updated_at
      FROM publications
      WHERE 1=1
    `;
    const params: unknown[] = [];

    if (filters.is_active === null) {
      // Admin view: include active and inactive records.
    } else if (filters.is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.is_active);
    } else {
      query += ' AND is_active = true';
    }

    if (filters.authorities && filters.authorities.length > 0) {
      const placeholders = filters.authorities.map(() => '?').join(', ');
      query += ` AND authority_name IN (${placeholders})`;
      params.push(...filters.authorities);
    }

    if (filters.categories && filters.categories.length > 0) {
      const placeholders = filters.categories.map(() => '?').join(', ');
      query += ` AND category IN (${placeholders})`;
      params.push(...filters.categories);
    }

    query += ' ORDER BY date_published DESC, created_at DESC';

    return executeQuery<Publication>(query, params);
  }

  static async getById(id: number): Promise<Publication | null> {
    const query = `
      SELECT
        id, title, title_ar, description, description_ar, authority_name, category, file_url,
        DATE_FORMAT(date_published, '%Y-%m-%d') as date_published,
        is_active,
        DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.000Z') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.000Z') as updated_at
      FROM publications
      WHERE id = ?
    `;
    return executeSingleQuery<Publication>(query, [id]);
  }

  static async create(data: {
    title: string;
    title_ar?: string | null;
    description?: string | null;
    description_ar?: string | null;
    authority_name: string;
    category: PublicationCategory;
    file_url?: string | null;
    date_published?: string | null;
    is_active?: boolean;
  }): Promise<Publication | null> {
    const query = `
      INSERT INTO publications (title, title_ar, description, description_ar, authority_name, category, file_url, date_published, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const insertId = await executeInsert(query, [
      data.title,
      data.title_ar ?? null,
      data.description ?? null,
      data.description_ar ?? null,
      data.authority_name,
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
      title_ar: string | null;
      description: string | null;
      description_ar: string | null;
      authority_name: string;
      category: PublicationCategory;
      file_url: string | null;
      date_published: string | null;
      is_active: boolean;
    }>,
  ): Promise<Publication | null> {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (data.title !== undefined) {
      fields.push('title = ?');
      params.push(data.title);
    }
    if (data.title_ar !== undefined) {
      fields.push('title_ar = ?');
      params.push(data.title_ar);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      params.push(data.description);
    }
    if (data.description_ar !== undefined) {
      fields.push('description_ar = ?');
      params.push(data.description_ar);
    }
    if (data.authority_name !== undefined) {
      fields.push('authority_name = ?');
      params.push(data.authority_name);
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

    await executeUpdate(`UPDATE publications SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.getById(id);
  }

  static async softDelete(id: number): Promise<boolean> {
    const affected = await executeUpdate(
      'UPDATE publications SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id],
    );
    return affected > 0;
  }
}

export default PublicationsModel;
