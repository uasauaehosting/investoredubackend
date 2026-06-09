export interface ISiteContent {
    id?: number;
    contentKey: string;
    content: Record<string, unknown>;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class SiteContentModel {
    static upsert(key: string, content: Record<string, unknown>): Promise<number>;
    static create(data: Omit<ISiteContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<ISiteContent[]>;
    static findByKey(key: string, activeOnly?: boolean): Promise<ISiteContent | null>;
    static update(id: number, data: Partial<ISiteContent>): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export { SiteContentModel as SiteContent };
//# sourceMappingURL=SiteContent.d.ts.map