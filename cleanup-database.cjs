// Clean up database and check what's in there
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function cleanupDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'investoreduuasa',
            port: process.env.DB_PORT || 3306
        });

        console.log('🔗 Connected to database');

        // Check all alerts in database
        console.log('\n📋 All alerts in database:');
        const [allAlerts] = await connection.execute('SELECT id, title, type, created_at FROM alerts_bulletins ORDER BY id');
        allAlerts.forEach(alert => {
            console.log(`  ID: ${alert.id}, Title: "${alert.title}", Type: ${alert.type}, Created: ${alert.created_at}`);
        });

        // Remove test alerts (IDs > 1000 are test alerts)
        console.log('\n🗑️ Cleaning up test alerts...');
        const [deleteResult] = await connection.execute('DELETE FROM alerts_bulletins WHERE id > 1000');
        console.log(`✅ Deleted ${deleteResult.affectedRows} test alerts`);

        // Check remaining alerts
        console.log('\n📋 Remaining alerts after cleanup:');
        const [remainingAlerts] = await connection.execute('SELECT id, title, type, created_at FROM alerts_bulletins ORDER BY id');
        remainingAlerts.forEach(alert => {
            console.log(`  ID: ${alert.id}, Title: "${alert.title}", Type: ${alert.type}, Created: ${alert.created_at}`);
        });

        // Add some sample real data if database is empty
        if (remainingAlerts.length === 0) {
            console.log('\n📤 Adding sample real data...');
            const sampleAlerts = [
                {
                    title: "Investment Guidelines Update",
                    type: "Alert",
                    description: "New guidelines for retail investors",
                    content: "<p>Updated investment guidelines have been released.</p>",
                    authority_name: "Saudi Capital Market Authority",
                    date: new Date('2024-01-15'),
                    priority: 'High'
                },
                {
                    title: "Market Volatility Notice",
                    type: "Bulletin", 
                    description: "Notice regarding market volatility",
                    content: "<p>Investors should be aware of current market conditions.</p>",
                    authority_name: "Qatar Financial Markets Authority",
                    date: new Date('2024-01-10'),
                    priority: 'Medium'
                }
            ];

            for (const alert of sampleAlerts) {
                const [insertResult] = await connection.execute(
                    'INSERT INTO alerts_bulletins (title, type, description, content, authority_name, date, priority, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
                    [alert.title, alert.type, alert.description, alert.content, alert.authority_name, alert.date, alert.priority]
                );
                console.log(`✅ Added sample alert with ID: ${insertResult.insertId}`);
            }
        }

        await connection.end();
        console.log('\n🎉 Database cleanup complete!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

cleanupDatabase();
