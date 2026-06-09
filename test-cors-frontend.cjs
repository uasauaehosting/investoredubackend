// Test CORS and Frontend API Access
const axios = require('axios');

const baseURL = 'http://localhost:5001/api';

async function testCORSForFrontend() {
    console.log('🚀 Testing CORS and Frontend API Access...\n');

    try {
        // Test 1: Simulate frontend GET request (like browser would make)
        console.log('📥 Testing GET request (like frontend)');
        try {
            const response = await axios.get(`${baseURL}/alerts-bulletins`, {
                headers: {
                    'Origin': 'http://localhost:5173',
                    'Referer': 'http://localhost:5173/'
                }
            });
            
            console.log('✅ GET Success');
            console.log('CORS Headers:', response.headers['access-control-allow-origin']);
            console.log('Data count:', response.data.length);
            
        } catch (error) {
            console.log('❌ GET Failed:', error.response?.data || error.message);
            console.log('CORS Issue detected!');
        }

        // Test 2: Simulate frontend POST request (like browser would make)
        console.log('\n📤 Testing POST request (like frontend)');
        try {
            const response = await axios.post(`${baseURL}/alerts-bulletins`, {
                title: "CORS Test Alert",
                type: "Alert",
                description: "Testing CORS from frontend",
                content: "<p>CORS test content</p>",
                authority_name: "Saudi Capital Market Authority",
                year: "2024",
                date_published: new Date().toISOString(),
                link: "https://test.com",
                display_order: 0,
                is_active: true
            }, {
                headers: {
                    'Origin': 'http://localhost:5173',
                    'Referer': 'http://localhost:5173/',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ POST Success - Created ID:', response.data.id);
            
        } catch (error) {
            console.log('❌ POST Failed:', error.response?.data || error.message);
            console.log('Status:', error.response?.status);
            console.log('CORS Issue detected!');
        }

        // Test 3: Check if frontend is getting mock data instead of real data
        console.log('\n🔍 Checking for mock data vs real data');
        try {
            const response = await axios.get(`${baseURL}/alerts-bulletins`);
            const data = response.data;
            
            // Check if data looks like mock data (has specific mock IDs)
            const hasMockIds = data.some(alert => [1, 2, 3].includes(alert.id));
            const hasRealIds = data.some(alert => alert.id > 1000);
            
            console.log('Data sample:', data.slice(0, 2));
            console.log('Has mock IDs (1,2,3):', hasMockIds);
            console.log('Has real IDs (>1000):', hasRealIds);
            
            if (hasMockIds && !hasRealIds) {
                console.log('⚠️  Warning: Frontend might be showing mock data!');
            } else if (hasRealIds) {
                console.log('✅ Frontend should be showing real database data');
            }
            
        } catch (error) {
            console.log('❌ Data check failed:', error.message);
        }

        console.log('\n🎉 CORS Testing Complete!');

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
    }
}

// Run the test
testCORSForFrontend();
