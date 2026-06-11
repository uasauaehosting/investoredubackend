"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramsModel = void 0;
const database_1 = require("../utils/database");
class ProgramsModel {
    static async findAll() {
        const query = 'SELECT * FROM programs ORDER BY display_order ASC, created_at DESC, id DESC';
        return (0, database_1.executeQuery)(query);
    }
    static async findById(id) {
        const query = 'SELECT * FROM programs WHERE id = ?';
        const results = await (0, database_1.executeQuery)(query, [id]);
        return results.length > 0 ? results[0] : null;
    }
    static async findByMember(memberName) {
        const query = 'SELECT * FROM programs WHERE member_name = ? ORDER BY display_order ASC, created_at DESC, id DESC';
        return (0, database_1.executeQuery)(query, [memberName]);
    }
    static async findActive() {
        const query = 'SELECT * FROM programs WHERE is_active = true ORDER BY display_order ASC, created_at DESC, id DESC';
        return (0, database_1.executeQuery)(query);
    }
    static async create(data) {
        const query = `
      INSERT INTO programs (
        member_name, member_name_ar, general_info, general_info_ar, education_materials, education_materials_ar,
        specific_materials, specific_materials_ar, assisting_groups, assisting_groups_ar,
        evaluation, evaluation_ar, successful_programs, successful_programs_ar, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const params = [
            data.member_name,
            data.member_name_ar ?? null,
            JSON.stringify(data.general_info || []),
            JSON.stringify(data.general_info_ar || []),
            JSON.stringify(data.education_materials || []),
            JSON.stringify(data.education_materials_ar || []),
            JSON.stringify(data.specific_materials || []),
            JSON.stringify(data.specific_materials_ar || []),
            JSON.stringify(data.assisting_groups || []),
            JSON.stringify(data.assisting_groups_ar || []),
            JSON.stringify(data.evaluation || []),
            JSON.stringify(data.evaluation_ar || []),
            JSON.stringify(data.successful_programs || []),
            JSON.stringify(data.successful_programs_ar || []),
            data.is_active !== undefined ? data.is_active : true
        ];
        const insertId = await (0, database_1.executeInsert)(query, params);
        return this.findById(insertId);
    }
    static async update(id, data) {
        const fields = [];
        const params = [];
        if (data.member_name !== undefined) {
            fields.push('member_name = ?');
            params.push(data.member_name);
        }
        if (data.member_name_ar !== undefined) {
            fields.push('member_name_ar = ?');
            params.push(data.member_name_ar);
        }
        if (data.general_info !== undefined) {
            fields.push('general_info = ?');
            params.push(JSON.stringify(data.general_info));
        }
        if (data.general_info_ar !== undefined) {
            fields.push('general_info_ar = ?');
            params.push(JSON.stringify(data.general_info_ar));
        }
        if (data.education_materials !== undefined) {
            fields.push('education_materials = ?');
            params.push(JSON.stringify(data.education_materials));
        }
        if (data.education_materials_ar !== undefined) {
            fields.push('education_materials_ar = ?');
            params.push(JSON.stringify(data.education_materials_ar));
        }
        if (data.specific_materials !== undefined) {
            fields.push('specific_materials = ?');
            params.push(JSON.stringify(data.specific_materials));
        }
        if (data.specific_materials_ar !== undefined) {
            fields.push('specific_materials_ar = ?');
            params.push(JSON.stringify(data.specific_materials_ar));
        }
        if (data.assisting_groups !== undefined) {
            fields.push('assisting_groups = ?');
            params.push(JSON.stringify(data.assisting_groups));
        }
        if (data.assisting_groups_ar !== undefined) {
            fields.push('assisting_groups_ar = ?');
            params.push(JSON.stringify(data.assisting_groups_ar));
        }
        if (data.evaluation !== undefined) {
            fields.push('evaluation = ?');
            params.push(JSON.stringify(data.evaluation));
        }
        if (data.evaluation_ar !== undefined) {
            fields.push('evaluation_ar = ?');
            params.push(JSON.stringify(data.evaluation_ar));
        }
        if (data.successful_programs !== undefined) {
            fields.push('successful_programs = ?');
            params.push(JSON.stringify(data.successful_programs));
        }
        if (data.successful_programs_ar !== undefined) {
            fields.push('successful_programs_ar = ?');
            params.push(JSON.stringify(data.successful_programs_ar));
        }
        if (data.is_active !== undefined) {
            fields.push('is_active = ?');
            params.push(data.is_active);
        }
        if (fields.length === 0)
            return this.findById(id);
        fields.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);
        const query = `UPDATE programs SET ${fields.join(', ')} WHERE id = ?`;
        await (0, database_1.executeUpdate)(query, params);
        return this.findById(id);
    }
    static async softDelete(id) {
        const query = 'UPDATE programs SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const affectedRows = await (0, database_1.executeUpdate)(query, [id]);
        return affectedRows > 0;
    }
    static async delete(id) {
        const query = 'DELETE FROM programs WHERE id = ?';
        const affectedRows = await (0, database_1.executeUpdate)(query, [id]);
        return affectedRows > 0;
    }
    static async search(searchTerm) {
        const query = 'SELECT * FROM programs WHERE member_name LIKE ? ORDER BY display_order ASC, created_at DESC, id DESC';
        return (0, database_1.executeQuery)(query, [`%${searchTerm}%`]);
    }
    static async count() {
        const query = 'SELECT COUNT(*) as count FROM programs';
        const result = await (0, database_1.executeQuery)(query);
        return result[0]?.count || 0;
    }
    static async countActive() {
        const query = 'SELECT COUNT(*) as count FROM programs WHERE is_active = true';
        const result = await (0, database_1.executeQuery)(query);
        return result[0]?.count || 0;
    }
}
exports.ProgramsModel = ProgramsModel;
exports.default = ProgramsModel;
//# sourceMappingURL=Programs.js.map