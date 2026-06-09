"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("../utils/database");
const MIGRATIONS_DIR = path_1.default.resolve(__dirname, '../../migrations');
const MIGRATION_FILES = [
    'create_global_policy_areas_table.sql',
    'create_cms_tables.sql',
    'create_slides_table.sql',
    'create_principles_table.sql',
];
function splitStatements(sql) {
    const withoutBlockComments = sql.replace(/\/\*[\s\S]*?\*\//g, '');
    return withoutBlockComments
        .split(/;\s*\n/)
        .map((s) => s
        .split('\n')
        .filter((line) => !line.trim().startsWith('--'))
        .join('\n')
        .trim())
        .filter((s) => s.length > 0 && !/^USE\s/i.test(s));
}
async function runFile(filename) {
    const filePath = path_1.default.join(MIGRATIONS_DIR, filename);
    if (!fs_1.default.existsSync(filePath)) {
        console.log(`  ⊘ ${filename} not found`);
        return;
    }
    const sql = fs_1.default.readFileSync(filePath, 'utf-8');
    const statements = splitStatements(sql);
    for (const statement of statements) {
        try {
            await (0, database_1.executeQuery)(statement);
        }
        catch (err) {
            const msg = err.message ?? String(err);
            if (msg.includes('Duplicate column') ||
                msg.includes('already exists') ||
                msg.includes('Duplicate entry')) {
                continue;
            }
            throw err;
        }
    }
    console.log(`  ✓ ${filename} (${statements.length} statements)`);
}
async function main() {
    await (0, database_1.initConnection)();
    console.log('Running SQL migrations...\n');
    for (const file of MIGRATION_FILES) {
        await runFile(file);
    }
    console.log('\n✅ Migrations complete');
    process.exit(0);
}
main().catch((err) => {
    console.error('Migration failed:', err.message);
    process.exit(1);
});
//# sourceMappingURL=run-migrations.js.map