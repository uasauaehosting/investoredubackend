"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../utils/database");
class AdminModel {
    static async create(adminData) {
        const { username, email, password, firstName, lastName, role, permissions, lastLogin, isActive } = adminData;
        const salt = await bcryptjs_1.default.genSalt(12);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const query = `
      INSERT INTO admins (username, email, password, first_name, last_name, role, last_login, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const adminId = await (0, database_1.executeInsert)(query, [username, email, hashedPassword, firstName, lastName, role, lastLogin, isActive]);
        if (permissions && permissions.length > 0) {
            const permissionQuery = `
        INSERT INTO admin_permissions (admin_id, permission)
        VALUES ?
      `;
            const permissionValues = permissions.map(permission => [adminId, permission]);
            await (0, database_1.executeQuery)(permissionQuery, [permissionValues]);
        }
        return adminId;
    }
    static async findByEmail(email) {
        const query = `
      SELECT a.*, GROUP_CONCAT(ap.permission) as permissions
      FROM admins a
      LEFT JOIN admin_permissions ap ON a.id = ap.admin_id
      WHERE a.email = ? AND a.is_active = true
      GROUP BY a.id
    `;
        const result = await (0, database_1.executeSingleQuery)(query, [email]);
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
    static async findByUsername(username) {
        const query = `
      SELECT a.*, GROUP_CONCAT(ap.permission) as permissions
      FROM admins a
      LEFT JOIN admin_permissions ap ON a.id = ap.admin_id
      WHERE a.username = ? AND a.is_active = true
      GROUP BY a.id
    `;
        try {
            const result = await (0, database_1.executeSingleQuery)(query, [username]);
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
        }
        catch (error) {
            if (error.message.includes("admin_permissions") || error.message.includes("doesn't exist")) {
                const fallbackQuery = 'SELECT * FROM admins WHERE username = ? AND is_active = true';
                const result = await (0, database_1.executeSingleQuery)(fallbackQuery, [username]);
                if (result) {
                    return {
                        id: result.id,
                        username: result.username,
                        email: result.email,
                        password: result.password,
                        firstName: result.first_name,
                        lastName: result.last_name,
                        role: result.role,
                        permissions: ['all_access'],
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
    static async findById(id) {
        const query = `
      SELECT a.*, GROUP_CONCAT(ap.permission) as permissions
      FROM admins a
      LEFT JOIN admin_permissions ap ON a.id = ap.admin_id
      WHERE a.id = ? AND a.is_active = true
      GROUP BY a.id
    `;
        try {
            const result = await (0, database_1.executeSingleQuery)(query, [id]);
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
        }
        catch (error) {
            if (error.message.includes("admin_permissions") || error.message.includes("doesn't exist")) {
                const fallbackQuery = 'SELECT * FROM admins WHERE id = ? AND is_active = true';
                const result = await (0, database_1.executeSingleQuery)(fallbackQuery, [id]);
                if (result) {
                    return {
                        id: result.id,
                        username: result.username,
                        email: result.email,
                        password: result.password,
                        firstName: result.first_name,
                        lastName: result.last_name,
                        role: result.role,
                        permissions: ['all_access'],
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
    static async findAll() {
        const query = `
      SELECT a.*, GROUP_CONCAT(ap.permission) as permissions
      FROM admins a
      LEFT JOIN admin_permissions ap ON a.id = ap.admin_id
      WHERE a.is_active = true
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `;
        const results = await (0, database_1.executeQuery)(query);
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
    static async update(id, updateData) {
        const { username, email, password, firstName, lastName, role, permissions, lastLogin, isActive } = updateData;
        const updateFields = [];
        const updateValues = [];
        if (username !== undefined) {
            updateFields.push('username = ?');
            updateValues.push(username);
        }
        if (email !== undefined) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }
        if (password !== undefined) {
            const salt = await bcryptjs_1.default.genSalt(12);
            const hashedPassword = await bcryptjs_1.default.hash(password, salt);
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
        if (updateFields.length === 0)
            return false;
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);
        const query = `UPDATE admins SET ${updateFields.join(', ')} WHERE id = ?`;
        const result = await (0, database_1.executeUpdate)(query, updateValues);
        if (permissions && result > 0) {
            await (0, database_1.executeUpdate)('DELETE FROM admin_permissions WHERE admin_id = ?', [id]);
            if (permissions.length > 0) {
                const permissionQuery = `
          INSERT INTO admin_permissions (admin_id, permission)
          VALUES ?
        `;
                const permissionValues = permissions.map(permission => [id, permission]);
                await (0, database_1.executeQuery)(permissionQuery, [permissionValues]);
            }
        }
        return result > 0;
    }
    static async delete(id) {
        const query = 'UPDATE admins SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const result = await (0, database_1.executeUpdate)(query, [id]);
        return result > 0;
    }
    static async comparePassword(candidatePassword, hashedPassword) {
        return bcryptjs_1.default.compare(candidatePassword, hashedPassword);
    }
}
exports.AdminModel = AdminModel;
exports.default = AdminModel;
//# sourceMappingURL=Admin.js.map