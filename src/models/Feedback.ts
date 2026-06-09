import { executeQuery, executeSingleQuery, executeInsert, executeUpdate } from '../utils/database';

export interface IFeedback {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  rating: number;
  category: 'General' | 'Complaint' | 'Suggestion' | 'Technical Issue' | 'Content Request';
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  response?: string;
  respondedBy?: string;
  respondedAt?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class FeedbackModel {
  static async create(feedbackData: Omit<IFeedback, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { name, email, phone, subject, message, rating, category, status, response, respondedBy, respondedAt, isActive } = feedbackData;
    const query = `
      INSERT INTO feedback (name, email, phone, subject, message, rating, category, status, response, responded_by, responded_at, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await executeInsert(query, [name, email, phone, subject, message, rating, category, status, response, respondedBy, respondedAt, isActive]);
  }

  static async findAll(): Promise<IFeedback[]> {
    const query = 'SELECT * FROM feedback WHERE is_active = true ORDER BY created_at DESC';
    const results = await executeQuery<any>(query);
    return results.map(result => ({
      id: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      subject: result.subject,
      message: result.message,
      rating: result.rating,
      category: result.category,
      status: result.status,
      response: result.response,
      respondedBy: result.responded_by,
      respondedAt: result.responded_at,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async findById(id: number): Promise<IFeedback | null> {
    const query = 'SELECT * FROM feedback WHERE id = ? AND is_active = true';
    const result = await executeSingleQuery<any>(query, [id]);
    if (result) {
      return {
        id: result.id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        subject: result.subject,
        message: result.message,
        rating: result.rating,
        category: result.category,
        status: result.status,
        response: result.response,
        respondedBy: result.responded_by,
        respondedAt: result.responded_at,
        isActive: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    }
    return null;
  }

  static async findByStatus(status: string): Promise<IFeedback[]> {
    const query = 'SELECT * FROM feedback WHERE status = ? AND is_active = true ORDER BY created_at DESC';
    const results = await executeQuery<any>(query, [status]);
    return results.map(result => ({
      id: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      subject: result.subject,
      message: result.message,
      rating: result.rating,
      category: result.category,
      status: result.status,
      response: result.response,
      respondedBy: result.responded_by,
      respondedAt: result.responded_at,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async findByCategory(category: string): Promise<IFeedback[]> {
    const query = 'SELECT * FROM feedback WHERE category = ? AND is_active = true ORDER BY created_at DESC';
    const results = await executeQuery<any>(query, [category]);
    return results.map(result => ({
      id: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      subject: result.subject,
      message: result.message,
      rating: result.rating,
      category: result.category,
      status: result.status,
      response: result.response,
      respondedBy: result.responded_by,
      respondedAt: result.responded_at,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async getPending(): Promise<IFeedback[]> {
    const query = 'SELECT * FROM feedback WHERE status = "Pending" AND is_active = true ORDER BY created_at DESC';
    const results = await executeQuery<any>(query);
    return results.map(result => ({
      id: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      subject: result.subject,
      message: result.message,
      rating: result.rating,
      category: result.category,
      status: result.status,
      response: result.response,
      respondedBy: result.responded_by,
      respondedAt: result.responded_at,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  static async update(id: number, updateData: Partial<IFeedback>): Promise<boolean> {
    const { name, email, phone, subject, message, rating, category, status, response, respondedBy, respondedAt, isActive } = updateData;
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (subject !== undefined) {
      updateFields.push('subject = ?');
      updateValues.push(subject);
    }
    if (message !== undefined) {
      updateFields.push('message = ?');
      updateValues.push(message);
    }
    if (rating !== undefined) {
      updateFields.push('rating = ?');
      updateValues.push(rating);
    }
    if (category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(category);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (response !== undefined) {
      updateFields.push('response = ?');
      updateValues.push(response);
    }
    if (respondedBy !== undefined) {
      updateFields.push('responded_by = ?');
      updateValues.push(respondedBy);
    }
    if (respondedAt !== undefined) {
      updateFields.push('responded_at = ?');
      updateValues.push(respondedAt);
    }
    if (isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(isActive);
    }

    if (updateFields.length === 0) return false;

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const query = `UPDATE feedback SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    return result > 0;
  }

  static async respondToFeedback(id: number, response: string, respondedBy: string): Promise<boolean> {
    const query = `
      UPDATE feedback 
      SET response = ?, responded_by = ?, responded_at = CURRENT_TIMESTAMP, status = 'Resolved', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND is_active = true
    `;
    const result = await executeUpdate(query, [response, respondedBy, id]);
    return result > 0;
  }

  static async updateStatus(id: number, status: string): Promise<boolean> {
    const query = `
      UPDATE feedback 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND is_active = true
    `;
    const result = await executeUpdate(query, [status, id]);
    return result > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'UPDATE feedback SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }
}

export { FeedbackModel as Feedback };
