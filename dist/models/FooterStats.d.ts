export interface IFooterStat {
    id?: number;
    label: string;
    value: string;
    displayOrder: number;
    isActive: boolean;
}
export declare class FooterStatsModel {
    static findAll(): Promise<IFooterStat[]>;
    static upsertAll(stats: Omit<IFooterStat, 'id'>[]): Promise<void>;
    static update(id: number, data: Partial<IFooterStat>): Promise<boolean>;
}
export { FooterStatsModel as FooterStats };
//# sourceMappingURL=FooterStats.d.ts.map