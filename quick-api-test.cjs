// Quick API test for portals
const axios = require('axios');

async function quickTest() {
    try {
        console.log('🔍 Testing portals API...');
        const response = await axios.get('http://localhost:5001/api/portals');
        console.log('✅ API Status:', response.status);
        console.log('📊 Data Count:', response.data.length);
        console.log('📋 Sample:', response.data[0]?.short_title || 'No data');
    } catch (error) {
        console.log('❌ API Error:', error.message);
    }
}

quickTest();
