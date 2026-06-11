"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Benchmarking = exports.BenchmarkingModel = void 0;
const database_1 = require("../utils/database");
function mapRow(row) {
    const data = row.data
        ? (typeof row.data === 'string' ? JSON.parse(row.data) : row.data)
        : null;
    return {
        id: row.id,
        authorityName: row.authority_name,
        authorityNameAr: row.authority_name_ar,
        year: row.year,
        indicator: row.indicator,
        indicatorAr: row.indicator_ar,
        value: row.value,
        data,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
class BenchmarkingModel {
    static async create(data) {
        const query = `
      INSERT INTO benchmarking_records (authority_name, authority_name_ar, year, indicator, indicator_ar, value, data, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        return (0, database_1.executeInsert)(query, [
            data.authorityName, data.authorityNameAr ?? null, data.year, data.indicator, data.indicatorAr ?? null, data.value,
            data.data ? JSON.stringify(data.data) : null,
            data.isActive !== false,
        ]);
    }
    static async findAll(filters) {
        let query = 'SELECT * FROM benchmarking_records WHERE is_active = true';
        const params = [];
        if (filters?.years?.length) {
            const placeholders = filters.years.map(() => '?').join(', ');
            query += ` AND year IN (${placeholders})`;
            params.push(...filters.years);
        }
        if (filters?.authority) {
            query += ' AND authority_name = ?';
            params.push(filters.authority);
        }
        query += ' ORDER BY display_order ASC, year DESC, authority_name ASC, id DESC';
        const results = await (0, database_1.executeQuery)(query, params);
        return results.map(mapRow);
    }
    static async findById(id) {
        const result = await (0, database_1.executeSingleQuery)('SELECT * FROM benchmarking_records WHERE id = ? AND is_active = true', [id]);
        return result ? mapRow(result) : null;
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        if (data.authorityName !== undefined) {
            fields.push('authority_name = ?');
            values.push(data.authorityName);
        }
        if (data.authorityNameAr !== undefined) {
            fields.push('authority_name_ar = ?');
            values.push(data.authorityNameAr);
        }
        if (data.year !== undefined) {
            fields.push('year = ?');
            values.push(data.year);
        }
        if (data.indicator !== undefined) {
            fields.push('indicator = ?');
            values.push(data.indicator);
        }
        if (data.indicatorAr !== undefined) {
            fields.push('indicator_ar = ?');
            values.push(data.indicatorAr);
        }
        if (data.value !== undefined) {
            fields.push('value = ?');
            values.push(data.value);
        }
        if (data.data !== undefined) {
            fields.push('data = ?');
            values.push(data.data ? JSON.stringify(data.data) : null);
        }
        if (data.isActive !== undefined) {
            fields.push('is_active = ?');
            values.push(data.isActive);
        }
        if (fields.length === 0)
            return false;
        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);
        const result = await (0, database_1.executeUpdate)(`UPDATE benchmarking_records SET ${fields.join(', ')} WHERE id = ?`, values);
        return result > 0;
    }
    static async delete(id) {
        const result = await (0, database_1.executeUpdate)('UPDATE benchmarking_records SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return result > 0;
    }
    static async getFilterOptions() {
        const years = await (0, database_1.executeQuery)('SELECT DISTINCT year FROM benchmarking_records WHERE is_active = true ORDER BY year DESC');
        const authorities = await (0, database_1.executeQuery)('SELECT DISTINCT authority_name FROM benchmarking_records WHERE is_active = true ORDER BY authority_name ASC');
        return {
            years: years.map((r) => r.year),
            authorities: authorities.map((r) => r.authority_name),
        };
    }
}
exports.BenchmarkingModel = BenchmarkingModel;
exports.Benchmarking = BenchmarkingModel;
//# sourceMappingURL=Benchmarking.js.map