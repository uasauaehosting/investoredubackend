"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalModel = void 0;
const database_1 = require("../utils/database");
const PORTAL_UPDATE_FIELD_MAP = {
    title: 'title',
    titleAr: 'title_ar',
    short_title: 'short_title',
    short_titleAr: 'short_title_ar',
    description: 'description',
    descriptionAr: 'description_ar',
    image_url: 'image_url',
    imageAr: 'image_ar',
    link: 'link',
    authority_name: 'authority_name',
    authority_nameAr: 'authority_name_ar',
    country: 'country',
    countryAr: 'country_ar',
    display_order: 'display_order',
    is_active: 'is_active',
};
class PortalModel {
    static async getAll(filters = {}) {
        let query = `
            SELECT * FROM portals 
            WHERE 1=1
        `;
        const params = [];
        if (filters.authority) {
            query += ` AND authority_name = ?`;
            params.push(filters.authority);
        }
        if (filters.country) {
            query += ` AND country = ?`;
            params.push(filters.country);
        }
        if (filters.is_active !== undefined) {
            query += ` AND is_active = ?`;
            params.push(filters.is_active);
        }
        query += ` ORDER BY display_order ASC, created_at DESC`;
        return (0, database_1.executeQuery)(query, params);
    }
    static async getById(id) {
        const query = 'SELECT * FROM portals WHERE id = ?';
        return (0, database_1.executeSingleQuery)(query, [id]);
    }
    static async create(data) {
        const { title, titleAr, short_title, short_titleAr, description, descriptionAr, image_url, imageAr, link, authority_name, authority_nameAr, country, countryAr, display_order = 0, } = data;
        const query = `
            INSERT INTO portals 
            (title, title_ar, short_title, short_title_ar, description, description_ar,
             image_url, image_ar, link, authority_name, authority_name_ar, country, country_ar,
             display_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `;
        const insertId = await (0, database_1.executeInsert)(query, [
            title, titleAr ?? null, short_title, short_titleAr ?? null,
            description, descriptionAr ?? null, image_url, imageAr ?? null, link,
            authority_name, authority_nameAr ?? null, country, countryAr ?? null,
            display_order,
        ]);
        return this.getById(insertId);
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        for (const [key, dbColumn] of Object.entries(PORTAL_UPDATE_FIELD_MAP)) {
            const typedKey = key;
            if (typedKey in data && data[typedKey] !== undefined) {
                fields.push(`${dbColumn} = ?`);
                values.push(data[typedKey]);
            }
        }
        if (fields.length === 0) {
            return this.getById(id);
        }
        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);
        const query = `UPDATE portals SET ${fields.join(', ')} WHERE id = ?`;
        const affectedRows = await (0, database_1.executeUpdate)(query, values);
        if (affectedRows > 0) {
            return this.getById(id);
        }
        return null;
    }
    static async delete(id) {
        const query = `DELETE FROM portals WHERE id = ?`;
        const affectedRows = await (0, database_1.executeUpdate)(query, [id]);
        return affectedRows > 0;
    }
    static async getUniqueAuthorities() {
        const rows = await (0, database_1.executeQuery)(`SELECT DISTINCT authority_name FROM portals WHERE authority_name IS NOT NULL ORDER BY authority_name ASC`);
        return rows.map((r) => r.authority_name);
    }
    static async getUniqueCountries() {
        const rows = await (0, database_1.executeQuery)(`SELECT DISTINCT country FROM portals WHERE country IS NOT NULL ORDER BY country ASC`);
        return rows.map((r) => r.country);
    }
}
exports.PortalModel = PortalModel;
//# sourceMappingURL=Portals.js.map