// Test Portals API endpoints
const axios = require('axios');

const baseURL = 'http://localhost:5001/api';

async function testPortalsAPI() {
    console.log('🚀 Testing Portals API Endpoints...\n');

    try {
        // Test 1: GET all portals
        console.log('📥 Testing GET /api/portals');
        try {
            const response = await axios.get(`${baseURL}/portals`);
            console.log('✅ GET Success - Found', response.data.length, 'portals');
            if (response.data.length > 0) {
                console.log('Sample portal:', JSON.stringify(response.data[0], null, 2));
            }
        } catch (error) {
            console.log('❌ GET Failed:', error.response?.data || error.message);
        }

        // Test 2: GET unique authorities
        console.log('\n📥 Testing GET /api/portals/authorities');
        try {
            const response = await axios.get(`${baseURL}/portals/authorities`);
            console.log('✅ Authorities Success - Found', response.data.length, 'authorities');
            console.log('Authorities:', response.data);
        } catch (error) {
            console.log('❌ Authorities Failed:', error.response?.data || error.message);
        }

        // Test 3: GET unique countries
        console.log('\n📥 Testing GET /api/portals/countries');
        try {
            const response = await axios.get(`${baseURL}/portals/countries`);
            console.log('✅ Countries Success - Found', response.data.length, 'countries');
            console.log('Countries:', response.data);
        } catch (error) {
            console.log('❌ Countries Failed:', error.response?.data || error.message);
        }

        // Test 4: POST Create portal
        console.log('\n📤 Testing POST /api/portals');
        try {
            const newPortal = {
                title: "Test Portal API",
                short_title: "Test Portal",
                description: "This is a test portal created via API",
                image_url: "https://test.com/image.png",
                link: "https://test.com",
                authority_name: "Test Authority",
                country: "Test Country",
                display_order: 10
            };

            const response = await axios.post(`${baseURL}/portals`, newPortal);
            console.log('✅ POST Success - Created portal with ID:', response.data.id);
            const createdId = response.data.id;

            // Test 5: GET portal by ID
            console.log('\n📥 Testing GET /api/portals/:id');
            try {
                const getResponse = await axios.get(`${baseURL}/portals/${createdId}`);
                console.log('✅ GET by ID Success:', JSON.stringify(getResponse.data, null, 2));
            } catch (error) {
                console.log('❌ GET by ID Failed:', error.response?.data || error.message);
            }

            // Test 6: PUT Update portal
            console.log('\n📝 Testing PUT /api/portals/:id');
            try {
                const updateData = {
                    title: "Test Portal API - Updated",
                    description: "This portal has been updated"
                };

                const updateResponse = await axios.put(`${baseURL}/portals/${createdId}`, updateData);
                console.log('✅ PUT Success:', JSON.stringify(updateResponse.data, null, 2));
            } catch (error) {
                console.log('❌ PUT Failed:', error.response?.data || error.message);
            }

            // Test 7: DELETE portal
            console.log('\n🗑️ Testing DELETE /api/portals/:id');
            try {
                await axios.delete(`${baseURL}/portals/${createdId}`);
                console.log('✅ DELETE Success');
            } catch (error) {
                console.log('❌ DELETE Failed:', error.response?.data || error.message);
            }

        } catch (error) {
            console.log('❌ POST Failed:', error.response?.data || error.message);
        }

        console.log('\n🎉 Portals API Testing Complete!');

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
    }
}

// Run the tests
testPortalsAPI();
