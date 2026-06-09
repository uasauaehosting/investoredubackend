export interface IBenchmarkingRecord {
    id?: number;
    authorityName: string;
    year: string;
    indicator: string | null;
    value: string | null;
    data: Record<string, unknown> | null;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class BenchmarkingModel {
    static create(data: Omit<IBenchmarkingRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findAll(filters?: {
        years?: string[];
        authority?: string;
    }): Promise<IBenchmarkingRecord[]>;
    static findById(id: number): Promise<IBenchmarkingRecord | null>;
    static update(id: number, data: Partial<IBenchmarkingRecord>): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
    static getFilterOptions(): Promise<{
        years: string[];
        authorities: string[];
    }>;
}
export { BenchmarkingModel as Benchmarking };
//# sourceMappingURL=Benchmarking.d.ts.map