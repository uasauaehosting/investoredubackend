import { executeQuery, executeSingleQuery, executeInsert, executeUpdate } from '../utils/database';

export interface IGlossaryTerm {
  id?: number;
  term: string;
  definition: string;
  category: 'Basic Concepts' | 'Investment Management' | 'Risk Management' | 'Corporate Finance' | 'Market Operations' | 'Regulatory Terms';
  language: 'English' | 'Arabic' | 'French';
  arabicTerm?: string;
  arabicDefinition?: string;
  frenchTerm?: string;
  frenchDefinition?: string;
  views: number;
  downloads: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class GlossaryTermModel {
  static async create(termData: Omit<IGlossaryTerm, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { term, definition, category, language, arabicTerm, arabicDefinition, frenchTerm, frenchDefinition, views, downloads, isActive } = termData;
    const query = `
      INSERT INTO glossary_terms (term, definition, category, language, arabic_term, arabic_definition, french_term, french_definition, views, downloads, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await executeInsert(query, [term, definition, category, language, arabicTerm, arabicDefinition, frenchTerm, frenchDefinition, views, downloads, isActive]);
  }

  static async findAll(): Promise<IGlossaryTerm[]> {
    const query = 'SELECT * FROM glossary_terms WHERE is_active = true ORDER BY term ASC';
    const results = await executeQuery<any>(query);
    return results.map(result => ({
      id: result.id,
      term: result.term,
      definition: result.definition,
      category: result.category,
      language: result.language,
      arabicTerm: result.arabic_term,
      arabicDefinition: result.arabic_definition,
      frenchTerm: result.french_term,
      frenchDefinition: result.french_definition,
      views: result.views,
      downloads: result.downloads,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async findById(id: number): Promise<IGlossaryTerm | null> {
    const query = 'SELECT * FROM glossary_terms WHERE id = ? AND is_active = true';
    const result = await executeSingleQuery<any>(query, [id]);
    if (result) {
      return {
        id: result.id,
        term: result.term,
        definition: result.definition,
        category: result.category,
        language: result.language,
        arabicTerm: result.arabic_term,
        arabicDefinition: result.arabic_definition,
        frenchTerm: result.french_term,
        frenchDefinition: result.french_definition,
        views: result.views,
        downloads: result.downloads,
        isActive: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    }
    return null;
  }

  static async findByCategory(category: string): Promise<IGlossaryTerm[]> {
    const query = 'SELECT * FROM glossary_terms WHERE category = ? AND is_active = true ORDER BY term ASC';
    const results = await executeQuery<any>(query, [category]);
    return results.map(result => ({
      id: result.id,
      term: result.term,
      definition: result.definition,
      category: result.category,
      language: result.language,
      arabicTerm: result.arabic_term,
      arabicDefinition: result.arabic_definition,
      frenchTerm: result.french_term,
      frenchDefinition: result.french_definition,
      views: result.views,
      downloads: result.downloads,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async findByLanguage(language: string): Promise<IGlossaryTerm[]> {
    const query = 'SELECT * FROM glossary_terms WHERE language = ? AND is_active = true ORDER BY term ASC';
    const results = await executeQuery<any>(query, [language]);
    return results.map(result => ({
      id: result.id,
      term: result.term,
      definition: result.definition,
      category: result.category,
      language: result.language,
      arabicTerm: result.arabic_term,
      arabicDefinition: result.arabic_definition,
      frenchTerm: result.french_term,
      frenchDefinition: result.french_definition,
      views: result.views,
      downloads: result.downloads,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async search(searchTerm: string): Promise<IGlossaryTerm[]> {
    const query = 'SELECT * FROM glossary_terms WHERE (term LIKE ? OR definition LIKE ?) AND is_active = true ORDER BY term ASC';
    const searchPattern = `%${searchTerm}%`;
    const results = await executeQuery<any>(query, [searchPattern, searchPattern]);
    return results.map(result => ({
      id: result.id,
      term: result.term,
      definition: result.definition,
      category: result.category,
      language: result.language,
      arabicTerm: result.arabic_term,
      arabicDefinition: result.arabic_definition,
      frenchTerm: result.french_term,
      frenchDefinition: result.french_definition,
      views: result.views,
      downloads: result.downloads,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async update(id: number, updateData: Partial<IGlossaryTerm>): Promise<boolean> {
    const { term, definition, category, language, arabicTerm, arabicDefinition, frenchTerm, frenchDefinition, views, downloads, isActive } = updateData;
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (term !== undefined) {
      updateFields.push('term = ?');
      updateValues.push(term);
    }
    if (definition !== undefined) {
      updateFields.push('definition = ?');
      updateValues.push(definition);
    }
    if (category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(category);
    }
    if (language !== undefined) {
      updateFields.push('language = ?');
      updateValues.push(language);
    }
    if (arabicTerm !== undefined) {
      updateFields.push('arabic_term = ?');
      updateValues.push(arabicTerm);
    }
    if (arabicDefinition !== undefined) {
      updateFields.push('arabic_definition = ?');
      updateValues.push(arabicDefinition);
    }
    if (frenchTerm !== undefined) {
      updateFields.push('french_term = ?');
      updateValues.push(frenchTerm);
    }
    if (frenchDefinition !== undefined) {
      updateFields.push('french_definition = ?');
      updateValues.push(frenchDefinition);
    }
    if (views !== undefined) {
      updateFields.push('views = ?');
      updateValues.push(views);
    }
    if (downloads !== undefined) {
      updateFields.push('downloads = ?');
      updateValues.push(downloads);
    }
    if (isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(isActive);
    }

    if (updateFields.length === 0) return false;

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const query = `UPDATE glossary_terms SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }

  static async incrementViews(id: number): Promise<boolean> {
    const query = 'UPDATE glossary_terms SET views = views + 1 WHERE id = ? AND is_active = true';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }

  static async incrementDownloads(id: number): Promise<boolean> {
    const query = 'UPDATE glossary_terms SET downloads = downloads + 1 WHERE id = ? AND is_active = true';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'UPDATE glossary_terms SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }
}

export { GlossaryTermModel as GlossaryTerm };
