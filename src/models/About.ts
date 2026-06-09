import { executeQuery, executeSingleQuery, executeInsert, executeUpdate } from '../utils/database';

export interface IAboutSection {
  id?: number;
  title: string;
  content: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContactInfo {
  id?: number;
  type: 'headquarters' | 'contact';
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// About Section Model
export class AboutSectionModel {
  static async create(sectionData: Omit<IAboutSection, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { title, content, order, isActive } = sectionData;
    const query = `
      INSERT INTO about_sections (title, content, \`order\`, is_active)
      VALUES (?, ?, ?, ?)
    `;
    return await executeInsert(query, [title, content, order, isActive]);
  }

  static async findAll(): Promise<IAboutSection[]> {
    const query = 'SELECT * FROM about_sections WHERE is_active = true ORDER BY `order` ASC';
    const results = await executeQuery<any>(query);
    return results.map(result => ({
      id: result.id,
      title: result.title,
      content: result.content,
      order: result.order,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async findById(id: number): Promise<IAboutSection | null> {
    const query = 'SELECT * FROM about_sections WHERE id = ? AND is_active = true';
    const result = await executeSingleQuery<any>(query, [id]);
    if (result) {
      return {
        id: result.id,
        title: result.title,
        content: result.content,
        order: result.order,
        isActive: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    }
    return null;
  }

  static async update(id: number, updateData: Partial<IAboutSection>): Promise<boolean> {
    const { title, content, order, isActive } = updateData;
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (content !== undefined) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }
    if (order !== undefined) {
      updateFields.push('`order` = ?');
      updateValues.push(order);
    }
    if (isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(isActive);
    }

    if (updateFields.length === 0) return false;

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const query = `UPDATE about_sections SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'UPDATE about_sections SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }
}

// Contact Info Model
export class ContactInfoModel {
  static async create(contactData: Omit<IContactInfo, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { type, address, phone, email, isActive } = contactData;
    const query = `
      INSERT INTO contact_info (type, address, phone, email, is_active)
      VALUES (?, ?, ?, ?, ?)
    `;
    return await executeInsert(query, [type, address, phone, email, isActive]);
  }

  static async findAll(): Promise<IContactInfo[]> {
    const query = 'SELECT * FROM contact_info WHERE is_active = true ORDER BY type';
    const results = await executeQuery<any>(query);
    return results.map(result => ({
      id: result.id,
      type: result.type,
      address: result.address,
      phone: result.phone,
      email: result.email,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async findById(id: number): Promise<IContactInfo | null> {
    const query = 'SELECT * FROM contact_info WHERE id = ? AND is_active = true';
    const result = await executeSingleQuery<any>(query, [id]);
    if (result) {
      return {
        id: result.id,
        type: result.type,
        address: result.address,
        phone: result.phone,
        email: result.email,
        isActive: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    }
    return null;
  }

  static async update(id: number, updateData: Partial<IContactInfo>): Promise<boolean> {
    const { type, address, phone, email, isActive } = updateData;
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (type !== undefined) {
      updateFields.push('type = ?');
      updateValues.push(type);
    }
    if (address !== undefined) {
      updateFields.push('address = ?');
      updateValues.push(address);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(isActive);
    }

    if (updateFields.length === 0) return false;

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const query = `UPDATE contact_info SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'UPDATE contact_info SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }
}

export { AboutSectionModel as AboutSection, ContactInfoModel as ContactInfo };
