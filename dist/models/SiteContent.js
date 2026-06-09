"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteContent = exports.SiteContentModel = void 0;
const database_1 = require("../utils/database");
function mapRow(row) {
    const content = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
    return {
        id: row.id,
        contentKey: row.content_key,
        content,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
class SiteContentModel {
    static async upsert(key, content) {
        const existing = await this.findByKey(key, false);
        if (existing?.id) {
            await this.update(existing.id, { content });
            return existing.id;
        }
        return this.create({ contentKey: key, content, isActive: true });
    }
    static async create(data) {
        const query = `INSERT INTO site_content (content_key, content, is_active) VALUES (?, ?, ?)`;
        return (0, database_1.executeInsert)(query, [data.contentKey, JSON.stringify(data.content), data.isActive !== false]);
    }
    static async findAll() {
        const results = await (0, database_1.executeQuery)('SELECT * FROM site_content WHERE is_active = true ORDER BY content_key');
        return results.map(mapRow);
    }
    static async findByKey(key, activeOnly = true) {
        let query = 'SELECT * FROM site_content WHERE content_key = ?';
        if (activeOnly)
            query += ' AND is_active = true';
        const result = await (0, database_1.executeSingleQuery)(query, [key]);
        return result ? mapRow(result) : null;
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        if (data.contentKey !== undefined) {
            fields.push('content_key = ?');
            values.push(data.contentKey);
        }
        if (data.content !== undefined) {
            fields.push('content = ?');
            values.push(JSON.stringify(data.content));
        }
        if (data.isActive !== undefined) {
            fields.push('is_active = ?');
            values.push(data.isActive);
        }
        if (fields.length === 0)
            return false;
        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);
        const result = await (0, database_1.executeUpdate)(`UPDATE site_content SET ${fields.join(', ')} WHERE id = ?`, values);
        return result > 0;
    }
    static async delete(id) {
        const result = await (0, database_1.executeUpdate)('UPDATE site_content SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return result > 0;
    }
}
exports.SiteContentModel = SiteContentModel;
exports.SiteContent = SiteContentModel;
//# sourceMappingURL=SiteContent.js.map