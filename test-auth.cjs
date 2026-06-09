// Test Authentication
const axios = require('axios');

const baseURL = 'http://localhost:5001/api';

async function testAuth() {
    console.log('🚀 Testing Authentication...\n');

    try {
        // Test 1: Try to login with default credentials
        console.log('🔐 Testing login with default credentials');
        try {
            const loginResponse = await axios.post(`${baseURL}/auth/login`, {
                username: 'admin',
                password: 'admin123'
            });
            
            console.log('✅ Login Success!');
            console.log('Token:', loginResponse.data.token.substring(0, 50) + '...');
            console.log('Admin User:', JSON.stringify(loginResponse.data.admin, null, 2));
            
            // Test 2: Use token to create a member
            console.log('\n📤 Testing POST /api/home/members (with valid token)');
            try {
                const newMember = {
                    name: "Test Member with Auth",
                    country: "Test Country",
                    website: "https://test.com",
                    logo: ""
                };

                const postResponse = await axios.post(`${baseURL}/home/members`, newMember, {
                    headers: {
                        'Authorization': `Bearer ${loginResponse.data.token}`
                    }
                });
                console.log('✅ POST Success - Created member with ID:', postResponse.data.id);
            } catch (postError) {
                console.log('❌ POST Failed:', postError.response?.data || postError.message);
            }
            
        } catch (error) {
            console.log('❌ Login Failed:', error.response?.data || error.message);
            
            // Try other common credentials
            const credentials = [
                { username: 'admin', password: 'password' },
                { username: 'admin', password: '123456' },
                { username: 'superadmin', password: 'admin123' },
                { username: 'superadmin', password: 'password' }
            ];
            
            for (const creds of credentials) {
                try {
                    console.log(`\n🔐 Trying credentials: ${creds.username} / ${creds.password}`);
                    const response = await axios.post(`${baseURL}/auth/login`, creds);
                    console.log('✅ Login Success with:', creds.username);
                    console.log('Token:', response.data.token.substring(0, 50) + '...');
                    break;
                } catch (err) {
                    console.log('❌ Failed with these credentials');
                }
            }
        }

        console.log('\n🎉 Authentication Testing Complete!');

    } catch (error) {
        console.error('❌ Auth Test Failed:', error.response?.data || error.message);
    }
}

// Run the tests
testAuth();
