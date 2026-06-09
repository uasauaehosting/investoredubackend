export interface IAdmin {
    id?: number;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'Super Admin' | 'Admin' | 'Editor';
    permissions: string[];
    lastLogin?: Date;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class AdminModel {
    static create(adminData: Omit<IAdmin, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>;
    static findByEmail(email: string): Promise<IAdmin | null>;
    static findByUsername(username: string): Promise<IAdmin | null>;
    static findById(id: number): Promise<IAdmin | null>;
    static findAll(): Promise<IAdmin[]>;
    static update(id: number, updateData: Partial<IAdmin>): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
    static comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean>;
}
export default AdminModel;
//# sourceMappingURL=Admin.d.ts.map