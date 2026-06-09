// Test Alerts & Bulletins Creation
const axios = require('axios');

const baseURL = 'http://localhost:5001/api';

async function testAlertsCreation() {
    console.log('🚀 Testing Alerts & Bulletins Creation...\n');

    try {
        // Test 1: GET existing alerts
        console.log('📥 Testing GET /api/alerts-bulletins');
        const getResponse = await axios.get(`${baseURL}/alerts-bulletins`);
        console.log('✅ GET Success - Found', getResponse.data.length, 'alerts/bulletins');

        // Test 2: POST Create new alert (without auth - should work)
        console.log('\n📤 Testing POST /api/alerts-bulletins (create new alert)');
        try {
            const newAlert = {
                title: "Test Alert from API",
                type: "Alert",
                description: "This is a test alert created via API",
                content: "<p>This is the content of the test alert.</p>",
                authority_name: "Test Authority",
                year: "2024",
                date_published: "2024-01-15T00:00:00.000Z",
                link: "https://test.com",
                display_order: 10,
                is_active: true
            };

            const postResponse = await axios.post(`${baseURL}/alerts-bulletins`, newAlert);
            console.log('✅ POST Success - Created alert with ID:', postResponse.data.id);
            console.log('Created alert:', JSON.stringify(postResponse.data, null, 2));
            
        } catch (error) {
            console.log('❌ POST Failed:', error.response?.data || error.message);
            console.log('Error details:', error.response?.status, error.response?.statusText);
        }

        // Test 3: POST Create new bulletin
        console.log('\n📤 Testing POST /api/alerts-bulletins (create new bulletin)');
        try {
            const newBulletin = {
                title: "Test Bulletin from API",
                type: "Bulletin",
                description: "This is a test bulletin created via API",
                content: "<p>This is the content of the test bulletin.</p>",
                authority_name: "Test Authority",
                year: "2024",
                date_published: "2024-01-16T00:00:00.000Z",
                link: "https://test.com",
                display_order: 11,
                is_active: true
            };

            const postResponse = await axios.post(`${baseURL}/alerts-bulletins`, newBulletin);
            console.log('✅ POST Success - Created bulletin with ID:', postResponse.data.id);
            
        } catch (error) {
            console.log('❌ POST Failed:', error.response?.data || error.message);
            console.log('Error details:', error.response?.status, error.response?.statusText);
        }

        console.log('\n🎉 Alerts & Bulletins Creation Testing Complete!');

    } catch (error) {
        console.error('❌ Test Failed:', error.response?.data || error.message);
    }
}

// Run the tests
testAlertsCreation();
