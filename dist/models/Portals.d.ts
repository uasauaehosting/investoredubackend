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
export declare class PortalModel {
    static getAll(filters?: PortalFilters): Promise<Portal[]>;
    static getById(id: number): Promise<Portal | null>;
    static create(data: CreatePortalData): Promise<Portal>;
    static update(id: number, data: UpdatePortalData): Promise<Portal | null>;
    static delete(id: number): Promise<boolean>;
    static getUniqueAuthorities(): Promise<string[]>;
    static getUniqueCountries(): Promise<string[]>;
    private static getMockData;
}
//# sourceMappingURL=Portals.d.ts.map