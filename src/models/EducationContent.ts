import { executeQuery, executeSingleQuery, executeInsert, executeUpdate } from '../utils/database';

export interface IEducationContent {
  id?: number;
  section: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  imageUrl: string | null;
  content: string | null;
  contentAr?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

function mapRow(row: any): IEducationContent {
  return {
    id: row.id,
    section: row.section,
    title: row.title,
    titleAr: row.title_ar,
    description: row.description,
    descriptionAr: row.description_ar,
    imageUrl: row.image_url,
    content: row.content,
    contentAr: row.content_ar,
    displayOrder: row.display_order,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class EducationContentModel {
  static async create(data: Omit<IEducationContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const query = `
      INSERT INTO education_content (section, title, title_ar, description, description_ar, image_url, content, content_ar, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return executeInsert(query, [
      data.section, data.title, data.titleAr ?? null, data.description, data.descriptionAr ?? null,
      data.imageUrl, data.content, data.contentAr ?? null, data.displayOrder,
      data.isActive !== false,
    ]);
  }

  static async findBySection(section: string, activeOnly = true): Promise<IEducationContent[]> {
    let query = 'SELECT * FROM education_content WHERE section = ?';
    const params: any[] = [section];
    if (activeOnly) {
      query += ' AND is_active = true';
    }
    query += ' ORDER BY display_order ASC, id ASC';
    const results = await executeQuery<any>(query, params);
    return results.map(mapRow);
  }

  static async findAllAdmin(section?: string): Promise<IEducationContent[]> {
    let query = 'SELECT * FROM education_content WHERE 1=1';
    const params: any[] = [];
    if (section) {
      query += ' AND section = ?';
      params.push(section);
    }
    query += ' ORDER BY section ASC, display_order ASC, id ASC';
    const results = await executeQuery<any>(query, params);
    return results.map(mapRow);
  }

  static async findById(id: number, activeOnly = true): Promise<IEducationContent | null> {
    let query = 'SELECT * FROM education_content WHERE id = ?';
    if (activeOnly) query += ' AND is_active = true';
    const result = await executeSingleQuery<any>(query, [id]);
    return result ? mapRow(result) : null;
  }

  static async update(id: number, data: Partial<IEducationContent>): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.section !== undefined) { fields.push('section = ?'); values.push(data.section); }
    if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
    if (data.titleAr !== undefined) { fields.push('title_ar = ?'); values.push(data.titleAr); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.descriptionAr !== undefined) { fields.push('description_ar = ?'); values.push(data.descriptionAr); }
    if (data.imageUrl !== undefined) { fields.push('image_url = ?'); values.push(data.imageUrl); }
    if (data.content !== undefined) { fields.push('content = ?'); values.push(data.content); }
    if (data.contentAr !== undefined) { fields.push('content_ar = ?'); values.push(data.contentAr); }
    if (data.displayOrder !== undefined) { fields.push('display_order = ?'); values.push(data.displayOrder); }
    if (data.isActive !== undefined) { fields.push('is_active = ?'); values.push(data.isActive); }

    if (fields.length === 0) return false;
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await executeUpdate(`UPDATE education_content SET ${fields.join(', ')} WHERE id = ?`, values);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await executeUpdate(
      'UPDATE education_content SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id],
    );
    return result > 0;
  }
}

export { EducationContentModel as EducationContent };
