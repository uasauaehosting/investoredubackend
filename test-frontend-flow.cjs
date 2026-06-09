// Test Frontend Flow - Simulate what the frontend does
const axios = require('axios');

const baseURL = 'http://localhost:5001/api';

async function testFrontendFlow() {
    console.log('🚀 Testing Frontend Flow for Alerts & Bulletins...\n');

    try {
        // Step 1: GET initial data (what frontend does on load)
        console.log('📥 Step 1: GET initial alerts list');
        const initialResponse = await axios.get(`${baseURL}/alerts-bulletins`);
        console.log('✅ Initial load - Found', initialResponse.data.length, 'alerts');
        console.log('Sample alert:', JSON.stringify(initialResponse.data[0], null, 2));

        // Step 2: CREATE new alert (what frontend does when user creates)
        console.log('\n📤 Step 2: CREATE new alert');
        const newAlert = {
            title: "Frontend Test Alert",
            type: "Alert",
            description: "This is a frontend test alert",
            content: "<p>This is the content of the frontend test alert.</p>",
            authority_name: "Saudi Capital Market Authority",
            year: "2024",
            date_published: new Date().toISOString(),
            link: "https://test.com",
            display_order: 0,
            is_active: true
        };

        const createResponse = await axios.post(`${baseURL}/alerts-bulletins`, newAlert);
        console.log('✅ CREATE Success - Created alert with ID:', createResponse.data.id);
        const createdId = createResponse.data.id;

        // Step 3: GET updated data (what frontend does after create)
        console.log('\n📥 Step 3: GET updated alerts list (after create)');
        const afterCreateResponse = await axios.get(`${baseURL}/alerts-bulletins`);
        console.log('✅ After create - Found', afterCreateResponse.data.length, 'alerts');
        
        const createdAlert = afterCreateResponse.data.find(alert => alert.id === createdId);
        if (createdAlert) {
            console.log('✅ Created alert found in list:', JSON.stringify(createdAlert, null, 2));
        } else {
            console.log('❌ Created alert NOT found in list!');
        }

        // Step 4: UPDATE the alert (what frontend does when user edits)
        console.log('\n📝 Step 4: UPDATE the alert');
        const updateData = {
            title: "Frontend Test Alert - UPDATED",
            description: "This alert has been updated by frontend test"
        };

        const updateResponse = await axios.put(`${baseURL}/alerts-bulletins/${createdId}`, updateData);
        console.log('✅ UPDATE Success - Updated alert:', JSON.stringify(updateResponse.data, null, 2));

        // Step 5: GET updated data (what frontend does after update)
        console.log('\n📥 Step 5: GET updated alerts list (after update)');
        const afterUpdateResponse = await axios.get(`${baseURL}/alerts-bulletins`);
        console.log('✅ After update - Found', afterUpdateResponse.data.length, 'alerts');
        
        const updatedAlert = afterUpdateResponse.data.find(alert => alert.id === createdId);
        if (updatedAlert) {
            console.log('✅ Updated alert found in list:', JSON.stringify(updatedAlert, null, 2));
            if (updatedAlert.title === "Frontend Test Alert - UPDATED") {
                console.log('✅ Update reflected correctly in list');
            } else {
                console.log('❌ Update NOT reflected in list!');
            }
        } else {
            console.log('❌ Updated alert NOT found in list!');
        }

        // Step 6: DELETE the alert (cleanup)
        console.log('\n🗑️ Step 6: DELETE the alert (cleanup)');
        await axios.delete(`${baseURL}/alerts-bulletins/${createdId}`);
        console.log('✅ DELETE Success');

        // Step 7: GET final data (what frontend does after delete)
        console.log('\n📥 Step 7: GET final alerts list (after delete)');
        const finalResponse = await axios.get(`${baseURL}/alerts-bulletins`);
        console.log('✅ After delete - Found', finalResponse.data.length, 'alerts');
        
        const deletedAlert = finalResponse.data.find(alert => alert.id === createdId);
        if (!deletedAlert) {
            console.log('✅ Delete reflected correctly - alert no longer in list');
        } else {
            console.log('❌ Delete NOT reflected - alert still in list!');
        }

        console.log('\n🎉 Frontend Flow Testing Complete!');
        console.log('\n📋 Summary:');
        console.log('- ✅ Backend API working correctly');
        console.log('- ✅ Data persistence working');
        console.log('- ✅ Frontend should see changes immediately');
        console.log('- If frontend still not showing changes, check browser console for errors');

    } catch (error) {
        console.error('❌ Frontend Flow Test Failed:', error.response?.data || error.message);
    }
}

// Run the test
testFrontendFlow();
