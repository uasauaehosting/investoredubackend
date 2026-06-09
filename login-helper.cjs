// Login Helper - Get authentication token for frontend testing
const axios = require('axios');

const baseURL = 'http://localhost:5001/api';

async function getAuthToken() {
    try {
        const response = await axios.post(`${baseURL}/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });
        
        console.log('🔐 Login Successful!');
        console.log('📋 Admin Credentials:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('');
        console.log('🔑 Authentication Token:');
        console.log(response.data.token);
        console.log('');
        console.log('👤 Admin User Info:');
        console.log(JSON.stringify(response.data.admin, null, 2));
        console.log('');
        console.log('📝 Instructions:');
        console.log('1. Open your browser and go to http://localhost:5173/admin/login');
        console.log('2. Login with username: admin and password: admin123');
        console.log('3. Navigate to Members Management');
        console.log('4. Try creating a new member - it should work now!');
        console.log('');
        console.log('🔧 If you still have issues, you can manually set the token:');
        console.log('   Open browser console and run:');
        console.log(`   localStorage.setItem('adminToken', '${response.data.token}');`);
        console.log('   Then refresh the page.');
        
        return response.data.token;
    } catch (error) {
        console.error('❌ Login failed:', error.response?.data || error.message);
        return null;
    }
}

getAuthToken();
