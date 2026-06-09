import bcrypt from 'bcryptjs';
import { executeQuery, executeSingleQuery, executeInsert, executeUpdate } from '../utils/database';

export interface IAdmin {
  id?: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'Super Admin' | 'Admin' | 'Editor';
  permissions: string[];
  lastLogin?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AdminModel {
  // Create admin
  static async create(adminData: Omit<IAdmin, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const { username, email, password, firstName, lastName, role, permissions, lastLogin, isActive } = adminData;
    
    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const query = `
      INSERT INTO admins (username, email, password, first_name, last_name, role, last_login, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const adminId = await executeInsert(query, [username, email, hashedPassword, firstName, lastName, role, lastLogin, isActive]);
    
    // Insert permissions
    if (permissions && permissions.length > 0) {
      const permissionQuery = `
        INSERT INTO admin_permissions (admin_id, permission)
        VALUES ?
      `;
      const permissionValues = permissions.map(permission => [adminId, permission]);
      await executeQuery(permissionQuery, [permissionValues]);
    }
    
    return adminId;
  }

  // Find by email
  static async findByEmail(email: string): Promise<IAdmin | null> {
    const query = `
      SELECT a.*, GROUP_CONCAT(ap.permission) as permissions
      FROM admins a
      LEFT JOIN admin_permissions ap ON a.id = ap.admin_id
      WHERE a.email = ? AND a.is_active = true
      GROUP BY a.id
    `;
    
    const result = await executeSingleQuery<any>(query, [email]);
    
    if (result) {
      return {
        id: result.id,
        username: result.username,
        email: result.email,
        password: result.password,
        firstName: result.first_name,
        lastName: result.last_name,
        role: result.role,
        permissions: result.permissions ? result.permissions.split(',') : [],
        lastLogin: result.last_login,
        isActive: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    }
    
    return null;
  }

  // Find by username
  static async findByUsername(username: string): Promise<IAdmin | null> {
    const query = `
      SELECT a.*, GROUP_CONCAT(ap.permission) as permissions
      FROM admins a
      LEFT JOIN admin_permissions ap ON a.id = ap.admin_id
      WHERE a.username = ? AND a.is_active = true
      GROUP BY a.id
    `;
    
    try {
      const result = await executeSingleQuery<any>(query, [username]);
      
      if (result) {
        return {
          id: result.id,
          username: result.username,
          email: result.email,
          password: result.password,
          firstName: result.first_name,
          lastName: result.last_name,
          role: result.role,
          permissions: result.permissions ? result.permissions.split(',') : ['all_access'],
          lastLogin: result.last_login,
          isActive: result.is_active,
          createdAt: result.created_at,
          updatedAt: result.updated_at
        };
      }
      
      return null;
    } catch (error: any) {
      // If admin_permissions table doesn't exist, fall back to basic query
      if (error.message.includes("admin_permissions") || error.message.includes("doesn't exist")) {
        const fallbackQuery = 'SELECT * FROM admins WHERE username = ? AND is_active = true';
        const result = await executeSingleQuery<any>(fallbackQuery, [username]);
        
        if (result) {
          return {
            id: result.id,
            username: result.username,
            email: result.email,
            password: result.password,
            firstName: result.first_name,
            lastName: result.last_name,
            role: result.role,
            permissions: ['all_access'], // Default permissions
            lastLogin: result.last_login,
            isActive: result.is_active,
            createdAt: result.created_at,
            updatedAt: result.updated_at
          };
        }
      }
      throw error;
    }
  }

  // Find by ID
  static async findById(id: number): Promise<IAdmin | null> {
    const query = `
      SELECT a.*, GROUP_CONCAT(ap.permission) as permissions
      FROM admins a
      LEFT JOIN admin_permissions ap ON a.id = ap.admin_id
      WHERE a.id = ? AND a.is_active = true
      GROUP BY a.id
    `;
    
    try {
      const result = await executeSingleQuery<any>(query, [id]);
      
      if (result) {
        return {
          id: result.id,
          username: result.username,
          email: result.email,
          password: result.password,
          firstName: result.first_name,
          lastName: result.last_name,
          role: result.role,
          permissions: result.permissions ? result.permissions.split(',') : ['all_access'],
          lastLogin: result.last_login,
          isActive: result.is_active,
          createdAt: result.created_at,
          updatedAt: result.updated_at
        };
      }
      
      return null;
    } catch (error: any) {
      // If admin_permissions table doesn't exist, fall back to basic query
      if (error.message.includes("admin_permissions") || error.message.includes("doesn't exist")) {
        const fallbackQuery = 'SELECT * FROM admins WHERE id = ? AND is_active = true';
        const result = await executeSingleQuery<any>(fallbackQuery, [id]);
        
        if (result) {
          return {
            id: result.id,
            username: result.username,
            email: result.email,
            password: result.password,
            firstName: result.first_name,
            lastName: result.last_name,
            role: result.role,
            permissions: ['all_access'], // Default permissions
            lastLogin: result.last_login,
            isActive: result.is_active,
            createdAt: result.created_at,
            updatedAt: result.updated_at
          };
        }
      }
      throw error;
    }
  }

  // Get all admins
  static async findAll(): Promise<IAdmin[]> {
    const query = `
      SELECT a.*, GROUP_CONCAT(ap.permission) as permissions
      FROM admins a
      LEFT JOIN admin_permissions ap ON a.id = ap.admin_id
      WHERE a.is_active = true
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `;
    
    const results = await executeQuery<any>(query);
    
    return results.map(result => ({
      id: result.id,
      username: result.username,
      email: result.email,
      password: result.password,
      firstName: result.first_name,
      lastName: result.last_name,
      role: result.role,
      permissions: result.permissions ? result.permissions.split(',') : [],
      lastLogin: result.last_login,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }));
  }

  // Update admin
  static async update(id: number, updateData: Partial<IAdmin>): Promise<boolean> {
    const { username, email, password, firstName, lastName, role, permissions, lastLogin, isActive } = updateData;
    
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    if (username !== undefined) {
      updateFields.push('username = ?');
      updateValues.push(username);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (password !== undefined) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }
    if (firstName !== undefined) {
      updateFields.push('first_name = ?');
      updateValues.push(firstName);
    }
    if (lastName !== undefined) {
      updateFields.push('last_name = ?');
      updateValues.push(lastName);
    }
    if (role !== undefined) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    if (lastLogin !== undefined) {
      updateFields.push('last_login = ?');
      updateValues.push(lastLogin);
    }
    if (isActive !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(isActive);
    }
    
    if (updateFields.length === 0) return false;
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);
    
    const query = `UPDATE admins SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await executeUpdate(query, updateValues);
    
    // Update permissions if provided
    if (permissions && result > 0) {
      // Delete existing permissions
      await executeUpdate('DELETE FROM admin_permissions WHERE admin_id = ?', [id]);
      
      // Insert new permissions
      if (permissions.length > 0) {
        const permissionQuery = `
          INSERT INTO admin_permissions (admin_id, permission)
          VALUES ?
        `;
        const permissionValues = permissions.map(permission => [id, permission]);
        await executeQuery(permissionQuery, [permissionValues]);
      }
    }
    
    return result > 0;
  }

  // Delete admin (soft delete)
  static async delete(id: number): Promise<boolean> {
    const query = 'UPDATE admins SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await executeUpdate(query, [id]);
    return result > 0;
  }

  // Compare password
  static async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
}

export default AdminModel;
