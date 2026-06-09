import mysql from 'mysql2/promise';
export declare const initConnection: () => Promise<void>;
export declare const getConnection: () => mysql.Pool;
export declare const prepareParams: (params: any[]) => any[];
export declare const executeQuery: <T = any>(query: string, params?: any[]) => Promise<T[]>;
export declare const executeSingleQuery: <T = any>(query: string, params?: any[]) => Promise<T | null>;
export declare const executeInsert: (query: string, params?: any[]) => Promise<number>;
export declare const executeUpdate: (query: string, params?: any[]) => Promise<number>;
export declare const executeDelete: (query: string, params?: any[]) => Promise<number>;
export declare const executeTransaction: (queries: Array<{
    query: string;
    params?: any[];
}>) => Promise<void>;
declare const _default: {
    initConnection: () => Promise<void>;
    getConnection: () => mysql.Pool;
    executeQuery: <T = any>(query: string, params?: any[]) => Promise<T[]>;
    executeSingleQuery: <T = any>(query: string, params?: any[]) => Promise<T | null>;
    executeInsert: (query: string, params?: any[]) => Promise<number>;
    executeUpdate: (query: string, params?: any[]) => Promise<number>;
    executeDelete: (query: string, params?: any[]) => Promise<number>;
    executeTransaction: (queries: Array<{
        query: string;
        params?: any[];
    }>) => Promise<void>;
};
export default _default;
//# sourceMappingURL=database.d.ts.map