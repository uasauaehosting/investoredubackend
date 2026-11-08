import { executeQuery, executeSingleQuery, executeInsert, executeUpdate } from '../utils/database';

export interface Portal {
    id: number;
    title: string;
    titleAr?: string;
    short_title: string;
    short_titleAr?: string;
    description: string;
    descriptionAr?: string;
    image_url: string;
    link: string;
    authority_name: string;
    authority_nameAr?: string;
    country: string;
    countryAr?: string;
    is_active: boolean;
    display_order: number;
    created_at: Date;
    updated_at: Date;
}

export interface CreatePortalData {
    title: string;
    titleAr?: string;
    short_title: string;
    short_titleAr?: string;
    description: string;
    descriptionAr?: string;
    image_url: string;
    link: string;
    authority_name: string;
    authority_nameAr?: string;
    country: string;
    countryAr?: string;
    display_order?: number;
}

export interface UpdatePortalData extends Partial<CreatePortalData> {
    is_active?: boolean;
}

export interface PortalFilters {
    authority?: string;
    country?: string;
    is_active?: boolean;
}

// Whitelist of allowed column names for UPDATE to prevent SQL injection
const PORTAL_UPDATE_FIELD_MAP: Record<keyof UpdatePortalData, string> = {
    title:              'title',
    titleAr:            'title_ar',
    short_title:        'short_title',
    short_titleAr:      'short_title_ar',
    description:        'description',
    descriptionAr:      'description_ar',
    image_url:          'image_url',
    link:               'link',
    authority_name:     'authority_name',
    authority_nameAr:   'authority_name_ar',
    country:            'country',
    countryAr:          'country_ar',
    display_order:      'display_order',
    is_active:          'is_active',
};

export class PortalModel {
    // Get all portals with optional filters
    static async getAll(filters: PortalFilters = {}): Promise<Portal[]> {
        let query = `
            SELECT * FROM portals 
            WHERE 1=1
        `;
        const params: any[] = [];

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

        return executeQuery<Portal>(query, params);
    }

    // Get portal by ID
    static async getById(id: number): Promise<Portal | null> {
        const query = 'SELECT * FROM portals WHERE id = ?';
        return executeSingleQuery<Portal>(query, [id]);
    }

    // Create new portal
    static async create(data: CreatePortalData): Promise<Portal> {
        const {
            title, titleAr, short_title, short_titleAr,
            description, descriptionAr, image_url, link,
            authority_name, authority_nameAr, country, countryAr,
            display_order = 0,
        } = data;
        const query = `
            INSERT INTO portals 
            (title, title_ar, short_title, short_title_ar, description, description_ar,
             image_url, link, authority_name, authority_name_ar, country, country_ar,
             display_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `;
        const insertId = await executeInsert(query, [
            title, titleAr ?? null, short_title, short_titleAr ?? null,
            description, descriptionAr ?? null, image_url, link,
            authority_name, authority_nameAr ?? null, country, countryAr ?? null,
            display_order,
        ]);
        return this.getById(insertId);
    }

    // Update portal — uses a whitelist column map to prevent SQL injection
    static async update(id: number, data: UpdatePortalData): Promise<Portal | null> {
        const fields: string[] = [];
        const values: any[] = [];

        for (const [key, dbColumn] of Object.entries(PORTAL_UPDATE_FIELD_MAP)) {
            const typedKey = key as keyof UpdatePortalData;
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
        const affectedRows = await executeUpdate(query, values);

        if (affectedRows > 0) {
            return this.getById(id);
        }

        return null;
    }

    // Delete portal
    static async delete(id: number): Promise<boolean> {
        const query = `DELETE FROM portals WHERE id = ?`;
        const affectedRows = await executeUpdate(query, [id]);
        return affectedRows > 0;
    }

    // Get unique authorities using SELECT DISTINCT (efficient — no JS dedup)
    static async getUniqueAuthorities(): Promise<string[]> {
        const rows = await executeQuery<{ authority_name: string }>(
            `SELECT DISTINCT authority_name FROM portals WHERE authority_name IS NOT NULL ORDER BY authority_name ASC`,
        );
        return rows.map((r) => r.authority_name);
    }

    // Get unique countries using SELECT DISTINCT (efficient — no JS dedup)
    static async getUniqueCountries(): Promise<string[]> {
        const rows = await executeQuery<{ country: string }>(
            `SELECT DISTINCT country FROM portals WHERE country IS NOT NULL ORDER BY country ASC`,
        );
        return rows.map((r) => r.country);
    }
}
