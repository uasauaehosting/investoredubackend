// Check table structure
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function checkTable() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'investoreduuasa',
            port: process.env.DB_PORT || 3306
        });

        console.log('🔗 Connected to database');

        // Check if alerts_bulletins table exists
        const [tables] = await connection.execute("SHOW TABLES LIKE 'alerts_bulletins'");
        if (tables.length === 0) {
            console.log('❌ alerts_bulletins table does not exist');
            return;
        }

        console.log('✅ alerts_bulletins table exists');

        // Get table structure
        const [columns] = await connection.execute('DESCRIBE alerts_bulletins');
        console.log('\n📋 Table structure:');
        columns.forEach(col => {
            console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
        });

        await connection.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkTable();
