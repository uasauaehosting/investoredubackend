// Clean up test portal data
const axios = require('axios');

const baseURL = 'http://localhost:5001/api';

async function cleanupTestPortal() {
    try {
        // Delete the test portal that was created during API testing
        await axios.delete(`${baseURL}/portals/12`);
        console.log('✅ Cleaned up test portal data');
        
        // Verify we still have the 10 main portals
        const response = await axios.get(`${baseURL}/portals`);
        console.log(`✅ Still have ${response.data.length} portals in database`);
        
    } catch (error) {
        console.log('No test portal to clean up or already cleaned');
    }
}

cleanupTestPortal();
