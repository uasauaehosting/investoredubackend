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
export declare class ProgramsModel {
    static findAll(): Promise<Programs[]>;
    static findById(id: number): Promise<Programs | null>;
    static findByMember(memberName: string): Promise<Programs[]>;
    static findActive(): Promise<Programs[]>;
    static create(data: CreateProgramsData): Promise<Programs>;
    static update(id: number, data: UpdateProgramsData): Promise<Programs | null>;
    static softDelete(id: number): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
    static search(searchTerm: string): Promise<Programs[]>;
    static count(): Promise<number>;
    static countActive(): Promise<number>;
}
export default ProgramsModel;
//# sourceMappingURL=Programs.d.ts.map