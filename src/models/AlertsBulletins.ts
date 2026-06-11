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
                id, title, type, description, authority_name, year,
                DATE_FORMAT(date_published, '%Y-%m-%dT%H:%i:%s.000Z') as date_published, 
                content, link, is_active, display_order,
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
                id, title, type, description, content, authority_name, year,
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

    // Get unique authorities
    static async getUniqueAuthorities(): Promise<string[]> {
        const alerts = await this.getAll();
        const authorities = [...new Set(alerts.map(alert => alert.authority_name))];
        return authorities.sort();
    }

    // Get unique years
    static async getUniqueYears(): Promise<string[]> {
        const alerts = await this.getAll();
        const years = [...new Set(alerts.map(alert => alert.year).filter(Boolean))];
        return years.sort((a, b) => b.localeCompare(a));
    }

    // Get unique types
    static async getUniqueTypes(): Promise<string[]> {
        const alerts = await this.getAll();
        const types = [...new Set(alerts.map(alert => alert.type))];
        return types;
    }

    // Mock data for development
    private static async getMockData(filters: AlertBulletinFilters = {}): Promise<AlertBulletin[]> {
        const allData: AlertBulletin[] = [
            {
                id: 1,
                title: "New Investment Guidelines for Retail Investors",
                type: "Alert",
                description: "Updated guidelines for retail investment protection and risk disclosure requirements",
                content: "<p>Comprehensive guidelines for retail investment protection and risk disclosure requirements have been updated to enhance investor safety and market transparency.</p><p>Key changes include enhanced disclosure requirements for investment products and improved risk assessment protocols.</p>",
                authority_name: "Saudi Capital Market Authority",
                year: "2024",
                date_published: new Date("2024-01-15"),
                link: "https://www.cma.gov.sa/new-guidelines",
                is_active: true,
                display_order: 1,
                created_at: new Date("2024-01-15"),
                updated_at: new Date("2024-01-15")
            },
            {
                id: 2,
                title: "Market Alert: Increased Volatility in Technology Stocks",
                type: "Alert",
                description: "Warning about increased volatility in technology sector investments",
                content: "<p>Investors are advised to exercise caution when investing in technology stocks due to recent market volatility.</p><p>Market analysis shows significant price fluctuations in technology sector securities.</p>",
                authority_name: "Qatar Financial Markets Authority",
                year: "2024",
                date_published: new Date("2024-01-10"),
                link: "https://www.qfma.org.qa/market-alert",
                is_active: true,
                display_order: 2,
                created_at: new Date("2024-01-10"),
                updated_at: new Date("2024-01-10")
            },
            {
                id: 3,
                title: "Regulatory Changes for Cryptocurrency Trading",
                type: "Bulletin",
                description: "New regulatory framework for cryptocurrency trading platforms",
                content: "<p>A comprehensive regulatory framework has been established for cryptocurrency trading platforms operating in the region.</p><p>The framework includes licensing requirements, consumer protection measures, and anti-money laundering compliance.</p>",
                authority_name: "Financial Regulatory Authority - Egypt",
                year: "2023",
                date_published: new Date("2023-12-20"),
                link: "https://www.fra.gov.eg/crypto-framework",
                is_active: true,
                display_order: 3,
                created_at: new Date("2023-12-20"),
                updated_at: new Date("2023-12-20")
            },
            {
                id: 4,
                title: "SME Finance Access and Growth Strategy",
                type: "Bulletin",
                description: "Strategic approach to improving SME access to financial services",
                content: "<p>A comprehensive strategy has been developed to improve Small and Medium Enterprise access to financial services.</p><p>The strategy includes new financing products and simplified application processes.</p>",
                authority_name: "OECD",
                year: "2023",
                date_published: new Date("2023-11-15"),
                link: "https://www.oecd.org/sme-finance",
                is_active: true,
                display_order: 4,
                created_at: new Date("2023-11-15"),
                updated_at: new Date("2023-11-15")
            },
            {
                id: 5,
                title: "Consumer Protection Guidelines for Digital Banking",
                type: "Bulletin",
                description: "Guidelines to protect consumers in digital banking environments",
                content: "<p>New guidelines have been issued to protect consumers using digital banking services.</p><p>The guidelines cover data protection, fraud prevention, and dispute resolution mechanisms.</p>",
                authority_name: "Alliance For Financial Inclusion",
                year: "2023",
                date_published: new Date("2023-10-20"),
                link: "https://www.afi.org/digital-banking",
                is_active: true,
                display_order: 5,
                created_at: new Date("2023-10-20"),
                updated_at: new Date("2023-10-20")
            },
            {
                id: 6,
                title: "Financial Inclusion Measurement Index",
                type: "Bulletin",
                description: "Standardized methodology for measuring financial inclusion",
                content: "<p>A standardized methodology for measuring financial inclusion across different regions and demographics.</p><p>The index provides comparable data for policy makers and financial institutions.</p>",
                authority_name: "Alliance For Financial Inclusion",
                year: "2022",
                date_published: new Date("2022-09-10"),
                link: "https://www.afi.org/inclusion-index",
                is_active: true,
                display_order: 6,
                created_at: new Date("2022-09-10"),
                updated_at: new Date("2022-09-10")
            },
            {
                id: 7,
                title: "Emerging Technologies in Financial Services",
                type: "Bulletin",
                description: "Analysis of emerging technologies and their impact on financial inclusion",
                content: "<p>Analysis of emerging technologies including blockchain, AI, and digital payments in financial services.</p><p>The report examines opportunities and challenges for financial inclusion.</p>",
                authority_name: "OECD",
                year: "2022",
                date_published: new Date("2022-08-15"),
                link: "https://www.oecd.org/fintech-report",
                is_active: true,
                display_order: 7,
                created_at: new Date("2022-08-15"),
                updated_at: new Date("2022-08-15")
            },
            {
                id: 8,
                title: "Market Integrity and Stability Framework",
                type: "Bulletin",
                description: "Framework for maintaining market integrity while promoting financial inclusion",
                content: "<p>A comprehensive framework for maintaining market integrity while promoting financial inclusion initiatives.</p><p>The framework balances regulatory oversight with innovation support.</p>",
                authority_name: "Alliance For Financial Inclusion",
                year: "2022",
                date_published: new Date("2022-07-20"),
                link: "https://www.afi.org/market-integrity",
                is_active: true,
                display_order: 8,
                created_at: new Date("2022-07-20"),
                updated_at: new Date("2022-07-20")
            }
        ];

        // Apply filters
        let filtered = allData;

        if (filters.type) {
            filtered = filtered.filter(item => item.type === filters.type);
        }

        if (filters.authority) {
            filtered = filtered.filter(item => item.authority_name === filters.authority);
        }

        if (filters.year) {
            filtered = filtered.filter(item => item.year === filters.year);
        }

        if (filters.is_active !== undefined) {
            filtered = filtered.filter(item => item.is_active === filters.is_active);
        }

        return filtered;
    }
}
