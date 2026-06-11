"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REORDER_RESOURCES = void 0;
exports.isReorderResource = isReorderResource;
exports.reorderRecords = reorderRecords;
const database_1 = require("./database");
exports.REORDER_RESOURCES = {
    news: { table: 'news', orderColumn: 'display_order' },
    slides: { table: 'slides', orderColumn: 'display_order' },
    members: { table: 'members', orderColumn: 'display_order' },
    'education-content': { table: 'education_content', orderColumn: 'display_order', scopeColumn: 'section' },
    principles: { table: 'principles', orderColumn: 'display_order' },
    frameworks: { table: 'frameworks', orderColumn: 'display_order' },
    'investment-products': { table: 'investment_products', orderColumn: 'display_order' },
    publications: { table: 'publications', orderColumn: 'display_order' },
    programs: { table: 'programs', orderColumn: 'display_order' },
    portals: { table: 'portals', orderColumn: 'display_order' },
    'alerts-bulletins': { table: 'alerts_bulletins', orderColumn: 'display_order' },
    'about-sections': { table: 'about_sections', orderColumn: '`order`' },
    glossary: { table: 'glossary_terms', orderColumn: 'display_order' },
    benchmarking: { table: 'benchmarking_records', orderColumn: 'display_order' },
    'global-policy-areas': { table: 'global_policy_areas', orderColumn: 'display_order' },
    'member-strategies-projects': { table: 'member_strategies_projects', orderColumn: 'display_order' },
};
function isReorderResource(value) {
    return value in exports.REORDER_RESOURCES;
}
async function reorderRecords(resource, ids, scope) {
    const config = exports.REORDER_RESOURCES[resource];
    for (let i = 0; i < ids.length; i++) {
        let query = `UPDATE ${config.table} SET ${config.orderColumn} = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        const values = [i + 1, ids[i]];
        const scopeColumn = 'scopeColumn' in config ? config.scopeColumn : undefined;
        if (scopeColumn) {
            if (!scope) {
                throw new Error(`Scope is required for resource: ${resource}`);
            }
            query += ` AND ${scopeColumn} = ?`;
            values.push(scope);
        }
        await (0, database_1.executeUpdate)(query, values);
    }
}
//# sourceMappingURL=reorder.js.map