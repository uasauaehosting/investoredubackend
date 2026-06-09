import mysql from 'mysql2/promise';
declare const pool: mysql.Pool;
declare const connectDB: () => Promise<mysql.Pool>;
export default connectDB;
export { pool };
//# sourceMappingURL=database.d.ts.map