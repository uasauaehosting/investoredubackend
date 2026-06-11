export declare const REORDER_RESOURCES: {
    news: {
        table: string;
        orderColumn: string;
    };
    slides: {
        table: string;
        orderColumn: string;
    };
    members: {
        table: string;
        orderColumn: string;
    };
    'education-content': {
        table: string;
        orderColumn: string;
        scopeColumn: string;
    };
    principles: {
        table: string;
        orderColumn: string;
    };
    frameworks: {
        table: string;
        orderColumn: string;
    };
    'investment-products': {
        table: string;
        orderColumn: string;
    };
    publications: {
        table: string;
        orderColumn: string;
    };
    programs: {
        table: string;
        orderColumn: string;
    };
    portals: {
        table: string;
        orderColumn: string;
    };
    'alerts-bulletins': {
        table: string;
        orderColumn: string;
    };
    'about-sections': {
        table: string;
        orderColumn: string;
    };
    glossary: {
        table: string;
        orderColumn: string;
    };
    benchmarking: {
        table: string;
        orderColumn: string;
    };
    'global-policy-areas': {
        table: string;
        orderColumn: string;
    };
    'member-strategies-projects': {
        table: string;
        orderColumn: string;
    };
};
export type ReorderResource = keyof typeof REORDER_RESOURCES;
export declare function isReorderResource(value: string): value is ReorderResource;
export declare function reorderRecords(resource: ReorderResource, ids: number[], scope?: string): Promise<void>;
//# sourceMappingURL=reorder.d.ts.map