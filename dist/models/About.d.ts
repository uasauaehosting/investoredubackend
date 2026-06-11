export interface IAboutSection {
    id?: number;
    title: string;
    titleAr?: string;
    content: string;
    contentAr?: string;
    order: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IContactInfo {
    id?: number;
    type: 'headquarters' | 'contact';
    address?: string;
    phone?: string;
    email?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class AboutSectionModel {
    static create(sectionData: Omit<IAboutSection, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<IAboutSection[]>;
    static findById(id: number): Promise<IAboutSection | null>;
    static update(id: number, updateData: Partial<IAboutSection>): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export declare class ContactInfoModel {
    static create(contactData: Omit<IContactInfo, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<IContactInfo[]>;
    static findById(id: number): Promise<IContactInfo | null>;
    static update(id: number, updateData: Partial<IContactInfo>): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export { AboutSectionModel as AboutSection, ContactInfoModel as ContactInfo };
//# sourceMappingURL=About.d.ts.map