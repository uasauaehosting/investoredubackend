// Test Alerts & Bulletins Creation - Mimic Frontend
const axios = require('axios');

const baseURL = 'http://localhost:5001/api';

async function testAlertsFrontend() {
    console.log('🚀 Testing Alerts & Bulletins Creation (Frontend Simulation)...\n');

    try {
        // Test 1: Create alert with display_order: 0 (like frontend)
        console.log('📤 Testing POST with display_order: 0 (frontend default)');
        try {
            const newAlert = {
                title: "Test Alert with display_order 0",
                type: "Alert",
                description: "This is a test alert with display_order 0",
                content: "<p>This is the content of the test alert.</p>",
                authority_name: "Test Authority",
                year: "2024",
                date_published: new Date().toISOString(), // Frontend sends ISO string
                link: "https://test.com",
                display_order: 0, // This is what frontend sends
                is_active: true
            };

            const postResponse = await axios.post(`${baseURL}/alerts-bulletins`, newAlert);
            console.log('✅ POST Success - Created alert with ID:', postResponse.data.id);
            
        } catch (error) {
            console.log('❌ POST Failed:', error.response?.data || error.message);
            console.log('Error details:', error.response?.status, error.response?.statusText);
        }

        // Test 2: Create alert with missing required fields (like frontend might send)
        console.log('\n📤 Testing POST with missing authority_name (common frontend error)');
        try {
            const newAlert = {
                title: "Test Alert Missing Authority",
                type: "Alert",
                description: "This is a test alert missing authority",
                content: "<p>This is the content of the test alert.</p>",
                // authority_name: "Test Authority", // Missing this field
                year: "2024",
                date_published: new Date().toISOString(),
                link: "https://test.com",
                display_order: 0,
                is_active: true
            };

            const postResponse = await axios.post(`${baseURL}/alerts-bulletins`, newAlert);
            console.log('✅ POST Success - Created alert with ID:', postResponse.data.id);
            
        } catch (error) {
            console.log('❌ POST Failed (expected):', error.response?.data || error.message);
            console.log('Error details:', error.response?.status, error.response?.statusText);
        }

        // Test 3: Create alert with empty authority_name (like frontend might send)
        console.log('\n📤 Testing POST with empty authority_name (common frontend error)');
        try {
            const newAlert = {
                title: "Test Alert Empty Authority",
                type: "Alert",
                description: "This is a test alert with empty authority",
                content: "<p>This is the content of the test alert.</p>",
                authority_name: "", // Empty string
                year: "2024",
                date_published: new Date().toISOString(),
                link: "https://test.com",
                display_order: 0,
                is_active: true
            };

            const postResponse = await axios.post(`${baseURL}/alerts-bulletins`, newAlert);
            console.log('✅ POST Success - Created alert with ID:', postResponse.data.id);
            
        } catch (error) {
            console.log('❌ POST Failed (expected):', error.response?.data || error.message);
            console.log('Error details:', error.response?.status, error.response?.statusText);
        }

        console.log('\n🎉 Frontend Simulation Testing Complete!');

    } catch (error) {
        console.error('❌ Test Failed:', error.response?.data || error.message);
    }
}

// Run the tests
testAlertsFrontend();
