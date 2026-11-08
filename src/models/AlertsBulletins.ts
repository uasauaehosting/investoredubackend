import { executeQuery, executeSingleQuery, executeInsert, executeUpdate } from '../utils/database';

export interface AlertBulletin {
    id: number;
    title: string;
    titleAr?: string;
    type: 'Alert' | 'Bulletin';
    description: string;
    descriptionAr?: string;
    content: string;
    contentAr?: string;
    authority_name: string;
    year: string;
    date_published: Date;
    link: string;
    is_active: boolean;
    display_order: number;
    created_at: Date;
    updated_at: Date;
}

export interface CreateAlertBulletinData {
    title: string;
    titleAr?: string;
    type: 'Alert' | 'Bulletin';
    description: string;
    descriptionAr?: string;
    content: string;
    contentAr?: string;
    authority_name: string;
    year: string;
    date_published: Date;
    link: string;
    display_order?: number;
}

export interface UpdateAlertBulletinData extends Partial<CreateAlertBulletinData> {
    is_active?: boolean;
}

export interface AlertBulletinFilters {
    type?: 'Alert' | 'Bulletin';
    authority?: string;
    year?: string;
    is_active?: boolean | null;
}

export class AlertsBulletinsModel {
    // Get all alerts/bulletins with optional filters
    static async getAll(filters: AlertBulletinFilters = {}): Promise<AlertBulletin[]> {
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
        const params: any[] = [];

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

        const results = await executeQuery<any>(query, params);
        
        // Transform results to match expected interface
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

    // Get alert/bulletin by ID
    static async getById(id: number): Promise<AlertBulletin | null> {
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
        const result = await executeSingleQuery<any>(query, [id]);
        
        if (!result) return null;
        
        // Transform result to match expected interface
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

    // Create new alert/bulletin
    static async create(data: CreateAlertBulletinData): Promise<AlertBulletin> {
        const {
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
            link,
            display_order,
        } = data;
        const query = `
            INSERT INTO alerts_bulletins 
            (title, title_ar, type, description, description_ar, content, content_ar, authority_name, year, date_published, link, display_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `;
        const insertId = await executeInsert(query, [
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

    // Update alert/bulletin
    static async update(id: number, data: UpdateAlertBulletinData): Promise<AlertBulletin | null> {
        const fields: string[] = [];
        const values: any[] = [];

        // Map frontend field names to database column names
        const fieldMapping: { [key: string]: string } = {
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
                values.push((data as any)[key]);
            }
        }
        
        if (fields.length === 0) {
            return await this.getById(id);
        }

        fields.push(`updated_at = ?`);
        values.push(new Date());
        values.push(id);

        const query = `UPDATE alerts_bulletins SET ${fields.join(', ')} WHERE id = ?`;
        const affectedRows = await executeUpdate(query, values);
        
        if (affectedRows > 0) {
            return await this.getById(id);
        }
        
        return null;
    }

    // Delete alert/bulletin
    static async delete(id: number): Promise<boolean> {
        const query = `DELETE FROM alerts_bulletins WHERE id = ?`;
        const affectedRows = await executeUpdate(query, [id]);
        return affectedRows > 0;
    }

    // Get unique authorities using SELECT DISTINCT
    static async getUniqueAuthorities(): Promise<string[]> {
        const rows = await executeQuery<{ authority_name: string }>(
            `SELECT DISTINCT authority_name FROM alerts_bulletins WHERE authority_name IS NOT NULL ORDER BY authority_name ASC`,
        );
        return rows.map((r) => r.authority_name);
    }

    // Get unique years using SELECT DISTINCT
    static async getUniqueYears(): Promise<string[]> {
        const rows = await executeQuery<{ year: string }>(
            `SELECT DISTINCT year FROM alerts_bulletins WHERE year IS NOT NULL ORDER BY year DESC`,
        );
        return rows.map((r) => r.year);
    }

    // Get unique types using SELECT DISTINCT
    static async getUniqueTypes(): Promise<string[]> {
        const rows = await executeQuery<{ type: string }>(
            `SELECT DISTINCT type FROM alerts_bulletins WHERE type IS NOT NULL ORDER BY type ASC`,
        );
        return rows.map((r) => r.type);
    }
}
