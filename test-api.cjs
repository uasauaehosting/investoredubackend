// Test API endpoints for Investor Education Portal
const axios = require('axios');

const baseURL = 'http://localhost:5001/api';

async function testAPIs() {
    console.log('🚀 Testing API Endpoints...\n');

    try {
        // Test 1: GET Alerts & Bulletins
        console.log('📥 Testing GET /api/investor-education/alerts-bulletins');
        const getResponse = await axios.get(`${baseURL}/investor-education/alerts-bulletins`);
        console.log('✅ GET Success - Found', getResponse.data.length, 'alerts/bulletins');
        console.log('Sample data:', JSON.stringify(getResponse.data[0], null, 2));

        // Test 2: POST Create new Alert (using dedicated alerts-bulletins route)
        console.log('\n📤 Testing POST /api/alerts-bulletins');
        const newAlert = {
            title: "Test Alert from API",
            description: "This is a test alert created via API",
            type: "Alert",
            content: "<p>Test content for the alert created via API</p>",
            authority_name: "Test Authority",
            year: "2024",
            date_published: "2024-01-20T00:00:00.000Z",
            link: "https://test.com",
            display_order: 999
        };

        const postResponse = await axios.post(`${baseURL}/alerts-bulletins`, newAlert);
        console.log('✅ POST Success - Created alert with ID:', postResponse.data.id);
        const createdAlertId = postResponse.data.id;

        // Test 3: GET specific alert by ID (if endpoint exists)
        console.log('\n📥 Testing GET specific alert');
        try {
            const getSpecificResponse = await axios.get(`${baseURL}/alerts-bulletins/${createdAlertId}`);
            console.log('✅ GET Specific Success - Alert:', getSpecificResponse.data.title);
        } catch (error) {
            console.log('⚠️ GET Specific endpoint may not exist or requires authentication');
        }

        // Test 4: PUT Update alert (if endpoint exists)
        console.log('\n📝 Testing PUT update alert');
        try {
            const updateData = { ...newAlert, title: "Updated Test Alert" };
            const putResponse = await axios.put(`${baseURL}/alerts-bulletins/${createdAlertId}`, updateData);
            console.log('✅ PUT Success - Updated alert title');
        } catch (error) {
            console.log('⚠️ PUT endpoint may not exist or requires authentication');
        }

        // Test 5: DELETE alert (if endpoint exists)
        console.log('\n🗑️ Testing DELETE alert');
        try {
            await axios.delete(`${baseURL}/alerts-bulletins/${createdAlertId}`);
            console.log('✅ DELETE Success - Test alert cleaned up');
        } catch (error) {
            console.log('⚠️ DELETE endpoint may not exist or requires authentication');
        }

        // Test 6: GET Portals
        console.log('\n📥 Testing GET /api/portals');
        try {
            const portalsResponse = await axios.get(`${baseURL}/portals`);
            console.log('✅ GET Portals Success - Found', portalsResponse.data.length, 'portals');
            if (portalsResponse.data.length > 0) {
                console.log('Sample portal:', portalsResponse.data[0].title);
            }
        } catch (error) {
            console.log('❌ GET Portals Error:', error.message);
        }

        // Test 7: GET Home
        console.log('\n📥 Testing GET /api/home');
        try {
            const homeResponse = await axios.get(`${baseURL}/home`);
            console.log('✅ GET Home Success');
            console.log('Home data keys:', Object.keys(homeResponse.data));
        } catch (error) {
            console.log('❌ GET Home Error:', error.message);
        }

        // Test 8: GET About
        console.log('\n📥 Testing GET /api/about');
        try {
            const aboutResponse = await axios.get(`${baseURL}/about`);
            console.log('✅ GET About Success');
            console.log('About data keys:', Object.keys(aboutResponse.data));
        } catch (error) {
            console.log('❌ GET About Error:', error.message);
        }

        console.log('\n🎉 API Testing Complete!');

    } catch (error) {
        console.error('❌ API Test Failed:', error.response?.data || error.message);
    }
}

// Run the tests
testAPIs();
