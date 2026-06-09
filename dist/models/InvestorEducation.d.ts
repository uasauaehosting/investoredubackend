export interface IAuthority {
    id?: number;
    name: string;
    nameAr?: string;
    type: 'University' | 'Hospital' | 'Government Body' | 'Research Institute' | 'Other';
    description?: string;
    descriptionAr?: string;
    website?: string;
    logo?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ICategory {
    id?: number;
    name: string;
    authorityId: number;
    description?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IReadingMaterial {
    id?: number;
    title: string;
    description: string;
    category: 'Principles' | 'Framework' | 'Investment Products/ Literature';
    author: string;
    date: Date;
    pdfUrl: string;
    authorityId?: number;
    categoryId?: number;
    views: number;
    downloads: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IFramework {
    id?: number;
    title: string;
    description: string;
    author: string;
    date: Date;
    fileUrl: string;
    imageUrl: string;
    content?: string;
    authorityId?: number;
    categoryId?: number;
    views: number;
    downloads: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IPrinciple {
    id?: number;
    title: string;
    description: string;
    author: string;
    date: Date;
    fileUrl: string;
    imageUrl: string;
    content?: string;
    authorityId?: number;
    categoryId?: number;
    views: number;
    downloads: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IInvestmentProduct {
    id?: number;
    title: string;
    description: string;
    author: string;
    date: Date;
    fileUrl: string;
    imageUrl: string;
    content?: string;
    slug?: string;
    authorityId?: number;
    categoryId?: number;
    views: number;
    downloads: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IMemberActivity {
    id?: number;
    title: string;
    description: string;
    type: 'Campaign' | 'Workshop' | 'Digital Initiative' | 'Conference' | 'Training';
    organization: string;
    date: Date;
    status: 'Active' | 'Ongoing' | 'Live' | 'Completed' | 'Upcoming';
    participants: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export type StrategyProjectType = 'Strategy' | 'Report';
export interface IMemberStrategyProject {
    id?: number;
    title: string;
    description: string;
    authority_name: string;
    memberId?: number | null;
    type: StrategyProjectType | string;
    status?: string;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    budget?: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    memberName?: string;
    categoryName?: string | null;
    fileUrl?: string | null;
    date?: Date | string | null;
}
export interface IAlertBulletin {
    id?: number;
    title: string;
    description: string;
    type: 'Alert' | 'Bulletin' | 'Notice' | 'Warning';
    priority: 'High' | 'Medium' | 'Low';
    date: Date;
    author: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class AuthorityModel {
    static create(authorityData: Omit<IAuthority, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<IAuthority[]>;
    static findById(id: number): Promise<IAuthority | null>;
    static update(id: number, updateData: Partial<IAuthority>): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export declare class CategoryModel {
    static create(categoryData: Omit<ICategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<ICategory[]>;
    static findById(id: number): Promise<ICategory | null>;
    static findByAuthority(authorityId: number): Promise<ICategory[]>;
    static update(id: number, updateData: Partial<ICategory>): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export declare class ReadingMaterialModel {
    static create(materialData: Omit<IReadingMaterial, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<IReadingMaterial[]>;
    static findById(id: number): Promise<IReadingMaterial | null>;
    static findByCategory(category: string): Promise<IReadingMaterial[]>;
    static update(id: number, updateData: Partial<IReadingMaterial>): Promise<boolean>;
    static incrementViews(id: number): Promise<boolean>;
    static incrementDownloads(id: number): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export declare class FrameworkModel {
    static create(frameworkData: Omit<IFramework, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<IFramework[]>;
    static findById(id: number): Promise<IFramework | null>;
    static update(id: number, updateData: Partial<IFramework>): Promise<boolean>;
    static incrementViews(id: number): Promise<boolean>;
    static incrementDownloads(id: number): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export declare class PrincipleModel {
    static create(principleData: Omit<IPrinciple, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<IPrinciple[]>;
    static findAllAdmin(): Promise<IPrinciple[]>;
    private static mapPrincipleRow;
    static findById(id: number): Promise<IPrinciple | null>;
    static update(id: number, updateData: Partial<IPrinciple>): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export declare class InvestmentProductModel {
    static create(productData: Omit<IInvestmentProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<IInvestmentProduct[]>;
    static findAllAdmin(): Promise<IInvestmentProduct[]>;
    static findById(id: number): Promise<IInvestmentProduct | null>;
    static findBySlug(slug: string): Promise<IInvestmentProduct | null>;
    static update(id: number, updateData: Partial<IInvestmentProduct>): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export declare class MemberActivityModel {
    static create(activityData: Omit<IMemberActivity, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<IMemberActivity[]>;
    static findById(id: number): Promise<IMemberActivity | null>;
    static findByType(type: string): Promise<IMemberActivity[]>;
    static update(id: number, updateData: Partial<IMemberActivity>): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export declare class MemberStrategyProjectModel {
    private static mapRow;
    static create(projectData: {
        title: string;
        description: string;
        authority_name: string;
        type: StrategyProjectType | string;
        file_url?: string | null;
        isActive?: boolean;
    }): Promise<number>;
    static findAll(options?: {
        includeInactive?: boolean;
    }): Promise<IMemberStrategyProject[]>;
    static findById(id: number, includeInactive?: boolean): Promise<IMemberStrategyProject | null>;
    static update(id: number, updateData: Partial<IMemberStrategyProject> & {
        file_url?: string | null;
    }): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export declare class AlertBulletinModel {
    static create(bulletinData: Omit<IAlertBulletin, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<IAlertBulletin[]>;
    static findById(id: number): Promise<IAlertBulletin | null>;
    static findByPriority(priority: string): Promise<IAlertBulletin[]>;
    static update(id: number, updateData: Partial<IAlertBulletin>): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export { AuthorityModel as Authority, CategoryModel as Category, ReadingMaterialModel as ReadingMaterial, MemberActivityModel as MemberActivity, MemberStrategyProjectModel as MemberStrategyProject, AlertBulletinModel as AlertBulletin };
//# sourceMappingURL=InvestorEducation.d.ts.map