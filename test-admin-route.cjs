// Test admin route accessibility
const axios = require('axios');

async function testAdminRoute() {
    try {
        console.log('🔍 Testing admin route: http://localhost:5173/admin/portals');
        
        const response = await axios.get('http://localhost:5173/admin/portals', {
            timeout: 10000,
            validateStatus: (status) => status < 500 // Don't throw for 4xx errors
        });
        
        console.log('✅ Response Status:', response.status);
        console.log('📄 Content-Type:', response.headers['content-type']);
        
        if (response.status === 200) {
            console.log('✅ Admin route is accessible');
            
            // Check if the response contains admin dashboard content
            const content = response.data;
            if (content.includes('AdminDashboard') || content.includes('UASA Admin')) {
                console.log('✅ Admin dashboard content detected');
            } else {
                console.log('⚠️ Admin dashboard content not found in response');
            }
            
            // Check for sidebar indicators
            if (content.includes('sidebar') || content.includes('navigation')) {
                console.log('✅ Sidebar/navigation content detected');
            } else {
                console.log('⚠️ Sidebar/navigation content not found');
            }
        } else if (response.status === 302) {
            console.log('🔄 Redirect detected - likely to login page');
        }
        
    } catch (error) {
        console.error('❌ Error accessing admin route:', error.message);
    }
}

testAdminRoute();
