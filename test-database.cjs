// Test Database Connection and Table Structure
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function testDatabase() {
    console.log('🚀 Testing Database Connection and Structure...\n');

    try {
        // Test connection
        console.log('🔗 Testing database connection...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'investoreduuasa',
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ Database connection successful');

        // Test if alerts_bulletins table exists
        console.log('\n📋 Checking alerts_bulletins table structure...');
        const [rows] = await connection.execute('DESCRIBE alerts_bulletins');
        console.log('Table structure:');
        rows.forEach(row => {
            console.log(`  ${row.Field}: ${row.Type} ${row.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${row.Default ? `DEFAULT ${row.Default}` : ''}`);
        });

        // Test if we can select from the table
        console.log('\n📥 Testing SELECT from alerts_bulletins...');
        const [selectRows] = await connection.execute('SELECT COUNT(*) as count FROM alerts_bulletins');
        console.log(`✅ Found ${selectRows[0].count} records in alerts_bulletins table`);

        // Test a simple insert
        console.log('\n📤 Testing simple INSERT...');
        const insertQuery = `
            INSERT INTO alerts_bulletins 
            (title, type, description, content, authority_name, year, date_published, link, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [insertResult] = await connection.execute(insertQuery, [
            'Database Test Alert',
            'Alert',
            'This is a database test alert',
            '<p>Database test content</p>',
            'Test Authority',
            '2024',
            '2024-01-01T00:00:00.000Z',
            'https://test.com',
            0
        ]);
        console.log(`✅ Insert successful - ID: ${insertResult.insertId}`);

        // Test the inserted record
        console.log('\n📥 Testing SELECT inserted record...');
        const [testRows] = await connection.execute('SELECT * FROM alerts_bulletins WHERE id = ?', [insertResult.insertId]);
        console.log('✅ Retrieved record:', JSON.stringify(testRows[0], null, 2));

        // Clean up
        await connection.execute('DELETE FROM alerts_bulletins WHERE id = ?', [insertResult.insertId]);
        console.log('\n🗑️ Cleaned up test record');

        await connection.end();
        console.log('\n🎉 Database testing complete!');

    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Run the test
testDatabase();
