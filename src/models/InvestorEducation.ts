import { executeQuery, executeSingleQuery, executeInsert, executeUpdate } from '../utils/database';

export interface IAuthority {
  id?: number;
  name: string;
  nameAr?: string;
  type: 'University' | 'Hospital' | 'Government Body' | 'Research Institute' | 'Other';
  description?: string;
  descriptionAr?: string;
  website?: string;
  logo?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  id?: number;
  name: string;
  authorityId: number;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReadingMaterial {
  id?: number;
  title: string;
  description: string;
  category: 'Principles' | 'Framework' | 'Investment Products/ Literature';
  author: string;
  date: Date;
  pdfUrl: string;
  authorityId?: number;
  categoryId?: number;
  views: number;
  downloads: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFramework {
  id?: number;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  author: string;
  date: Date;
  fileUrl: string;
  imageUrl: string;
  content?: string;
  contentAr?: string;
  authorityId?: number;
  categoryId?: number;
  views: number;
  downloads: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPrinciple {
  id?: number;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  author: string;
  date: Date;
  fileUrl: string;
  imageUrl: string;
  content?: string;
  contentAr?: string;
  authorityId?: number;
  categoryId?: number;
  views: number;
  downloads: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInvestmentProduct {
  id?: number;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  author: string;
  date: Date;
  fileUrl: string;
  imageUrl: string;
  content?: string;
  contentAr?: string;
  slug?: string;
  authorityId?: number;
  categoryId?: number;
  views: number;
  downloads: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMemberActivity {
  id?: number;
  title: string;
  description: string;
  type: 'Campaign' | 'Workshop' | 'Digital Initiative' | 'Conference' | 'Training';
  organization: string;
  date: Date;
  status: 'Active' | 'Ongoing' | 'Live' | 'Completed' | 'Upcoming';
  participants: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StrategyProjectType = 'Strategy' | 'Report';

export interface IMemberStrategyProject {
  id?: number;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  authority_name: string;
  memberId?: number | null;
  type: StrategyProjectType | string;
  status?: string;
  start_date?: Date | string | null;
  end_date?: Date | string | null;
  budget?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  memberName?: string;
  categoryName?: string | null;
  fileUrl?: string | null;
  date?: Date | string | null;
}

export interface IAlertBulletin {
  id?: number;
  title: string;
  description: string;
  type: 'Alert' | 'Bulletin' | 'Notice' | 'Warning';
  priority: 'High' | 'Medium' | 'Low';
  date: Date;
  author: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Authority Model
export class AuthorityModel {
  static async create(authorityData: Omit<IAuthority, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { name, nameAr, type, description, descriptionAr, website, logo, isActive } = authorityData;
    const query = `
      INSERT INTO authorities (name, name_ar, type, description, description_ar, website, logo, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await executeInsert(query, [name, nameAr, type, description, descriptionAr, website, logo, isActive]);
  }

  static async findAll(): Promise<IAuthority[]> {
    const query = 'SELECT * FROM authorities WHERE is_active = true ORDER BY name ASC';
    const results = await executeQuery<any>(query);
    return results.map(result => ({
      id: result.id,
      name: result.name,
      nameAr: result.name_ar,
      type: result.type,
      description: result.description,
      descriptionAr: result.description_ar,
      website: result.website,
      logo: result.logo,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async findById(id: number): Promise<IAuthority | null> {
    const query = 'SELECT * FROM authorities WHERE id = ? AND is_active = true';
    const result = await executeSingleQuery<any>(query, [id]);
    if (result) {
      return {
        id: result.id,
        name: result.name,
        nameAr: result.name_ar,
        type: result.type,
        description: result.description,
        descriptionAr: result.description_ar,
        website: result.website,
        logo: result.logo,
        isActive: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    }
    return null;
  }

  static async update(id: number, updateData: Partial<IAuthority>): Promise<boolean> {
    const { name, nameAr, type, description, descriptionAr, website, logo, isActive } = updateData;
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (nameAr !== undefined) {
      updateFields.push('name_ar = ?');
      updateValues.push(nameAr);
    }
    if (type !== undefined) {
      updateFields.push('type = ?');
      updateValues.push(type);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (descriptionAr !== undefined) {
      updateFields.push('description_ar = ?');
      updateValues.push(descriptionAr);
    }
    if (website !== undefined) {
      updateFields.push('website = ?');
      updateValues.push(website);
    }
    if (logo !== undefined) {
      updateFields.push('logo = ?');
      updateValues.push(logo);
    }
    if (isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(isActive);
    }

    if (updateFields.length === 0) return false;

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const query = `UPDATE authorities SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'UPDATE authorities SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }
}

// Category Model
export class CategoryModel {
  static async create(categoryData: Omit<ICategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { name, authorityId, description, isActive } = categoryData;
    const query = `
      INSERT INTO categories (name, authority_id, description, is_active)
      VALUES (?, ?, ?, ?)
    `;
    return await executeInsert(query, [name, authorityId, description, isActive]);
  }

  static async findAll(): Promise<ICategory[]> {
    const query = `
      SELECT c.*, a.name as authority_name, a.type as authority_type
      FROM categories c
      JOIN authorities a ON c.authority_id = a.id
      WHERE c.is_active = true AND a.is_active = true
      ORDER BY a.name ASC, c.name ASC
    `;
    const results = await executeQuery<any>(query);
    return results.map(result => ({
      id: result.id,
      name: result.name,
      authorityId: result.authority_id,
      description: result.description,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      authorityName: result.authority_name,
      authorityType: result.authority_type
    }));
  }

  static async findById(id: number): Promise<ICategory | null> {
    const query = `
      SELECT c.*, a.name as authority_name, a.type as authority_type
      FROM categories c
      JOIN authorities a ON c.authority_id = a.id
      WHERE c.id = ? AND c.is_active = true AND a.is_active = true
    `;
    const result = await executeSingleQuery<any>(query, [id]);
    if (result) {
      return {
        id: result.id,
        name: result.name,
        authorityId: result.authority_id,
        description: result.description,
        isActive: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    }
    return null;
  }

  static async findByAuthority(authorityId: number): Promise<ICategory[]> {
    const query = `
      SELECT c.*, a.name as authority_name, a.type as authority_type
      FROM categories c
      JOIN authorities a ON c.authority_id = a.id
      WHERE c.authority_id = ? AND c.is_active = true AND a.is_active = true
      ORDER BY c.name ASC
    `;
    const results = await executeQuery<any>(query, [authorityId]);
    return results.map(result => ({
      id: result.id,
      name: result.name,
      authorityId: result.authority_id,
      description: result.description,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      authorityName: result.authority_name,
      authorityType: result.authority_type
    }));
  }

  static async update(id: number, updateData: Partial<ICategory>): Promise<boolean> {
    const { name, authorityId, description, isActive } = updateData;
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (authorityId !== undefined) {
      updateFields.push('authority_id = ?');
      updateValues.push(authorityId);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(isActive);
    }

    if (updateFields.length === 0) return false;

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const query = `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'UPDATE categories SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }
}

// Reading Material Model
export class ReadingMaterialModel {
  static async create(materialData: Omit<IReadingMaterial, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { title, description, category, author, date, pdfUrl, authorityId, categoryId, views, downloads, isActive } = materialData;
    const query = `
      INSERT INTO reading_materials (title, description, category, author, date, file_url, authority_id, category_id, views, downloads, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await executeInsert(query, [title, description, category, author, date, pdfUrl, authorityId, categoryId, views, downloads, isActive]);
  }

  static async findAll(): Promise<IReadingMaterial[]> {
    const query = 'SELECT * FROM reading_materials WHERE is_active = true ORDER BY date DESC';
    const results = await executeQuery<any>(query);
    return results.map(result => ({
      id: result.id,
      title: result.title,
      description: result.description,
      category: result.category,
      author: result.author,
      date: result.date,
      pdfUrl: result.file_url,
      authorityId: result.authority_id,
      categoryId: result.category_id,
      views: result.views,
      downloads: result.downloads,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async findById(id: number): Promise<IReadingMaterial | null> {
    const query = 'SELECT * FROM reading_materials WHERE id = ? AND is_active = true';
    const result = await executeSingleQuery<any>(query, [id]);
    if (result) {
      return {
        id: result.id,
        title: result.title,
        description: result.description,
        category: result.category,
        author: result.author,
        date: result.date,
        pdfUrl: result.file_url,
        views: result.views,
        downloads: result.downloads,
        isActive: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    }
    return null;
  }

  static async findByCategory(category: string): Promise<IReadingMaterial[]> {
    const query = 'SELECT * FROM reading_materials WHERE category = ? AND is_active = true ORDER BY date DESC';
    const results = await executeQuery<any>(query, [category]);
    return results.map(result => ({
      id: result.id,
      title: result.title,
      description: result.description,
      category: result.category,
      author: result.author,
      date: result.date,
      pdfUrl: result.file_url,
      authorityId: result.authority_id,
      categoryId: result.category_id,
      views: result.views,
      downloads: result.downloads,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async update(id: number, updateData: Partial<IReadingMaterial>): Promise<boolean> {
    const { title, description, category, author, date, pdfUrl, authorityId, categoryId, views, downloads, isActive } = updateData;
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(category);
    }
    if (author !== undefined) {
      updateFields.push('author = ?');
      updateValues.push(author);
    }
    if (date !== undefined) {
      updateFields.push('date = ?');
      updateValues.push(date);
    }
    if (pdfUrl !== undefined) {
      updateFields.push('file_url = ?');
      updateValues.push(pdfUrl);
    }
    if (authorityId !== undefined) {
      updateFields.push('authority_id = ?');
      updateValues.push(authorityId);
    }
    if (categoryId !== undefined) {
      updateFields.push('category_id = ?');
      updateValues.push(categoryId);
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

    const query = `UPDATE reading_materials SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }

  static async incrementViews(id: number): Promise<boolean> {
    const query = 'UPDATE reading_materials SET views = views + 1 WHERE id = ? AND is_active = true';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }

  static async incrementDownloads(id: number): Promise<boolean> {
    const query = 'UPDATE reading_materials SET downloads = downloads + 1 WHERE id = ? AND is_active = true';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'UPDATE reading_materials SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }
}

// Framework Model
export class FrameworkModel {
  static async create(frameworkData: Omit<IFramework, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { title, titleAr, description, descriptionAr, author, date, fileUrl, imageUrl, content, contentAr, authorityId, categoryId, views, downloads, isActive } = frameworkData;
    const query = `
      INSERT INTO frameworks (title, title_ar, description, description_ar, author, date, file_url, image_url, content, content_ar, authority_id, category_id, views, downloads, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await executeInsert(query, [title, titleAr ?? null, description, descriptionAr ?? null, author, date, fileUrl, imageUrl, content, contentAr ?? null, authorityId, categoryId, views, downloads, isActive]);
  }

  static async findAll(): Promise<IFramework[]> {
    const query = 'SELECT * FROM frameworks WHERE is_active = true ORDER BY display_order ASC, date DESC, id DESC';
    const results = await executeQuery<any>(query);
    return results.map((result) => FrameworkModel.mapFrameworkRow(result));
  }

  static async findAllAdmin(): Promise<IFramework[]> {
    const query = 'SELECT * FROM frameworks ORDER BY display_order ASC, date DESC, id DESC';
    const results = await executeQuery<any>(query);
    return results.map((result) => FrameworkModel.mapFrameworkRow(result));
  }

  private static mapFrameworkRow(result: any): IFramework {
    return {
      id: result.id,
      title: result.title,
      titleAr: result.title_ar,
      description: result.description,
      descriptionAr: result.description_ar,
      author: result.author,
      date: result.date,
      fileUrl: result.file_url,
      imageUrl: result.image_url,
      content: result.content,
      contentAr: result.content_ar,
      authorityId: result.authority_id,
      categoryId: result.category_id,
      views: result.views,
      downloads: result.downloads,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  }

  static async findById(id: number): Promise<IFramework | null> {
    const query = 'SELECT * FROM frameworks WHERE id = ? AND is_active = true';
    const result = await executeSingleQuery<any>(query, [id]);
    return result ? FrameworkModel.mapFrameworkRow(result) : null;
  }

  static async update(id: number, updateData: Partial<IFramework>): Promise<boolean> {
    const { title, titleAr, description, descriptionAr, author, date, fileUrl, imageUrl, content, contentAr, authorityId, categoryId, views, downloads, isActive } = updateData;
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (titleAr !== undefined) {
      updateFields.push('title_ar = ?');
      updateValues.push(titleAr);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (descriptionAr !== undefined) {
      updateFields.push('description_ar = ?');
      updateValues.push(descriptionAr);
    }
    if (author !== undefined) {
      updateFields.push('author = ?');
      updateValues.push(author);
    }
    if (date !== undefined) {
      updateFields.push('date = ?');
      updateValues.push(date);
    }
    if (fileUrl !== undefined) {
      updateFields.push('file_url = ?');
      updateValues.push(fileUrl);
    }
    if (imageUrl !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(imageUrl);
    }
    if (content !== undefined) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }
    if (contentAr !== undefined) {
      updateFields.push('content_ar = ?');
      updateValues.push(contentAr);
    }
    if (authorityId !== undefined) {
      updateFields.push('authority_id = ?');
      updateValues.push(authorityId);
    }
    if (categoryId !== undefined) {
      updateFields.push('category_id = ?');
      updateValues.push(categoryId);
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

    const query = `UPDATE frameworks SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }

  static async incrementViews(id: number): Promise<boolean> {
    const query = 'UPDATE frameworks SET views = views + 1 WHERE id = ? AND is_active = true';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }

  static async incrementDownloads(id: number): Promise<boolean> {
    const query = 'UPDATE frameworks SET downloads = downloads + 1 WHERE id = ? AND is_active = true';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'UPDATE frameworks SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }
}

// Principle Model
export class PrincipleModel {
  static async create(principleData: Omit<IPrinciple, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { title, titleAr, description, descriptionAr, author, date, fileUrl, imageUrl, content, contentAr, authorityId, categoryId, views, downloads, isActive } = principleData;
    const query = `
      INSERT INTO principles (title, title_ar, description, description_ar, author, date, file_url, image_url, content, content_ar, authority_id, category_id, views, downloads, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await executeInsert(query, [title, titleAr ?? null, description, descriptionAr ?? null, author, date, fileUrl, imageUrl, content, contentAr ?? null, authorityId, categoryId, views, downloads, isActive]);
  }

  static async findAll(): Promise<IPrinciple[]> {
    const query = 'SELECT * FROM principles WHERE is_active = true ORDER BY display_order ASC, date DESC, id DESC';
    const results = await executeQuery<any>(query);
    return results.map((result) => PrincipleModel.mapPrincipleRow(result));
  }

  static async findAllAdmin(): Promise<IPrinciple[]> {
    const query = 'SELECT * FROM principles ORDER BY display_order ASC, date DESC, id DESC';
    const results = await executeQuery<any>(query);
    return results.map((result) => PrincipleModel.mapPrincipleRow(result));
  }

  private static mapPrincipleRow(result: any): IPrinciple {
    return {
      id: result.id,
      title: result.title,
      titleAr: result.title_ar,
      description: result.description,
      descriptionAr: result.description_ar,
      author: result.author,
      date: result.date,
      fileUrl: result.file_url,
      imageUrl: result.image_url,
      content: result.content,
      contentAr: result.content_ar,
      authorityId: result.authority_id,
      categoryId: result.category_id,
      views: result.views,
      downloads: result.downloads,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  }

  static async findById(id: number): Promise<IPrinciple | null> {
    const query = 'SELECT * FROM principles WHERE id = ? AND is_active = true';
    const result = await executeSingleQuery<any>(query, [id]);
    return result ? PrincipleModel.mapPrincipleRow(result) : null;
  }

  static async update(id: number, updateData: Partial<IPrinciple>): Promise<boolean> {
    const { title, titleAr, description, descriptionAr, author, date, fileUrl, imageUrl, content, contentAr, authorityId, categoryId, views, downloads, isActive } = updateData;
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (titleAr !== undefined) {
      updateFields.push('title_ar = ?');
      updateValues.push(titleAr);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (descriptionAr !== undefined) {
      updateFields.push('description_ar = ?');
      updateValues.push(descriptionAr);
    }
    if (author !== undefined) {
      updateFields.push('author = ?');
      updateValues.push(author);
    }
    if (date !== undefined) {
      updateFields.push('date = ?');
      updateValues.push(date);
    }
    if (fileUrl !== undefined) {
      updateFields.push('file_url = ?');
      updateValues.push(fileUrl);
    }
    if (imageUrl !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(imageUrl);
    }
    if (content !== undefined) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }
    if (contentAr !== undefined) {
      updateFields.push('content_ar = ?');
      updateValues.push(contentAr);
    }
    if (authorityId !== undefined) {
      updateFields.push('authority_id = ?');
      updateValues.push(authorityId);
    }
    if (categoryId !== undefined) {
      updateFields.push('category_id = ?');
      updateValues.push(categoryId);
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

    const query = `UPDATE principles SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM principles WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }
}

function mapInvestmentProductRow(result: any): IInvestmentProduct {
  return {
    id: result.id,
    title: result.title,
    titleAr: result.title_ar,
    description: result.description,
    descriptionAr: result.description_ar,
    author: result.author,
    date: result.date,
    fileUrl: result.file_url,
    imageUrl: result.image_url,
    content: result.content,
    contentAr: result.content_ar,
    slug: result.slug ?? undefined,
    authorityId: result.authority_id,
    categoryId: result.category_id,
    views: result.views,
    downloads: result.downloads,
    isActive: result.is_active,
    createdAt: result.created_at,
    updatedAt: result.updated_at,
  };
}

// Investment Product Model
export class InvestmentProductModel {
  static async create(productData: Omit<IInvestmentProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { title, titleAr, description, descriptionAr, author, date, fileUrl, imageUrl, content, contentAr, slug, authorityId, categoryId, views, downloads, isActive } = productData;
    const query = `
      INSERT INTO investment_products (title, title_ar, description, description_ar, author, date, file_url, image_url, content, content_ar, slug, authority_id, category_id, views, downloads, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await executeInsert(query, [title, titleAr ?? null, description, descriptionAr ?? null, author, date, fileUrl, imageUrl, content, contentAr ?? null, slug ?? null, authorityId, categoryId, views, downloads, isActive]);
  }

  static async findAll(): Promise<IInvestmentProduct[]> {
    const query = 'SELECT * FROM investment_products WHERE is_active = true ORDER BY display_order ASC, date DESC, id DESC';
    const results = await executeQuery<any>(query);
    return results.map((result) => mapInvestmentProductRow(result));
  }

  static async findAllAdmin(): Promise<IInvestmentProduct[]> {
    const query = 'SELECT * FROM investment_products ORDER BY display_order ASC, date DESC, id DESC';
    const results = await executeQuery<any>(query);
    return results.map((result) => mapInvestmentProductRow(result));
  }

  static async findById(id: number): Promise<IInvestmentProduct | null> {
    const query = 'SELECT * FROM investment_products WHERE id = ? AND is_active = true';
    const result = await executeSingleQuery<any>(query, [id]);
    if (result) {
      return mapInvestmentProductRow(result);
    }
    return null;
  }

  static async findBySlug(slug: string): Promise<IInvestmentProduct | null> {
    const query = 'SELECT * FROM investment_products WHERE slug = ? AND is_active = true';
    const result = await executeSingleQuery<any>(query, [slug]);
    return result ? mapInvestmentProductRow(result) : null;
  }

  static async update(id: number, updateData: Partial<IInvestmentProduct>): Promise<boolean> {
    const { title, titleAr, description, descriptionAr, author, date, fileUrl, imageUrl, content, contentAr, slug, authorityId, categoryId, views, downloads, isActive } = updateData;
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (titleAr !== undefined) {
      updateFields.push('title_ar = ?');
      updateValues.push(titleAr);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (descriptionAr !== undefined) {
      updateFields.push('description_ar = ?');
      updateValues.push(descriptionAr);
    }
    if (author !== undefined) {
      updateFields.push('author = ?');
      updateValues.push(author);
    }
    if (date !== undefined) {
      updateFields.push('date = ?');
      updateValues.push(date);
    }
    if (fileUrl !== undefined) {
      updateFields.push('file_url = ?');
      updateValues.push(fileUrl);
    }
    if (imageUrl !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(imageUrl);
    }
    if (content !== undefined) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }
    if (contentAr !== undefined) {
      updateFields.push('content_ar = ?');
      updateValues.push(contentAr);
    }
    if (slug !== undefined) {
      updateFields.push('slug = ?');
      updateValues.push(slug);
    }
    if (authorityId !== undefined) {
      updateFields.push('authority_id = ?');
      updateValues.push(authorityId);
    }
    if (categoryId !== undefined) {
      updateFields.push('category_id = ?');
      updateValues.push(categoryId);
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

    const query = `UPDATE investment_products SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM investment_products WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }
}

// Member Activity Model
export class MemberActivityModel {
  static async create(activityData: Omit<IMemberActivity, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { title, description, type, organization, date, status, participants, isActive } = activityData;
    const query = `
      INSERT INTO member_activities (title, description, type, organization, date, status, participants, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await executeInsert(query, [title, description, type, organization, date, status, participants, isActive]);
  }

  static async findAll(): Promise<IMemberActivity[]> {
    const query = 'SELECT * FROM member_activities WHERE is_active = true ORDER BY date DESC';
    const results = await executeQuery<any>(query);
    return results.map(result => ({
      id: result.id,
      title: result.title,
      description: result.description,
      type: result.type,
      organization: result.organization,
      date: result.date,
      status: result.status,
      participants: result.participants,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async findById(id: number): Promise<IMemberActivity | null> {
    const query = 'SELECT * FROM member_activities WHERE id = ? AND is_active = true';
    const result = await executeSingleQuery<any>(query, [id]);
    if (result) {
      return {
        id: result.id,
        title: result.title,
        description: result.description,
        type: result.type,
        organization: result.organization,
        date: result.date,
        status: result.status,
        participants: result.participants,
        isActive: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    }
    return null;
  }

  static async findByType(type: string): Promise<IMemberActivity[]> {
    const query = 'SELECT * FROM member_activities WHERE type = ? AND is_active = true ORDER BY date DESC';
    const results = await executeQuery<any>(query, [type]);
    return results.map(result => ({
      id: result.id,
      title: result.title,
      description: result.description,
      type: result.type,
      organization: result.organization,
      date: result.date,
      status: result.status,
      participants: result.participants,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async update(id: number, updateData: Partial<IMemberActivity>): Promise<boolean> {
    const { title, description, type, organization, date, status, participants, isActive } = updateData;
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (type !== undefined) {
      updateFields.push('type = ?');
      updateValues.push(type);
    }
    if (organization !== undefined) {
      updateFields.push('organization = ?');
      updateValues.push(organization);
    }
    if (date !== undefined) {
      updateFields.push('date = ?');
      updateValues.push(date);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (participants !== undefined) {
      updateFields.push('participants = ?');
      updateValues.push(participants);
    }
    if (isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(isActive);
    }

    if (updateFields.length === 0) return false;

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const query = `UPDATE member_activities SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'UPDATE member_activities SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }
}

// Member Strategy Project Model
export class MemberStrategyProjectModel {
  private static mapRow(result: Record<string, unknown>): IMemberStrategyProject {
    const authorityName = String(result.authority_name ?? result.memberName ?? '');
    return {
      id: result.id as number,
      title: String(result.title ?? ''),
      titleAr: result.title_ar ? String(result.title_ar) : undefined,
      description: String(result.description ?? ''),
      descriptionAr: result.description_ar ? String(result.description_ar) : undefined,
      authority_name: authorityName,
      memberId: (result.member_id as number | null) ?? null,
      type: String(result.type ?? ''),
      status: String(result.status ?? 'Active'),
      start_date: (result.start_date as string | null) ?? null,
      end_date: (result.end_date as string | null) ?? null,
      budget: result.budget != null ? Number(result.budget) : undefined,
      isActive: result.is_active !== false && result.is_active !== 0,
      createdAt: result.created_at as Date | undefined,
      updatedAt: result.updated_at as Date | undefined,
      memberName: authorityName,
      categoryName: String(result.type ?? ''),
      fileUrl: (result.file_url as string | null) ?? null,
      date: (result.start_date as string | null) ?? null,
    };
  }

  static async create(projectData: {
    title: string;
    titleAr?: string;
    description: string;
    descriptionAr?: string;
    authority_name: string;
    type: StrategyProjectType | string;
    file_url?: string | null;
    isActive?: boolean;
  }): Promise<number> {
    const { title, titleAr, description, descriptionAr, authority_name, type, file_url, isActive = true } = projectData;
    const query = `
      INSERT INTO member_strategies_projects (title, title_ar, description, description_ar, authority_name, type, status, file_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 'Active', ?, ?)
    `;
    return await executeInsert(query, [title, titleAr ?? null, description, descriptionAr ?? null, authority_name, type, file_url ?? null, isActive]);
  }

  static async findAll(options: { includeInactive?: boolean } = {}): Promise<IMemberStrategyProject[]> {
    const activeClause = options.includeInactive ? '' : 'WHERE msp.is_active = true';
    const query = `
      SELECT msp.*, COALESCE(msp.authority_name, m.name) as memberName
      FROM member_strategies_projects msp
      LEFT JOIN members m ON msp.member_id = m.id
      ${activeClause}
      ORDER BY msp.display_order ASC, COALESCE(msp.authority_name, m.name), msp.type, msp.title
    `;
    const results = await executeQuery<Record<string, unknown>>(query);
    return results.map((result) => this.mapRow(result));
  }

  static async findById(id: number, includeInactive = false): Promise<IMemberStrategyProject | null> {
    const activeClause = includeInactive ? '' : 'AND msp.is_active = true';
    const query = `
      SELECT msp.*, COALESCE(msp.authority_name, m.name) as memberName
      FROM member_strategies_projects msp
      LEFT JOIN members m ON msp.member_id = m.id
      WHERE msp.id = ? ${activeClause}
    `;
    const result = await executeSingleQuery<Record<string, unknown>>(query, [id]);
    return result ? this.mapRow(result) : null;
  }

  static async update(id: number, updateData: Partial<IMemberStrategyProject> & { file_url?: string | null }): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (updateData.title !== undefined) {
      fields.push('title = ?');
      values.push(updateData.title);
    }
    if (updateData.titleAr !== undefined) {
      fields.push('title_ar = ?');
      values.push(updateData.titleAr);
    }
    if (updateData.description !== undefined) {
      fields.push('description = ?');
      values.push(updateData.description);
    }
    if (updateData.descriptionAr !== undefined) {
      fields.push('description_ar = ?');
      values.push(updateData.descriptionAr);
    }
    if (updateData.authority_name !== undefined) {
      fields.push('authority_name = ?');
      values.push(updateData.authority_name);
    }
    if (updateData.type !== undefined) {
      fields.push('type = ?');
      values.push(updateData.type);
    }
    if (updateData.fileUrl !== undefined || updateData.file_url !== undefined) {
      fields.push('file_url = ?');
      values.push(updateData.fileUrl ?? updateData.file_url ?? null);
    }
    if (updateData.isActive !== undefined) {
      fields.push('is_active = ?');
      values.push(updateData.isActive);
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE member_strategies_projects SET ${fields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, values);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'UPDATE member_strategies_projects SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }
}

// Alert Bulletin Model
export class AlertBulletinModel {
  static async create(bulletinData: Omit<IAlertBulletin, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { title, description, type, priority, date, author, isActive } = bulletinData;
    const query = `
      INSERT INTO alert_bulletins (title, description, type, priority, date, author, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    return await executeInsert(query, [title, description, type, priority, date, author, isActive]);
  }

  static async findAll(): Promise<IAlertBulletin[]> {
    const query = 'SELECT * FROM alert_bulletins WHERE is_active = true ORDER BY date DESC';
    const results = await executeQuery<any>(query);
    return results.map(result => ({
      id: result.id,
      title: result.title,
      description: result.description,
      type: result.type,
      priority: result.priority,
      date: result.date,
      author: result.author,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async findById(id: number): Promise<IAlertBulletin | null> {
    const query = 'SELECT * FROM alert_bulletins WHERE id = ? AND is_active = true';
    const result = await executeSingleQuery<any>(query, [id]);
    if (result) {
      return {
        id: result.id,
        title: result.title,
        description: result.description,
        type: result.type,
        priority: result.priority,
        date: result.date,
        author: result.author,
        isActive: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    }
    return null;
  }

  static async findByPriority(priority: string): Promise<IAlertBulletin[]> {
    const query = 'SELECT * FROM alert_bulletins WHERE priority = ? AND is_active = true ORDER BY date DESC';
    const results = await executeQuery<any>(query, [priority]);
    return results.map(result => ({
      id: result.id,
      title: result.title,
      description: result.description,
      type: result.type,
      priority: result.priority,
      date: result.date,
      author: result.author,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async update(id: number, updateData: Partial<IAlertBulletin>): Promise<boolean> {
    const { title, description, type, priority, date, author, isActive } = updateData;
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (type !== undefined) {
      updateFields.push('type = ?');
      updateValues.push(type);
    }
    if (priority !== undefined) {
      updateFields.push('priority = ?');
      updateValues.push(priority);
    }
    if (date !== undefined) {
      updateFields.push('date = ?');
      updateValues.push(date);
    }
    if (author !== undefined) {
      updateFields.push('author = ?');
      updateValues.push(author);
    }
    if (isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(isActive);
    }

    if (updateFields.length === 0) return false;

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const query = `UPDATE alert_bulletins SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'UPDATE alert_bulletins SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }
}

export { AuthorityModel as Authority, CategoryModel as Category, ReadingMaterialModel as ReadingMaterial, MemberActivityModel as MemberActivity, MemberStrategyProjectModel as MemberStrategyProject, AlertBulletinModel as AlertBulletin };
