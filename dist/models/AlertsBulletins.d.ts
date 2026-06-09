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
export declare class AlertsBulletinsModel {
    static getAll(filters?: AlertBulletinFilters): Promise<AlertBulletin[]>;
    static getById(id: number): Promise<AlertBulletin | null>;
    static create(data: CreateAlertBulletinData): Promise<AlertBulletin>;
    static update(id: number, data: UpdateAlertBulletinData): Promise<AlertBulletin | null>;
    static delete(id: number): Promise<boolean>;
    static getUniqueAuthorities(): Promise<string[]>;
    static getUniqueYears(): Promise<string[]>;
    static getUniqueTypes(): Promise<string[]>;
    private static getMockData;
}
//# sourceMappingURL=AlertsBulletins.d.ts.map