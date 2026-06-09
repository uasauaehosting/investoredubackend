// Test Complete CRUD for Alerts & Bulletins
const axios = require('axios');

const baseURL = 'http://localhost:5001/api';

async function testAlertsCRUD() {
    console.log('🚀 Testing Complete CRUD for Alerts & Bulletins...\n');

    try {
        let createdAlertId = null;

        // Test 1: CREATE - Create a new alert
        console.log('📤 Testing CREATE alert');
        try {
            const newAlert = {
                title: "CRUD Test Alert",
                type: "Alert",
                description: "This is a CRUD test alert",
                content: "<p>This is the content of the CRUD test alert.</p>",
                authority_name: "Saudi Capital Market Authority",
                year: "2024",
                date_published: new Date().toISOString(),
                link: "https://test.com",
                display_order: 0,
                is_active: true
            };

            const createResponse = await axios.post(`${baseURL}/alerts-bulletins`, newAlert);
            createdAlertId = createResponse.data.id;
            console.log('✅ CREATE Success - Created alert with ID:', createdAlertId);
            console.log('Created alert:', JSON.stringify(createResponse.data, null, 2));
            
        } catch (error) {
            console.log('❌ CREATE Failed:', error.response?.data || error.message);
            return;
        }

        // Test 2: READ - Get the created alert
        console.log('\n📥 Testing READ alert');
        try {
            const getResponse = await axios.get(`${baseURL}/alerts-bulletins/${createdAlertId}`);
            console.log('✅ READ Success - Retrieved alert:', JSON.stringify(getResponse.data, null, 2));
        } catch (error) {
            console.log('❌ READ Failed:', error.response?.data || error.message);
        }

        // Test 3: UPDATE - Update the created alert
        console.log('\n📝 Testing UPDATE alert');
        try {
            const updateData = {
                title: "CRUD Test Alert - Updated",
                description: "This alert has been updated",
                content: "<p>This is the updated content of the CRUD test alert.</p>",
                display_order: 5
            };

            const updateResponse = await axios.put(`${baseURL}/alerts-bulletins/${createdAlertId}`, updateData);
            console.log('✅ UPDATE Success - Updated alert:', JSON.stringify(updateResponse.data, null, 2));
        } catch (error) {
            console.log('❌ UPDATE Failed:', error.response?.data || error.message);
        }

        // Test 4: DELETE - Delete the created alert
        console.log('\n🗑️ Testing DELETE alert');
        try {
            await axios.delete(`${baseURL}/alerts-bulletins/${createdAlertId}`);
            console.log('✅ DELETE Success - Alert deleted');
        } catch (error) {
            console.log('❌ DELETE Failed:', error.response?.data || error.message);
        }

        // Test 5: Verify deletion
        console.log('\n🔍 Testing DELETE verification');
        try {
            await axios.get(`${baseURL}/alerts-bulletins/${createdAlertId}`);
            console.log('❌ DELETE Verification Failed - Alert still exists');
        } catch (error) {
            console.log('✅ DELETE Verification Success - Alert no longer exists');
        }

        console.log('\n🎉 CRUD Testing Complete!');

    } catch (error) {
        console.error('❌ Test Failed:', error.response?.data || error.message);
    }
}

// Run the tests
testAlertsCRUD();
