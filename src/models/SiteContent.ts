import { executeQuery, executeSingleQuery, executeInsert, executeUpdate } from '../utils/database';

export interface ISiteContent {
  id?: number;
  contentKey: string;
  content: Record<string, unknown>;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

function mapRow(row: any): ISiteContent {
  const content = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
  return {
    id: row.id,
    contentKey: row.content_key,
    content,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class SiteContentModel {
  static async upsert(key: string, content: Record<string, unknown>): Promise<number> {
    const existing = await this.findByKey(key, false);
    if (existing?.id) {
      await this.update(existing.id, { content });
      return existing.id;
    }
    return this.create({ contentKey: key, content, isActive: true });
  }

  static async create(data: Omit<ISiteContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const query = `INSERT INTO site_content (content_key, content, is_active) VALUES (?, ?, ?)`;
    return executeInsert(query, [data.contentKey, JSON.stringify(data.content), data.isActive !== false]);
  }

  static async findAll(): Promise<ISiteContent[]> {
    const results = await executeQuery<any>('SELECT * FROM site_content WHERE is_active = true ORDER BY content_key');
    return results.map(mapRow);
  }

  static async findByKey(key: string, activeOnly = true): Promise<ISiteContent | null> {
    let query = 'SELECT * FROM site_content WHERE content_key = ?';
    if (activeOnly) query += ' AND is_active = true';
    const result = await executeSingleQuery<any>(query, [key]);
    return result ? mapRow(result) : null;
  }

  static async update(id: number, data: Partial<ISiteContent>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.contentKey !== undefined) { fields.push('content_key = ?'); values.push(data.contentKey); }
    if (data.content !== undefined) { fields.push('content = ?'); values.push(JSON.stringify(data.content)); }
    if (data.isActive !== undefined) { fields.push('is_active = ?'); values.push(data.isActive); }

    if (fields.length === 0) return false;
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await executeUpdate(`UPDATE site_content SET ${fields.join(', ')} WHERE id = ?`, values);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await executeUpdate(
      'UPDATE site_content SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id],
    );
    return result > 0;
  }
}

export { SiteContentModel as SiteContent };
