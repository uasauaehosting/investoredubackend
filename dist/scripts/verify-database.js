"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const database_1 = require("../utils/database");
const TABLES = [
    'admins',
    'admin_permissions',
    'news',
    'members',
    'home_stats',
    'slides',
    'about_sections',
    'portals',
    'programs',
    'publications',
    'reading_materials',
    'member_activities',
    'principles',
    'frameworks',
    'investment_products',
    'member_strategies_projects',
    'alerts_bulletins',
    'glossary',
    'glossary_terms',
    'feedback',
    'education_content',
    'site_content',
    'footer_stats',
    'benchmarking_records',
    'global_policy_areas',
];
async function main() {
    await (0, database_1.initConnection)();
    console.log(`Database: ${process.env.DB_NAME} @ ${process.env.DB_HOST}\n`);
    console.log('Table                          | Rows');
    console.log('-------------------------------|------');
    let missing = 0;
    let empty = 0;
    for (const table of TABLES) {
        try {
            const rows = await (0, database_1.executeQuery)(`SELECT COUNT(*) AS cnt FROM \`${table}\``);
            const count = rows[0]?.cnt ?? 0;
            const status = count === 0 ? ' (empty)' : '';
            if (count === 0)
                empty++;
            console.log(`${table.padEnd(30)} | ${count}${status}`);
        }
        catch {
            missing++;
            console.log(`${table.padEnd(30)} | MISSING`);
        }
    }
    console.log(`\nSummary: ${TABLES.length - missing} tables found, ${missing} missing, ${empty} empty`);
    process.exit(missing > 5 ? 1 : 0);
}
main().catch((err) => {
    console.error('Verification failed:', err.message);
    process.exit(1);
});
//# sourceMappingURL=verify-database.js.map