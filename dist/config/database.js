"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'investoreduuasa',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
exports.pool = pool;
const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL Connected successfully');
        connection.release();
        return pool;
    }
    catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map