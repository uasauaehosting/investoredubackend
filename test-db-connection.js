const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Database Config:');
  console.log('Host:', process.env.DB_HOST);
  console.log('User:', process.env.DB_USER);
  console.log('Password:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
  console.log('Database:', process.env.DB_NAME);
  console.log('Port:', process.env.DB_PORT);
  
  // First test with root user to see if MySQL is running
  console.log('\n=== Testing with root user ===');
  try {
    const rootConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: 'root',
      password: '',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      charset: 'utf8mb4'
    });

    console.log('✅ MySQL server is running (root connection successful)');
    
    // Check if the target database exists
    const [databases] = await rootConnection.execute('SHOW DATABASES');
    const targetDb = process.env.DB_NAME || 'investoreduuasa';
    const dbExists = databases.some(db => db.Database === targetDb);
    
    console.log(`Database '${targetDb}' exists:`, dbExists);
    
    if (!dbExists) {
      console.log(`Creating database '${targetDb}'...`);
      await rootConnection.execute(`CREATE DATABASE ${targetDb}`);
      console.log('✅ Database created successfully');
    }
    
    // Check if the user exists
    const [users] = await rootConnection.execute("SELECT User FROM mysql.user WHERE User = ?", [process.env.DB_USER]);
    const userExists = users.length > 0;
    
    console.log(`User '${process.env.DB_USER}' exists:`, userExists);
    
    if (!userExists) {
      console.log(`Creating user '${process.env.DB_USER}'...`);
      await rootConnection.execute(`CREATE USER '${process.env.DB_USER}'@'localhost' IDENTIFIED BY '${process.env.DB_PASSWORD}'`);
      console.log('✅ User created successfully');
      
      // Grant permissions
      await rootConnection.execute(`GRANT ALL PRIVILEGES ON ${targetDb}.* TO '${process.env.DB_USER}'@'localhost'`);
      await rootConnection.execute('FLUSH PRIVILEGES');
      console.log('✅ Permissions granted successfully');
    }
    
    await rootConnection.end();
    
    // Now test with the actual user
    console.log('\n=== Testing with configured user ===');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'investoreduuasa',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      charset: 'utf8mb4'
    });

    console.log('✅ Database connected successfully!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test passed:', rows);
    
    await connection.end();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('Error Number:', error.errno);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check if MySQL server is running');
      console.log('2. Verify username and password are correct');
      console.log('3. Ensure user has permissions for the database');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Possible solutions:');
      console.log('1. MySQL server is not running');
      console.log('2. Wrong port number');
      console.log('3. Firewall blocking connection');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Possible solutions:');
      console.log('1. Database does not exist');
      console.log('2. Run the database setup script first');
    }
  }
}

testConnection();
