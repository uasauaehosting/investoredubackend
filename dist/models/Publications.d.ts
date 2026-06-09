export type PublicationCategory = 'Brochure' | 'Code' | 'General' | 'Guide' | 'Others' | 'Report' | 'Study';
export interface Publication {
    id: number;
    title: string;
    description: string | null;
    authority_name: string;
    category: PublicationCategory;
    file_url: string | null;
    date_published: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface PublicationFilters {
    authorities?: string[];
    categories?: string[];
    is_active?: boolean;
}
export declare class PublicationsModel {
    static getAll(filters?: PublicationFilters): Promise<Publication[]>;
    static getById(id: number): Promise<Publication | null>;
    static create(data: {
        title: string;
        description?: string | null;
        authority_name: string;
        category: PublicationCategory;
        file_url?: string | null;
        date_published?: string | null;
        is_active?: boolean;
    }): Promise<Publication | null>;
    static update(id: number, data: Partial<{
        title: string;
        description: string | null;
        authority_name: string;
        category: PublicationCategory;
        file_url: string | null;
        date_published: string | null;
        is_active: boolean;
    }>): Promise<Publication | null>;
    static softDelete(id: number): Promise<boolean>;
}
export default PublicationsModel;
//# sourceMappingURL=Publications.d.ts.map