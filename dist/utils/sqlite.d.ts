import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
export declare function initializeDatabase(): Promise<Database<sqlite3.Database, sqlite3.Statement>>;
export declare function getDatabase(): Database<sqlite3.Database, sqlite3.Statement>;
export declare function executeQuery<T = any>(query: string, params?: any[]): Promise<T[]>;
export declare function executeSingleQuery<T = any>(query: string, params?: any[]): Promise<T | null>;
export declare function executeInsert(query: string, params?: any[]): Promise<number>;
export declare function executeUpdate(query: string, params?: any[]): Promise<number>;
export declare function executeDelete(query: string, params?: any[]): Promise<number>;
//# sourceMappingURL=sqlite.d.ts.map