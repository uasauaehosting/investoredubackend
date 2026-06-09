export interface IEducationContent {
    id?: number;
    section: string;
    title: string;
    description: string;
    imageUrl: string | null;
    content: string | null;
    displayOrder: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class EducationContentModel {
    static create(data: Omit<IEducationContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findBySection(section: string, activeOnly?: boolean): Promise<IEducationContent[]>;
    static findAllAdmin(section?: string): Promise<IEducationContent[]>;
    static findById(id: number, activeOnly?: boolean): Promise<IEducationContent | null>;
    static update(id: number, data: Partial<IEducationContent>): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export { EducationContentModel as EducationContent };
//# sourceMappingURL=EducationContent.d.ts.map