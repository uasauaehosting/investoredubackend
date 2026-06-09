// Test Member API endpoints
const axios = require('axios');

const baseURL = 'http://localhost:5001/api';

async function testMemberAPIs() {
    console.log('🚀 Testing Member API Endpoints...\n');

    try {
        // Test 1: GET Members (should work)
        console.log('📥 Testing GET /api/home/members');
        const getResponse = await axios.get(`${baseURL}/home/members`);
        console.log('✅ GET Success - Found', getResponse.data.length, 'members');
        console.log('Sample data:', JSON.stringify(getResponse.data[0], null, 2));

        // Test 2: POST Create Member (without auth - should fail)
        console.log('\n📤 Testing POST /api/home/members (without auth)');
        try {
            const newMember = {
                name: "Test Member from API",
                country: "Test Country",
                website: "https://test.com",
                logo: ""
            };

            const postResponse = await axios.post(`${baseURL}/home/members`, newMember);
            console.log('✅ POST Success - Created member with ID:', postResponse.data.id);
        } catch (error) {
            console.log('❌ POST Failed (expected):', error.response?.data || error.message);
        }

        // Test 3: POST Create Member (with fake auth - should fail)
        console.log('\n📤 Testing POST /api/home/members (with fake auth)');
        try {
            const newMember = {
                name: "Test Member from API",
                country: "Test Country",
                website: "https://test.com",
                logo: ""
            };

            const postResponse = await axios.post(`${baseURL}/home/members`, newMember, {
                headers: {
                    'Authorization': 'Bearer fake-token'
                }
            });
            console.log('✅ POST Success - Created member with ID:', postResponse.data.id);
        } catch (error) {
            console.log('❌ POST Failed (expected):', error.response?.data || error.message);
        }

        console.log('\n🎉 Member API Testing Complete!');

    } catch (error) {
        console.error('❌ API Test Failed:', error.response?.data || error.message);
    }
}

// Run the tests
testMemberAPIs();
