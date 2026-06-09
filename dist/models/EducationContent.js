"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationContent = exports.EducationContentModel = void 0;
const database_1 = require("../utils/database");
function mapRow(row) {
    return {
        id: row.id,
        section: row.section,
        title: row.title,
        description: row.description,
        imageUrl: row.image_url,
        content: row.content,
        displayOrder: row.display_order,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
class EducationContentModel {
    static async create(data) {
        const query = `
      INSERT INTO education_content (section, title, description, image_url, content, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
        return (0, database_1.executeInsert)(query, [
            data.section, data.title, data.description,
            data.imageUrl, data.content, data.displayOrder,
            data.isActive !== false,
        ]);
    }
    static async findBySection(section, activeOnly = true) {
        let query = 'SELECT * FROM education_content WHERE section = ?';
        const params = [section];
        if (activeOnly) {
            query += ' AND is_active = true';
        }
        query += ' ORDER BY display_order ASC, id ASC';
        const results = await (0, database_1.executeQuery)(query, params);
        return results.map(mapRow);
    }
    static async findAllAdmin(section) {
        let query = 'SELECT * FROM education_content WHERE 1=1';
        const params = [];
        if (section) {
            query += ' AND section = ?';
            params.push(section);
        }
        query += ' ORDER BY section ASC, display_order ASC, id ASC';
        const results = await (0, database_1.executeQuery)(query, params);
        return results.map(mapRow);
    }
    static async findById(id, activeOnly = true) {
        let query = 'SELECT * FROM education_content WHERE id = ?';
        if (activeOnly)
            query += ' AND is_active = true';
        const result = await (0, database_1.executeSingleQuery)(query, [id]);
        return result ? mapRow(result) : null;
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        if (data.section !== undefined) {
            fields.push('section = ?');
            values.push(data.section);
        }
        if (data.title !== undefined) {
            fields.push('title = ?');
            values.push(data.title);
        }
        if (data.description !== undefined) {
            fields.push('description = ?');
            values.push(data.description);
        }
        if (data.imageUrl !== undefined) {
            fields.push('image_url = ?');
            values.push(data.imageUrl);
        }
        if (data.content !== undefined) {
            fields.push('content = ?');
            values.push(data.content);
        }
        if (data.displayOrder !== undefined) {
            fields.push('display_order = ?');
            values.push(data.displayOrder);
        }
        if (data.isActive !== undefined) {
            fields.push('is_active = ?');
            values.push(data.isActive);
        }
        if (fields.length === 0)
            return false;
        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);
        const result = await (0, database_1.executeUpdate)(`UPDATE education_content SET ${fields.join(', ')} WHERE id = ?`, values);
        return result > 0;
    }
    static async delete(id) {
        const result = await (0, database_1.executeUpdate)('UPDATE education_content SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return result > 0;
    }
}
exports.EducationContentModel = EducationContentModel;
exports.EducationContent = EducationContentModel;
//# sourceMappingURL=EducationContent.js.map