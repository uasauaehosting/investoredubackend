export type PolicyInstitution = 'OECD' | 'Alliance For Financial Inclusion' | 'Others';
export type PolicyCategory = 'Consumer Empowerment and Market Conduct' | 'Digital Financial Services' | 'Emerging Financial Inclusion Areas' | 'Financial Inclusion Strategy' | 'Integrity and Stability' | 'Measuring Financial Inclusion' | 'Others' | 'Report' | 'SME Finance';
export interface GlobalPolicyArea {
    id: number;
    title: string;
    title_ar?: string | null;
    description: string | null;
    description_ar?: string | null;
    institution: string;
    category: string;
    file_url: string | null;
    date_published: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface GlobalPolicyAreaFilters {
    institutions?: string[];
    categories?: string[];
    is_active?: boolean;
}
export declare class GlobalPolicyAreasModel {
    static getAll(filters?: GlobalPolicyAreaFilters): Promise<GlobalPolicyArea[]>;
    static getById(id: number): Promise<GlobalPolicyArea | null>;
    static create(data: {
        title: string;
        title_ar?: string | null;
        description?: string | null;
        description_ar?: string | null;
        institution: string;
        category: string;
        file_url?: string | null;
        date_published?: string | null;
        is_active?: boolean;
    }): Promise<GlobalPolicyArea | null>;
    static update(id: number, data: Partial<{
        title: string;
        title_ar: string | null;
        description: string | null;
        description_ar: string | null;
        institution: string;
        category: string;
        file_url: string | null;
        date_published: string | null;
        is_active: boolean;
    }>): Promise<GlobalPolicyArea | null>;
    static softDelete(id: number): Promise<boolean>;
}
export default GlobalPolicyAreasModel;
//# sourceMappingURL=GlobalPolicyAreas.d.ts.map