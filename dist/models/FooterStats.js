"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FooterStats = exports.FooterStatsModel = void 0;
const database_1 = require("../utils/database");
function mapRow(row) {
    return {
        id: row.id,
        label: row.label,
        value: row.value,
        displayOrder: row.display_order,
        isActive: row.is_active,
    };
}
class FooterStatsModel {
    static async findAll() {
        const results = await (0, database_1.executeQuery)('SELECT * FROM footer_stats WHERE is_active = true ORDER BY display_order ASC');
        return results.map(mapRow);
    }
    static async upsertAll(stats) {
        await (0, database_1.executeUpdate)('UPDATE footer_stats SET is_active = false', []);
        for (const stat of stats) {
            await (0, database_1.executeInsert)('INSERT INTO footer_stats (label, value, display_order, is_active) VALUES (?, ?, ?, ?)', [stat.label, stat.value, stat.displayOrder, true]);
        }
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        if (data.label !== undefined) {
            fields.push('label = ?');
            values.push(data.label);
        }
        if (data.value !== undefined) {
            fields.push('value = ?');
            values.push(data.value);
        }
        if (data.displayOrder !== undefined) {
            fields.push('display_order = ?');
            values.push(data.displayOrder);
        }
        if (data.isActive !== undefined) {
            fields.push('is_active = ?');
            values.push(data.isActive);
        }
        if (fields.length === 0)
            return false;
        values.push(id);
        const result = await (0, database_1.executeUpdate)(`UPDATE footer_stats SET ${fields.join(', ')} WHERE id = ?`, values);
        return result > 0;
    }
}
exports.FooterStatsModel = FooterStatsModel;
exports.FooterStats = FooterStatsModel;
//# sourceMappingURL=FooterStats.js.map