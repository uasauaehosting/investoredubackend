"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationsModel = void 0;
const database_1 = require("../utils/database");
class PublicationsModel {
    static async getAll(filters = {}) {
        let query = `
      SELECT
        id, title, description, authority_name, category, file_url,
        DATE_FORMAT(date_published, '%Y-%m-%d') as date_published,
        is_active,
        DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.000Z') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.000Z') as updated_at
      FROM publications
      WHERE 1=1
    `;
        const params = [];
        if (filters.is_active !== undefined) {
            query += ' AND is_active = ?';
            params.push(filters.is_active);
        }
        else {
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
        return (0, database_1.executeQuery)(query, params);
    }
    static async getById(id) {
        const query = `
      SELECT
        id, title, description, authority_name, category, file_url,
        DATE_FORMAT(date_published, '%Y-%m-%d') as date_published,
        is_active,
        DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.000Z') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.000Z') as updated_at
      FROM publications
      WHERE id = ?
    `;
        return (0, database_1.executeSingleQuery)(query, [id]);
    }
    static async create(data) {
        const query = `
      INSERT INTO publications (title, description, authority_name, category, file_url, date_published, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
        const insertId = await (0, database_1.executeInsert)(query, [
            data.title,
            data.description ?? null,
            data.authority_name,
            data.category,
            data.file_url ?? null,
            data.date_published ?? null,
            data.is_active !== undefined ? data.is_active : true,
        ]);
        return this.getById(insertId);
    }
    static async update(id, data) {
        const fields = [];
        const params = [];
        if (data.title !== undefined) {
            fields.push('title = ?');
            params.push(data.title);
        }
        if (data.description !== undefined) {
            fields.push('description = ?');
            params.push(data.description);
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
        if (fields.length === 0)
            return this.getById(id);
        fields.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);
        await (0, database_1.executeUpdate)(`UPDATE publications SET ${fields.join(', ')} WHERE id = ?`, params);
        return this.getById(id);
    }
    static async softDelete(id) {
        const affected = await (0, database_1.executeUpdate)('UPDATE publications SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return affected > 0;
    }
}
exports.PublicationsModel = PublicationsModel;
exports.default = PublicationsModel;
//# sourceMappingURL=Publications.js.map