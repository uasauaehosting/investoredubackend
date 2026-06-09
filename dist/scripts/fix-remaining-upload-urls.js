"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const database_1 = require("../utils/database");
const ftp_1 = require("../utils/ftp");
const URL_COLUMNS = ['image_url', 'file_url', 'image', 'thumbnail_url', 'cover_image'];
const OLD_PATTERN = '%ahwuae.com/investoredu/%uploads/%';
const CORRECT_PATTERN = '%investorupload/uploads/%';
async function main() {
    await (0, database_1.initConnection)();
    const placeholders = URL_COLUMNS.map(() => '?').join(', ');
    const columns = await (0, database_1.executeQuery)(`SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND COLUMN_NAME IN (${placeholders})`, [process.env.DB_NAME, ...URL_COLUMNS]);
    let updated = 0;
    for (const { TABLE_NAME, COLUMN_NAME } of columns) {
        const rows = await (0, database_1.executeQuery)(`SELECT id, \`${COLUMN_NAME}\` AS val FROM \`${TABLE_NAME}\`
       WHERE \`${COLUMN_NAME}\` LIKE ? AND \`${COLUMN_NAME}\` NOT LIKE ?`, [OLD_PATTERN, CORRECT_PATTERN]);
        for (const row of rows) {
            const next = (0, ftp_1.normalizeMediaUrl)(row.val);
            if (!next || next === row.val)
                continue;
            await (0, database_1.executeUpdate)(`UPDATE \`${TABLE_NAME}\` SET \`${COLUMN_NAME}\` = ? WHERE id = ?`, [next, row.id]);
            console.log(`[${TABLE_NAME}.${COLUMN_NAME}] #${row.id}`);
            console.log(`  ${row.val}`);
            console.log(`  -> ${next}`);
            updated++;
        }
    }
    console.log(`\nUpdated ${updated} row(s)`);
}
main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
//# sourceMappingURL=fix-remaining-upload-urls.js.map