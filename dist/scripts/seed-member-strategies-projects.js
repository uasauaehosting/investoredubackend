"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const database_1 = require("../utils/database");
const memberStrategiesProjectsSeed_1 = require("../data/memberStrategiesProjectsSeed");
async function ensureSchema() {
    const cols = await (0, database_1.executeQuery)("SHOW COLUMNS FROM member_strategies_projects LIKE 'authority_name'");
    if (cols.length === 0) {
        await (0, database_1.executeQuery)('ALTER TABLE member_strategies_projects ADD COLUMN authority_name VARCHAR(255) NULL AFTER member_id');
    }
    const fileCols = await (0, database_1.executeQuery)("SHOW COLUMNS FROM member_strategies_projects LIKE 'file_url'");
    if (fileCols.length === 0) {
        await (0, database_1.executeQuery)('ALTER TABLE member_strategies_projects ADD COLUMN file_url VARCHAR(1000) NULL AFTER description');
    }
    await (0, database_1.executeQuery)('ALTER TABLE member_strategies_projects MODIFY member_id INT NULL');
}
async function main() {
    await (0, database_1.initConnection)();
    await ensureSchema();
    await (0, database_1.executeQuery)('DELETE FROM member_strategies_projects');
    for (const row of memberStrategiesProjectsSeed_1.MEMBER_STRATEGIES_PROJECTS_SEED_DATA) {
        await (0, database_1.executeQuery)(`INSERT INTO member_strategies_projects
        (title, description, authority_name, type, status, file_url, is_active)
       VALUES (?, ?, ?, ?, 'Active', ?, true)`, [row.title, row.description, row.authority_name, row.type, row.file_url]);
    }
    console.log(`✅ Seeded ${memberStrategiesProjectsSeed_1.MEMBER_STRATEGIES_PROJECTS_SEED_DATA.length} member strategies & projects`);
    process.exit(0);
}
main().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed-member-strategies-projects.js.map