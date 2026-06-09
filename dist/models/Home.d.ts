export interface INews {
    id?: number;
    title: string;
    titleAr?: string;
    excerpt: string;
    excerptAr?: string;
    fullDetail?: string;
    fullDetailAr?: string;
    category?: string;
    link: string;
    image?: string;
    pdfFile?: string;
    date?: Date;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IMember {
    id?: number;
    name: string;
    nameAr?: string;
    country: string;
    countryAr?: string;
    website?: string;
    logo?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IHomeStats {
    id?: number;
    readingMaterials: string;
    membersActivities: string;
    alertsBulletins: string;
    lastUpdated: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ISlide {
    id?: number;
    title: string;
    subtitle?: string;
    image_url?: string;
    cta_text?: string;
    cta_href?: string;
    display_order: number;
    is_active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class NewsModel {
    static create(newsData: Omit<INews, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<INews[]>;
    static findById(id: number): Promise<INews | null>;
    static update(id: number, updateData: Partial<INews>): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export declare class MemberModel {
    static create(memberData: Omit<IMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<IMember[]>;
    static findById(id: number): Promise<IMember | null>;
    static update(id: number, updateData: Partial<IMember>): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export declare class HomeStatsModel {
    static create(statsData: Omit<IHomeStats, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findLatest(): Promise<IHomeStats | null>;
    static update(id: number, updateData: Partial<IHomeStats>): Promise<boolean>;
}
export declare class SlideModel {
    static create(slideData: Omit<ISlide, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<ISlide[]>;
    static findById(id: number): Promise<ISlide | null>;
    static update(id: number, updateData: Partial<ISlide>): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export { NewsModel as News, MemberModel as Member, HomeStatsModel as HomeStats, SlideModel as Slide };
//# sourceMappingURL=Home.d.ts.map