import { executeQuery, executeSingleQuery, executeInsert, executeUpdate } from '../utils/database';

export interface Programs {
  id: number;
  member_name: string;
  member_name_ar?: string | null;
  general_info: string | null;
  general_info_ar?: string | null;
  education_materials: string | null;
  education_materials_ar?: string | null;
  specific_materials: string | null;
  specific_materials_ar?: string | null;
  assisting_groups: string | null;
  assisting_groups_ar?: string | null;
  evaluation: string | null;
  evaluation_ar?: string | null;
  successful_programs: string | null;
  successful_programs_ar?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProgramsData {
  member_name: string;
  member_name_ar?: string | null;
  general_info?: string[] | null;
  general_info_ar?: string[] | null;
  education_materials?: string[] | null;
  education_materials_ar?: string[] | null;
  specific_materials?: string[] | null;
  specific_materials_ar?: string[] | null;
  assisting_groups?: string[] | null;
  assisting_groups_ar?: string[] | null;
  evaluation?: string[] | null;
  evaluation_ar?: string[] | null;
  successful_programs?: string[] | null;
  successful_programs_ar?: string[] | null;
  is_active?: boolean;
}

export interface UpdateProgramsData extends Partial<CreateProgramsData> {
  id: number;
}

export class ProgramsModel {
  // Get all programs
  static async findAll(): Promise<Programs[]> {
    const query = 'SELECT * FROM programs ORDER BY display_order ASC, created_at DESC, id DESC';
    return executeQuery(query);
  }

  // Get program by ID
  static async findById(id: number): Promise<Programs | null> {
    const query = 'SELECT * FROM programs WHERE id = ?';
    const results = await executeQuery(query, [id]);
    return results.length > 0 ? results[0] : null;
  }

  // Get programs by member name
  static async findByMember(memberName: string): Promise<Programs[]> {
    const query = 'SELECT * FROM programs WHERE member_name = ? ORDER BY display_order ASC, created_at DESC, id DESC';
    return executeQuery(query, [memberName]);
  }

  // Get active programs only
  static async findActive(): Promise<Programs[]> {
    const query = 'SELECT * FROM programs WHERE is_active = true ORDER BY display_order ASC, created_at DESC, id DESC';
    return executeQuery(query);
  }

  // Create new program
  static async create(data: CreateProgramsData): Promise<Programs> {
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

    const insertId = await executeInsert(query, params);
    return this.findById(insertId);
  }

  // Update program
  static async update(id: number, data: UpdateProgramsData): Promise<Programs | null> {
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

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE programs SET ${fields.join(', ')} WHERE id = ?`;
    await executeUpdate(query, params);
    return this.findById(id);
  }

  // Delete program (soft delete by setting is_active to false)
  static async softDelete(id: number): Promise<boolean> {
    const query = 'UPDATE programs SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const affectedRows = await executeUpdate(query, [id]);
    return affectedRows > 0;
  }

  // Hard delete program
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM programs WHERE id = ?';
    const affectedRows = await executeUpdate(query, [id]);
    return affectedRows > 0;
  }

  // Search programs by member name
  static async search(searchTerm: string): Promise<Programs[]> {
    const query = 'SELECT * FROM programs WHERE member_name LIKE ? ORDER BY display_order ASC, created_at DESC, id DESC';
    return executeQuery(query, [`%${searchTerm}%`]);
  }

  // Count total programs
  static async count(): Promise<number> {
    const query = 'SELECT COUNT(*) as count FROM programs';
    const result = await executeQuery(query);
    return result[0]?.count || 0;
  }

  // Count active programs
  static async countActive(): Promise<number> {
    const query = 'SELECT COUNT(*) as count FROM programs WHERE is_active = true';
    const result = await executeQuery(query);
    return result[0]?.count || 0;
  }
}

export default ProgramsModel;
