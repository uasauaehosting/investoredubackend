"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const database_1 = require("../utils/database");
const globalPolicyAreasSeed_1 = require("../data/globalPolicyAreasSeed");
async function main() {
    await (0, database_1.initConnection)();
    await (0, database_1.executeQuery)('DELETE FROM global_policy_areas');
    for (const row of globalPolicyAreasSeed_1.GLOBAL_POLICY_AREAS_SEED_DATA) {
        await (0, database_1.executeQuery)(`INSERT INTO global_policy_areas
        (title, description, institution, category, file_url, is_active)
       VALUES (?, ?, ?, ?, ?, true)`, [row.title, row.description, row.institution, row.category, row.file_url]);
    }
    console.log(`✅ Seeded ${globalPolicyAreasSeed_1.GLOBAL_POLICY_AREAS_SEED_DATA.length} global policy areas`);
    process.exit(0);
}
main().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed-global-policy-areas.js.map