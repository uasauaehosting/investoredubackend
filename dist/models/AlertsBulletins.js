"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsBulletinsModel = void 0;
const database_1 = require("../utils/database");
class AlertsBulletinsModel {
    static async getAll(filters = {}) {
        let query = `
            SELECT 
                id, title, title_ar, type, description, description_ar,
                authority_name, year,
                DATE_FORMAT(date_published, '%Y-%m-%dT%H:%i:%s.000Z') as date_published, 
                content, content_ar, link, is_active, display_order,
                DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.000Z') as created_at, 
                DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.000Z') as updated_at
            FROM alerts_bulletins WHERE 1=1
        `;
        const params = [];
        if (filters.type) {
            query += ` AND type = ?`;
            params.push(filters.type);
        }
        if (filters.authority && filters.authority !== 'All Authorities') {
            query += ` AND authority_name = ?`;
            params.push(filters.authority);
        }
        if (filters.year && filters.year !== 'All Years') {
            query += ` AND (year = ? OR YEAR(date_published) = ?)`;
            params.push(filters.year, filters.year);
        }
        if (filters.is_active !== undefined && filters.is_active !== null) {
            query += ` AND is_active = ?`;
            params.push(filters.is_active);
        }
        query += ` ORDER BY is_active DESC, display_order ASC, date_published DESC, created_at DESC`;
        const results = await (0, database_1.executeQuery)(query, params);
        return results.map(result => ({
            id: result.id,
            title: result.title,
            titleAr: result.title_ar,
            type: result.type,
            description: result.description || '',
            descriptionAr: result.description_ar || '',
            content: result.content,
            contentAr: result.content_ar,
            authority_name: result.authority_name || '',
            year: result.year || new Date(result.date_published).getFullYear().toString(),
            date_published: result.date_published,
            link: result.link || '',
            is_active: result.is_active,
            display_order: result.display_order ?? 0,
            created_at: result.created_at,
            updated_at: result.updated_at
        }));
    }
    static async getById(id) {
        const query = `
            SELECT 
                id, title, title_ar, type, description, description_ar,
                content, content_ar, authority_name, year,
                DATE_FORMAT(date_published, '%Y-%m-%dT%H:%i:%s.000Z') as date_published, 
                link, is_active, display_order,
                DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.000Z') as created_at, 
                DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.000Z') as updated_at
            FROM alerts_bulletins WHERE id = ?
        `;
        const result = await (0, database_1.executeSingleQuery)(query, [id]);
        if (!result)
            return null;
        return {
            id: result.id,
            title: result.title,
            titleAr: result.title_ar,
            type: result.type,
            description: result.description || '',
            descriptionAr: result.description_ar || '',
            content: result.content,
            contentAr: result.content_ar,
            authority_name: result.authority_name || '',
            year: result.year || new Date(result.date_published).getFullYear().toString(),
            date_published: result.date_published,
            link: result.link || '',
            is_active: result.is_active,
            display_order: result.display_order ?? 0,
            created_at: result.created_at,
            updated_at: result.updated_at
        };
    }
    static async create(data) {
        const { title, titleAr, type, description, descriptionAr, content, contentAr, authority_name, year, date_published, link, display_order, } = data;
        const query = `
            INSERT INTO alerts_bulletins 
            (title, title_ar, type, description, description_ar, content, content_ar, authority_name, year, date_published, link, display_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `;
        const insertId = await (0, database_1.executeInsert)(query, [
            title,
            titleAr,
            type,
            description,
            descriptionAr,
            content,
            contentAr,
            authority_name,
            year,
            date_published,
            link ?? '',
            display_order ?? 0,
        ]);
        return await this.getById(insertId);
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        const fieldMapping = {
            'title': 'title',
            'titleAr': 'title_ar',
            'type': 'type',
            'description': 'description',
            'descriptionAr': 'description_ar',
            'content': 'content',
            'contentAr': 'content_ar',
            'authority_name': 'authority_name',
            'year': 'year',
            'date_published': 'date_published',
            'link': 'link',
            'display_order': 'display_order',
            'is_active': 'is_active'
        };
        for (const key in data) {
            if (data.hasOwnProperty(key) && fieldMapping[key]) {
                const dbField = fieldMapping[key];
                fields.push(`${dbField} = ?`);
                values.push(data[key]);
            }
        }
        if (fields.length === 0) {
            return await this.getById(id);
        }
        fields.push(`updated_at = ?`);
        values.push(new Date());
        values.push(id);
        const query = `UPDATE alerts_bulletins SET ${fields.join(', ')} WHERE id = ?`;
        const affectedRows = await (0, database_1.executeUpdate)(query, values);
        if (affectedRows > 0) {
            return await this.getById(id);
        }
        return null;
    }
    static async delete(id) {
        const query = `DELETE FROM alerts_bulletins WHERE id = ?`;
        const affectedRows = await (0, database_1.executeUpdate)(query, [id]);
        return affectedRows > 0;
    }
    static async getUniqueAuthorities() {
        const rows = await (0, database_1.executeQuery)(`SELECT DISTINCT authority_name FROM alerts_bulletins WHERE authority_name IS NOT NULL ORDER BY authority_name ASC`);
        return rows.map((r) => r.authority_name);
    }
    static async getUniqueYears() {
        const rows = await (0, database_1.executeQuery)(`SELECT DISTINCT year FROM alerts_bulletins WHERE year IS NOT NULL ORDER BY year DESC`);
        return rows.map((r) => r.year);
    }
    static async getUniqueTypes() {
        const rows = await (0, database_1.executeQuery)(`SELECT DISTINCT type FROM alerts_bulletins WHERE type IS NOT NULL ORDER BY type ASC`);
        return rows.map((r) => r.type);
    }
}
exports.AlertsBulletinsModel = AlertsBulletinsModel;
//# sourceMappingURL=AlertsBulletins.js.map