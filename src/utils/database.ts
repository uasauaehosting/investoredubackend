import mysql from 'mysql2/promise';
import connectDB, { pool } from '../config/database';

let dbPool: mysql.Pool;

export const initConnection = async (): Promise<void> => {
  dbPool = await connectDB();
};

export const getConnection = (): mysql.Pool => {
  if (!dbPool) {
    throw new Error('Database connection not initialized');
  }
  return dbPool;
};

// Helper function to convert undefined to null for SQL parameters
export const prepareParams = (params: any[]): any[] => {
  return params.map(param => param === undefined ? null : param);
};

// Generic query executor
export const executeQuery = async <T = any>(
  query: string, 
  params?: any[]
): Promise<T[]> => {
  try {
    const preparedParams = params ? prepareParams(params) : [];
    const [rows] = await dbPool.execute(query, preparedParams);
    return rows as T[];
  } catch (error: any) {
    console.error('Query execution error:', error.message);
    throw error;
  }
};

// Generic single record query
export const executeSingleQuery = async <T = any>(
  query: string, 
  params?: any[]
): Promise<T | null> => {
  try {
    const rows = await executeQuery<T>(query, params);
    return rows.length > 0 ? rows[0] : null;
  } catch (error: any) {
    console.error('Single query execution error:', error.message);
    throw error;
  }
};

// Insert query
export const executeInsert = async (
  query: string, 
  params?: any[]
): Promise<number> => {
  try {
    const preparedParams = params ? prepareParams(params) : [];
    const [result] = await dbPool.execute(query, preparedParams);
    return (result as mysql.ResultSetHeader).insertId;
  } catch (error: any) {
    console.error('Insert execution error:', error.message);
    throw error;
  }
};

// Update query
export const executeUpdate = async (
  query: string, 
  params?: any[]
): Promise<number> => {
  try {
    const preparedParams = params ? prepareParams(params) : [];
    const [result] = await dbPool.execute(query, preparedParams);
    return (result as mysql.ResultSetHeader).affectedRows;
  } catch (error: any) {
    console.error('Update execution error:', error.message);
    throw error;
  }
};

// Delete query
export const executeDelete = async (
  query: string, 
  params?: any[]
): Promise<number> => {
  try {
    const preparedParams = params ? prepareParams(params) : [];
    const [result] = await dbPool.execute(query, preparedParams);
    return (result as mysql.ResultSetHeader).affectedRows;
  } catch (error: any) {
    console.error('Delete execution error:', error.message);
    throw error;
  }
};

// Transaction support
export const executeTransaction = async (
  queries: Array<{ query: string; params?: any[] }>
): Promise<void> => {
  const connection = await dbPool.getConnection();
  try {
    await connection.beginTransaction();
    
    for (const { query, params } of queries) {
      await connection.execute(query, params);
    }
    
    await connection.commit();
  } catch (error: any) {
    await connection.rollback();
    console.error('Transaction execution error:', error.message);
    throw error;
  } finally {
    connection.release();
  }
};

export default {
  initConnection,
  getConnection,
  executeQuery,
  executeSingleQuery,
  executeInsert,
  executeUpdate,
  executeDelete,
  executeTransaction
};
