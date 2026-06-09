"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalModel = void 0;
const database_1 = require("../utils/database");
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
        const results = await (0, database_1.executeQuery)(query, params);
        return results;
    }
    static async getById(id) {
        const query = 'SELECT * FROM portals WHERE id = ?';
        const result = await (0, database_1.executeSingleQuery)(query, [id]);
        return result;
    }
    static async create(data) {
        const { title, titleAr, short_title, short_titleAr, description, descriptionAr, image_url, link, authority_name, authority_nameAr, country, countryAr, display_order = 0 } = data;
        const query = `
            INSERT INTO portals 
            (title, title_ar, short_title, short_title_ar, description, description_ar, image_url, link, authority_name, authority_name_ar, country, country_ar, display_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `;
        const insertId = await (0, database_1.executeInsert)(query, [title, titleAr, short_title, short_titleAr, description, descriptionAr, image_url, link, authority_name, authority_nameAr, country, countryAr, display_order]);
        return await this.getById(insertId);
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                fields.push(`${key} = ?`);
                values.push(data[key]);
            }
        }
        if (fields.length === 0) {
            return await this.getById(id);
        }
        fields.push(`updated_at = ?`);
        values.push(new Date());
        values.push(id);
        const query = `UPDATE portals SET ${fields.join(', ')} WHERE id = ?`;
        const affectedRows = await (0, database_1.executeUpdate)(query, values);
        if (affectedRows > 0) {
            return await this.getById(id);
        }
        return null;
    }
    static async delete(id) {
        const query = `DELETE FROM portals WHERE id = ?`;
        const affectedRows = await (0, database_1.executeUpdate)(query, [id]);
        return affectedRows > 0;
    }
    static async getUniqueAuthorities() {
        const portals = await this.getAll();
        const authorities = [...new Set(portals.map(portal => portal.authority_name))];
        return authorities.sort();
    }
    static async getUniqueCountries() {
        const portals = await this.getAll();
        const countries = [...new Set(portals.map(portal => portal.country).filter(Boolean))];
        return countries.sort();
    }
    static async getMockData() {
        return [
            {
                id: 1,
                title: "Conseil du Marché Financier - Tunisia",
                short_title: "CMF - Tunisia",
                description: "Financial market regulatory authority for Tunisia",
                image_url: "http://uasa.ae/en/galorg/30312018123118Tunisia2.png",
                link: "https://www.myinvestia.com/",
                authority_name: "Conseil du Marché Financier - Tunisia",
                country: "Tunisia",
                is_active: true,
                display_order: 1,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 2,
                title: "Commission d'Organisation et de Surveillance des opérations de Bourse",
                short_title: "COSOB - Algeria",
                description: "Securities exchange commission for Algeria",
                image_url: "http://uasa.ae/en/galorg/30532018125329Algeria.png",
                link: "http://www.cosob.org/guides/",
                authority_name: "Commission d'Organisation et de Surveillance des opérations de Bourse",
                country: "Algeria",
                is_active: true,
                display_order: 2,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 3,
                title: "Saudi Capital Market Authority",
                short_title: "CMA - Saudi Arabia",
                description: "Capital market authority for Saudi Arabia",
                image_url: "http://uasa.ae/en/galorg/30542018125450KSA2.png",
                link: "https://www.si.org.sa/?lang=en",
                authority_name: "Saudi Capital Market Authority",
                country: "Saudi Arabia",
                is_active: true,
                display_order: 3,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 4,
                title: "Syrian Commission on financial markets and securities",
                short_title: "SCFMS - Syria",
                description: "Financial markets and securities commission for Syria",
                image_url: "http://uasa.ae/en/galorg/30552018125546Syria.png",
                link: "http://scfms.sy/awarenessLetters/ar/37/0/?????-???????",
                authority_name: "Syrian Commission on financial markets and securities",
                country: "Syria",
                is_active: true,
                display_order: 4,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 5,
                title: "Palestine Capital Market Authority",
                short_title: "PCMA - Palestine",
                description: "Capital market authority for Palestine",
                image_url: "http://uasa.ae/en/galorg/30572018125706Palestine.png",
                link: "http://www.pcma.ps/portal/awareness/SitePages/Home.aspx",
                authority_name: "Palestine Capital Market Authority",
                country: "Palestine",
                is_active: true,
                display_order: 5,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 6,
                title: "Qatar Financial Markets Authority",
                short_title: "QFMA - Qatar",
                description: "Financial markets authority for Qatar",
                image_url: "http://uasa.ae/en/galorg/30592018125923Qatar.png",
                link: "https://www.qfma.org.qa/English/mediacenter/pages/investorawareness.aspx",
                authority_name: "Qatar Financial Markets Authority",
                country: "Qatar",
                is_active: true,
                display_order: 6,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 7,
                title: "Kuwait Capital Markets Authority",
                short_title: "CMA - Kuwait",
                description: "Capital markets authority for Kuwait",
                image_url: "http://uasa.ae/en/galorg/30042018010402Kuwait.png",
                link: "https://www.cma.gov.kw/ar/web/cma/awareness",
                authority_name: "Kuwait Capital Markets Authority",
                country: "Kuwait",
                is_active: true,
                display_order: 7,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 8,
                title: "Capital Markets Authority of Lebanon",
                short_title: "CMA - Lebanon",
                description: "Capital markets authority for Lebanon",
                image_url: "http://uasa.ae/en/galorg/30272018012743Lebanon.png",
                link: "https://www.cma.gov.lb/investor-education/",
                authority_name: "Capital Markets Authority of Lebanon",
                country: "Lebanon",
                is_active: true,
                display_order: 8,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 9,
                title: "Financial Regulatory Authority - Egypt",
                short_title: "FRA - Egypt",
                description: "Financial regulatory authority for Egypt",
                image_url: "http://uasa.ae/en/galorg/30432018014338Egypt.png",
                link: "http://www.iinvest.org.eg/general/index.jsp",
                authority_name: "Financial Regulatory Authority - Egypt",
                country: "Egypt",
                is_active: true,
                display_order: 9,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 10,
                title: "Autorité Marocaine du Marché des Capitaux (AMMC)",
                short_title: "AMMC - Morocco",
                description: "Capital market authority for Morocco",
                image_url: "http://uasa.ae/en/galorg/30442018014432Morocco.png",
                link: "http://www.ammc.ma/en/espace-epargnants",
                authority_name: "Autorité Marocaine du Marché des Capitaux (AMMC)",
                country: "Morocco",
                is_active: true,
                display_order: 10,
                created_at: new Date(),
                updated_at: new Date()
            }
        ];
    }
}
exports.PortalModel = PortalModel;
//# sourceMappingURL=Portals.js.map