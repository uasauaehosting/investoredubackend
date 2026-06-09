// Test admin navigation URLs
const axios = require('axios');

const baseURL = 'http://localhost:5173';

async function testAdminNavigation() {
    console.log('🚀 Testing Admin Navigation URLs...\n');

    try {
        // Test admin dashboard (should redirect to login if not authenticated)
        console.log('📥 Testing /admin/dashboard');
        try {
            const response = await axios.get(`${baseURL}/admin/dashboard`, { 
                timeout: 5000,
                validateStatus: () => true // Don't throw on any status
            });
            console.log(`✅ Status: ${response.status}`);
            if (response.status === 200) {
                console.log('✅ Admin dashboard accessible');
            } else if (response.status === 302 || response.headers.location) {
                console.log('🔄 Redirecting to login (expected behavior)');
            }
        } catch (error) {
            console.log('❌ Error:', error.message);
        }

        // Test admin portals page
        console.log('\n📥 Testing /admin/portals');
        try {
            const response = await axios.get(`${baseURL}/admin/portals`, { 
                timeout: 5000,
                validateStatus: () => true
            });
            console.log(`✅ Status: ${response.status}`);
            if (response.status === 200) {
                console.log('✅ Admin portals page accessible');
            } else if (response.status === 302 || response.headers.location) {
                console.log('🔄 Redirecting to login (expected behavior)');
            }
        } catch (error) {
            console.log('❌ Error:', error.message);
        }

        // Test public portals page (for comparison)
        console.log('\n📥 Testing /portals (public page)');
        try {
            const response = await axios.get(`${baseURL}/portals`, { 
                timeout: 5000,
                validateStatus: () => true
            });
            console.log(`✅ Status: ${response.status}`);
            if (response.status === 200) {
                console.log('✅ Public portals page accessible');
            }
        } catch (error) {
            console.log('❌ Error:', error.message);
        }

        console.log('\n📋 Navigation Instructions:');
        console.log('1. Go to: http://localhost:5173/admin/login');
        console.log('2. Login with: admin / admin123');
        console.log('3. Navigate to Portals in the left sidebar');
        console.log('4. OR go directly to: http://localhost:5173/admin/portals');
        console.log('\n❌ Do NOT go to: http://localhost:5173/portals (this is the public page)');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAdminNavigation();
