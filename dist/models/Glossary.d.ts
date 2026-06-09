export interface IGlossaryTerm {
    id?: number;
    term: string;
    definition: string;
    category: 'Basic Concepts' | 'Investment Management' | 'Risk Management' | 'Corporate Finance' | 'Market Operations' | 'Regulatory Terms';
    language: 'English' | 'Arabic' | 'French';
    arabicTerm?: string;
    arabicDefinition?: string;
    frenchTerm?: string;
    frenchDefinition?: string;
    views: number;
    downloads: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class GlossaryTermModel {
    static create(termData: Omit<IGlossaryTerm, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(): Promise<IGlossaryTerm[]>;
    static findById(id: number): Promise<IGlossaryTerm | null>;
    static findByCategory(category: string): Promise<IGlossaryTerm[]>;
    static findByLanguage(language: string): Promise<IGlossaryTerm[]>;
    static search(searchTerm: string): Promise<IGlossaryTerm[]>;
    static update(id: number, updateData: Partial<IGlossaryTerm>): Promise<boolean>;
    static incrementViews(id: number): Promise<boolean>;
    static incrementDownloads(id: number): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
export { GlossaryTermModel as GlossaryTerm };
//# sourceMappingURL=Glossary.d.ts.map