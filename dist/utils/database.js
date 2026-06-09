"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeTransaction = exports.executeDelete = exports.executeUpdate = exports.executeInsert = exports.executeSingleQuery = exports.executeQuery = exports.prepareParams = exports.getConnection = exports.initConnection = void 0;
const database_1 = __importDefault(require("../config/database"));
let dbPool;
const initConnection = async () => {
    dbPool = await (0, database_1.default)();
};
exports.initConnection = initConnection;
const getConnection = () => {
    if (!dbPool) {
        throw new Error('Database connection not initialized');
    }
    return dbPool;
};
exports.getConnection = getConnection;
const prepareParams = (params) => {
    return params.map(param => param === undefined ? null : param);
};
exports.prepareParams = prepareParams;
const executeQuery = async (query, params) => {
    try {
        const preparedParams = params ? (0, exports.prepareParams)(params) : [];
        const [rows] = await dbPool.execute(query, preparedParams);
        return rows;
    }
    catch (error) {
        console.error('Query execution error:', error.message);
        throw error;
    }
};
exports.executeQuery = executeQuery;
const executeSingleQuery = async (query, params) => {
    try {
        const rows = await (0, exports.executeQuery)(query, params);
        return rows.length > 0 ? rows[0] : null;
    }
    catch (error) {
        console.error('Single query execution error:', error.message);
        throw error;
    }
};
exports.executeSingleQuery = executeSingleQuery;
const executeInsert = async (query, params) => {
    try {
        const preparedParams = params ? (0, exports.prepareParams)(params) : [];
        const [result] = await dbPool.execute(query, preparedParams);
        return result.insertId;
    }
    catch (error) {
        console.error('Insert execution error:', error.message);
        throw error;
    }
};
exports.executeInsert = executeInsert;
const executeUpdate = async (query, params) => {
    try {
        const preparedParams = params ? (0, exports.prepareParams)(params) : [];
        const [result] = await dbPool.execute(query, preparedParams);
        return result.affectedRows;
    }
    catch (error) {
        console.error('Update execution error:', error.message);
        throw error;
    }
};
exports.executeUpdate = executeUpdate;
const executeDelete = async (query, params) => {
    try {
        const preparedParams = params ? (0, exports.prepareParams)(params) : [];
        const [result] = await dbPool.execute(query, preparedParams);
        return result.affectedRows;
    }
    catch (error) {
        console.error('Delete execution error:', error.message);
        throw error;
    }
};
exports.executeDelete = executeDelete;
const executeTransaction = async (queries) => {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        for (const { query, params } of queries) {
            await connection.execute(query, params);
        }
        await connection.commit();
    }
    catch (error) {
        await connection.rollback();
        console.error('Transaction execution error:', error.message);
        throw error;
    }
    finally {
        connection.release();
    }
};
exports.executeTransaction = executeTransaction;
exports.default = {
    initConnection: exports.initConnection,
    getConnection: exports.getConnection,
    executeQuery: exports.executeQuery,
    executeSingleQuery: exports.executeSingleQuery,
    executeInsert: exports.executeInsert,
    executeUpdate: exports.executeUpdate,
    executeDelete: exports.executeDelete,
    executeTransaction: exports.executeTransaction
};
//# sourceMappingURL=database.js.map