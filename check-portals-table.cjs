// Check portals table structure
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function checkPortalsTable() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'investoreduuasa',
            port: process.env.DB_PORT || 3306
        });

        console.log('🔗 Connected to database');

        // Check if portals table exists
        console.log('\n📋 Checking portals table structure...');
        try {
            const [columns] = await connection.execute('DESCRIBE portals');
            console.log('Table structure:');
            columns.forEach(col => {
                console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
            });
        } catch (error) {
            console.log('❌ portals table does not exist:', error.message);
            console.log('🔧 Creating portals table...');
            
            // Create the table
            const createTableSQL = `
                CREATE TABLE portals (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    short_title VARCHAR(100) NOT NULL,
                    description TEXT,
                    image_url VARCHAR(500),
                    link VARCHAR(500) NOT NULL,
                    authority_name VARCHAR(255) NOT NULL,
                    country VARCHAR(100) NOT NULL,
                    is_active BOOLEAN DEFAULT TRUE,
                    display_order INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `;
            
            await connection.execute(createTableSQL);
            console.log('✅ portals table created successfully');
        }

        // Check if we can select from the table
        console.log('\n📥 Testing SELECT from portals...');
        try {
            const [rows] = await connection.execute('SELECT COUNT(*) as count FROM portals');
            console.log('✅ Found', rows[0].count, 'portals in database');
        } catch (error) {
            console.log('❌ SELECT Failed:', error.message);
        }

        await connection.end();
        console.log('\n🎉 Portals table check complete!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkPortalsTable();
