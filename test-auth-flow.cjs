// Test authentication flow for admin
const axios = require('axios');

async function testAuthFlow() {
    console.log('🔍 Testing Admin Authentication Flow...\n');

    try {
        // Step 1: Test login page
        console.log('📥 Step 1: Testing login page');
        const loginPageResponse = await axios.get('http://localhost:5173/admin/login', {
            timeout: 10000,
            validateStatus: (status) => status < 500
        });
        console.log('✅ Login page status:', loginPageResponse.status);

        // Step 2: Test admin login
        console.log('\n📤 Step 2: Testing admin login');
        try {
            const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
                username: 'admin',
                password: 'admin123'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });
            
            console.log('✅ Login successful');
            console.log('🔑 Token received:', loginResponse.data.token ? 'Yes' : 'No');
            
            // Step 3: Test admin dashboard with token
            console.log('\n📥 Step 3: Testing admin dashboard with token');
            const dashboardResponse = await axios.get('http://localhost:5173/admin/portals', {
                headers: {
                    'Authorization': `Bearer ${loginResponse.data.token}`
                },
                timeout: 10000,
                validateStatus: (status) => status < 500
            });
            
            console.log('✅ Dashboard response status:', dashboardResponse.status);
            console.log('📄 Content length:', dashboardResponse.data.length);
            
            // Check for admin content
            const content = dashboardResponse.data;
            if (content.includes('UASA Admin') || content.includes('sidebar')) {
                console.log('✅ Admin dashboard content found');
            } else {
                console.log('⚠️ Admin dashboard content not found');
                console.log('📝 Content preview:', content.substring(0, 200));
            }
            
        } catch (loginError) {
            console.log('❌ Login failed:', loginError.response?.data || loginError.message);
        }

    } catch (error) {
        console.error('❌ Error in auth flow:', error.message);
    }
}

testAuthFlow();
