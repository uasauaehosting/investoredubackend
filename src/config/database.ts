import mysql from 'mysql2/promise';

// Create connection pool for better connection management
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'investoreduuasa',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const connectDB = async (): Promise<mysql.Pool> => {
  try {
    // Test the connection
    const connection = await pool.getConnection();
    console.log('MySQL Connected successfully');
    connection.release();
    return pool;
  } catch (error: any) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
export { pool };
