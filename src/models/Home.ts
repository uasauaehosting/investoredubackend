import { executeQuery, executeSingleQuery, executeInsert, executeUpdate } from '../utils/database';

export interface INews {
  id?: number;
  title: string;
  titleAr?: string;
  excerpt: string;
  excerptAr?: string;
  fullDetail?: string;
  fullDetailAr?: string;
  category?: string;
  link: string;
  image?: string;
  pdfFile?: string;
  date?: Date;
  displayOrder?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMember {
  id?: number;
  name: string;
  nameAr?: string;
  country: string;
  countryAr?: string;
  website?: string;
  logo?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHomeStats {
  id?: number;
  readingMaterials: string;
  membersActivities: string;
  alertsBulletins: string;
  lastUpdated: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISlide {
  id?: number;
  title: string;
  titleAr?: string;
  subtitle?: string;
  subtitleAr?: string;
  image_url?: string;
  cta_text?: string;
  cta_textAr?: string;
  cta_href?: string;
  display_order: number;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// News Model
function mapNewsRow(result: any): INews {
  return {
    id: result.id,
    title: result.title,
    titleAr: result.title_ar,
    excerpt: result.summary || result.content || '',
    excerptAr: result.summary_ar || result.content_ar || '',
    fullDetail: result.full_detail,
    fullDetailAr: result.full_detail_ar,
    category: result.category,
    link: result.link || '',
    image: result.image,
    pdfFile: result.pdf_file,
    date: result.date,
    displayOrder: result.display_order ?? 0,
    isActive: result.is_active,
    createdAt: result.created_at,
    updatedAt: result.updated_at,
  };
}

export class NewsModel {
  static async getNextDisplayOrder(): Promise<number> {
    const result = await executeSingleQuery<any>(
      'SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM news',
    );
    return Number(result?.next_order ?? 1);
  }

  static async create(newsData: Omit<INews, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { title, titleAr, excerpt, excerptAr, fullDetail, fullDetailAr, category, link, image, pdfFile, date, displayOrder, isActive = true } = newsData;
    const newsDate = date || new Date();
    const order = displayOrder ?? await NewsModel.getNextDisplayOrder();
    const query = `
      INSERT INTO news (title, title_ar, summary, summary_ar, content, content_ar, full_detail, full_detail_ar, category, link, image, pdf_file, date, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await executeInsert(query, [title, titleAr, excerpt, excerptAr, excerpt, excerptAr, fullDetail, fullDetailAr, category || 'News', link, image, pdfFile, newsDate, order, isActive]);
  }

  static async findAll(): Promise<INews[]> {
    const query = 'SELECT * FROM news WHERE is_active = true ORDER BY display_order ASC, date DESC, id DESC';
    const results = await executeQuery<any>(query);
    return results.map(mapNewsRow);
  }

  static async findById(id: number): Promise<INews | null> {
    const query = 'SELECT * FROM news WHERE id = ? AND is_active = true';
    console.log('NewsModel.findById - Query:', query, 'ID:', id); // Debug log
    const result = await executeSingleQuery<any>(query, [id]);
    console.log('NewsModel.findById - Raw result:', result); // Debug log
    
    if (result) {
      const newsItem = mapNewsRow(result);
      console.log('NewsModel.findById - Processed result:', newsItem); // Debug log
      return newsItem;
    }
    return null;
  }

  static async update(id: number, updateData: Partial<INews>): Promise<boolean> {
    console.log('NewsModel.update - Input data:', updateData); // Debug log
    
    const { title, titleAr, excerpt, excerptAr, fullDetail, fullDetailAr, category, link, image, pdfFile, date, displayOrder, isActive } = updateData;
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
    if (excerpt !== undefined) {
      updateFields.push('summary = ?');
      updateValues.push(excerpt);
    }
    if (excerptAr !== undefined) {
      updateFields.push('summary_ar = ?');
      updateValues.push(excerptAr);
    }
    if (fullDetail !== undefined) {
      updateFields.push('full_detail = ?');
      updateValues.push(fullDetail);
    }
    if (fullDetailAr !== undefined) {
      updateFields.push('full_detail_ar = ?');
      updateValues.push(fullDetailAr);
    }
    if (category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(category);
    }
    if (link !== undefined) {
      updateFields.push('link = ?');
      updateValues.push(link);
    }
    if (image !== undefined) {
      updateFields.push('image = ?');
      updateValues.push(image);
    }
    if (pdfFile !== undefined) {
      updateFields.push('pdf_file = ?');
      updateValues.push(pdfFile);
    }
    if (date !== undefined) {
      updateFields.push('date = ?');
      updateValues.push(date);
    }
    if (displayOrder !== undefined) {
      updateFields.push('display_order = ?');
      updateValues.push(displayOrder);
    }
    if (isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(isActive);
    }

    if (updateFields.length === 0) return false;

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const query = `UPDATE news SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'UPDATE news SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }

  static async reorder(ids: number[]): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      await executeUpdate(
        'UPDATE news SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [i + 1, ids[i]],
      );
    }
  }
}

// Member Model
export class MemberModel {
  static async create(memberData: Omit<IMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { name, nameAr, country, countryAr, website, logo, isActive } = memberData;
    const query = `
      INSERT INTO members (name, name_ar, country, country_ar, website, logo, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    return await executeInsert(query, [name, nameAr, country, countryAr, website, logo, isActive]);
  }

  static async findAll(): Promise<IMember[]> {
    const query = 'SELECT * FROM members WHERE is_active = true ORDER BY created_at DESC';
    const results = await executeQuery<any>(query);
    return results.map(result => ({
      id: result.id,
      name: result.name,
      nameAr: result.name_ar,
      country: result.country,
      countryAr: result.country_ar,
      website: result.website,
      logo: result.logo,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async findById(id: number): Promise<IMember | null> {
    const query = 'SELECT * FROM members WHERE id = ? AND is_active = true';
    const result = await executeSingleQuery<any>(query, [id]);
    if (result) {
      return {
        id: result.id,
        name: result.name,
        nameAr: result.name_ar,
        country: result.country,
        countryAr: result.country_ar,
        website: result.website,
        logo: result.logo,
        isActive: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    }
    return null;
  }

  static async update(id: number, updateData: Partial<IMember>): Promise<boolean> {
    const { name, nameAr, country, countryAr, website, logo, isActive } = updateData;
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
    if (country !== undefined) {
      updateFields.push('country = ?');
      updateValues.push(country);
    }
    if (countryAr !== undefined) {
      updateFields.push('country_ar = ?');
      updateValues.push(countryAr);
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

    const query = `UPDATE members SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'UPDATE members SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }
}

// Home Stats Model
export class HomeStatsModel {
  static async create(statsData: Omit<IHomeStats, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { readingMaterials, membersActivities, alertsBulletins, lastUpdated } = statsData;
    const query = `
      INSERT INTO home_stats (reading_materials, members_activities, alerts_bulletins, last_updated)
      VALUES (?, ?, ?, ?)
    `;
    return await executeInsert(query, [readingMaterials, membersActivities, alertsBulletins, lastUpdated]);
  }

  static async findLatest(): Promise<IHomeStats | null> {
    const query = 'SELECT * FROM home_stats ORDER BY last_updated DESC LIMIT 1';
    const result = await executeSingleQuery<any>(query);
    if (result) {
      return {
        id: result.id,
        readingMaterials: result.reading_materials,
        membersActivities: result.members_activities,
        alertsBulletins: result.alerts_bulletins,
        lastUpdated: result.last_updated,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    }
    return null;
  }

  static async update(id: number, updateData: Partial<IHomeStats>): Promise<boolean> {
    const { readingMaterials, membersActivities, alertsBulletins, lastUpdated } = updateData;
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (readingMaterials !== undefined) {
      updateFields.push('reading_materials = ?');
      updateValues.push(readingMaterials);
    }
    if (membersActivities !== undefined) {
      updateFields.push('members_activities = ?');
      updateValues.push(membersActivities);
    }
    if (alertsBulletins !== undefined) {
      updateFields.push('alerts_bulletins = ?');
      updateValues.push(alertsBulletins);
    }
    if (lastUpdated !== undefined) {
      updateFields.push('last_updated = ?');
      updateValues.push(lastUpdated);
    }

    if (updateFields.length === 0) return false;

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const query = `UPDATE home_stats SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }
}

// Slide Model
export class SlideModel {
  static async create(slideData: Omit<ISlide, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { title, titleAr, subtitle, subtitleAr, image_url, cta_text, cta_textAr, cta_href, display_order, is_active = true } = slideData;
    const query = `
      INSERT INTO slides (title, title_ar, subtitle, subtitle_ar, image_url, cta_text, cta_text_ar, cta_href, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await executeInsert(query, [title, titleAr ?? null, subtitle, subtitleAr ?? null, image_url, cta_text, cta_textAr ?? null, cta_href, display_order, is_active]);
  }

  static async findAll(): Promise<ISlide[]> {
    const query = 'SELECT * FROM slides WHERE is_active = true ORDER BY display_order ASC';
    const results = await executeQuery<any>(query);
    return results.map(result => ({
      id: result.id,
      title: result.title,
      titleAr: result.title_ar,
      subtitle: result.subtitle,
      subtitleAr: result.subtitle_ar,
      image_url: result.image_url,
      cta_text: result.cta_text,
      cta_textAr: result.cta_text_ar,
      cta_href: result.cta_href,
      display_order: result.display_order,
      is_active: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async findById(id: number): Promise<ISlide | null> {
    const query = 'SELECT * FROM slides WHERE id = ?';
    const result = await executeSingleQuery<any>(query, [id]);
    if (result) {
      return {
        id: result.id,
        title: result.title,
        titleAr: result.title_ar,
        subtitle: result.subtitle,
        subtitleAr: result.subtitle_ar,
        image_url: result.image_url,
        cta_text: result.cta_text,
        cta_textAr: result.cta_text_ar,
        cta_href: result.cta_href,
        display_order: result.display_order,
        is_active: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    }
    return null;
  }

  static async update(id: number, updateData: Partial<ISlide>): Promise<boolean> {
    const { title, titleAr, subtitle, subtitleAr, image_url, cta_text, cta_textAr, cta_href, display_order, is_active } = updateData;
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
    if (subtitle !== undefined) {
      updateFields.push('subtitle = ?');
      updateValues.push(subtitle);
    }
    if (subtitleAr !== undefined) {
      updateFields.push('subtitle_ar = ?');
      updateValues.push(subtitleAr);
    }
    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(image_url);
    }
    if (cta_text !== undefined) {
      updateFields.push('cta_text = ?');
      updateValues.push(cta_text);
    }
    if (cta_textAr !== undefined) {
      updateFields.push('cta_text_ar = ?');
      updateValues.push(cta_textAr);
    }
    if (cta_href !== undefined) {
      updateFields.push('cta_href = ?');
      updateValues.push(cta_href);
    }
    if (display_order !== undefined) {
      updateFields.push('display_order = ?');
      updateValues.push(display_order);
    }
    if (is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(is_active);
    }

    if (updateFields.length === 0) return false;

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const query = `UPDATE slides SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM slides WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }
}

export { NewsModel as News, MemberModel as Member, HomeStatsModel as HomeStats, SlideModel as Slide };
