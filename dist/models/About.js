"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactInfo = exports.AboutSection = exports.ContactInfoModel = exports.AboutSectionModel = void 0;
const database_1 = require("../utils/database");
class AboutSectionModel {
    static async create(sectionData) {
        const { title, content, order, isActive } = sectionData;
        const query = `
      INSERT INTO about_sections (title, content, \`order\`, is_active)
      VALUES (?, ?, ?, ?)
    `;
        return await (0, database_1.executeInsert)(query, [title, content, order, isActive]);
    }
    static async findAll() {
        const query = 'SELECT * FROM about_sections WHERE is_active = true ORDER BY `order` ASC';
        const results = await (0, database_1.executeQuery)(query);
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
    static async findById(id) {
        const query = 'SELECT * FROM about_sections WHERE id = ? AND is_active = true';
        const result = await (0, database_1.executeSingleQuery)(query, [id]);
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
    static async update(id, updateData) {
        const { title, content, order, isActive } = updateData;
        const updateFields = [];
        const updateValues = [];
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
        if (updateFields.length === 0)
            return false;
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);
        const query = `UPDATE about_sections SET ${updateFields.join(', ')} WHERE id = ?`;
        const result = await (0, database_1.executeUpdate)(query, updateValues);
        return result > 0;
    }
    static async delete(id) {
        const query = 'UPDATE about_sections SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const result = await (0, database_1.executeUpdate)(query, [id]);
        return result > 0;
    }
}
exports.AboutSectionModel = AboutSectionModel;
exports.AboutSection = AboutSectionModel;
class ContactInfoModel {
    static async create(contactData) {
        const { type, address, phone, email, isActive } = contactData;
        const query = `
      INSERT INTO contact_info (type, address, phone, email, is_active)
      VALUES (?, ?, ?, ?, ?)
    `;
        return await (0, database_1.executeInsert)(query, [type, address, phone, email, isActive]);
    }
    static async findAll() {
        const query = 'SELECT * FROM contact_info WHERE is_active = true ORDER BY type';
        const results = await (0, database_1.executeQuery)(query);
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
    static async findById(id) {
        const query = 'SELECT * FROM contact_info WHERE id = ? AND is_active = true';
        const result = await (0, database_1.executeSingleQuery)(query, [id]);
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
    static async update(id, updateData) {
        const { type, address, phone, email, isActive } = updateData;
        const updateFields = [];
        const updateValues = [];
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
        if (updateFields.length === 0)
            return false;
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);
        const query = `UPDATE contact_info SET ${updateFields.join(', ')} WHERE id = ?`;
        const result = await (0, database_1.executeUpdate)(query, updateValues);
        return result > 0;
    }
    static async delete(id) {
        const query = 'UPDATE contact_info SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const result = await (0, database_1.executeUpdate)(query, [id]);
        return result > 0;
    }
}
exports.ContactInfoModel = ContactInfoModel;
exports.ContactInfo = ContactInfoModel;
//# sourceMappingURL=About.js.map