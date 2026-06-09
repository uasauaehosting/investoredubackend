// Debug admin navigation issue
console.log('🔍 Debugging Admin Navigation Issue\n');

console.log('📋 Issue Analysis:');
console.log('The user reports that left navigation is not visible on /admin/portals');
console.log('This suggests one of the following issues:');
console.log('');

console.log('1. 🔑 Authentication Issue:');
console.log('   - User not logged in (no adminToken in localStorage)');
console.log('   - AdminDashboard redirects to /admin/login');
console.log('   - Login page has no sidebar');
console.log('');

console.log('2. 🔄 Routing Issue:');
console.log('   - AdminDashboard not properly handling /admin/portals');
console.log('   - Component not rendering correctly');
console.log('');

console.log('3. 🎨 Rendering Issue:');
console.log('   - AdminDashboard component not mounting');
console.log('   - Sidebar not rendering due to CSS or JS error');
console.log('');

console.log('🛠️ Debugging Steps Added:');
console.log('✅ Added console logging to AdminDashboard component');
console.log('✅ Added authentication flow logging');
console.log('✅ Added renderContent logging');
console.log('✅ Added portals case logging');
console.log('');

console.log('📝 Next Steps for User:');
console.log('1. Open browser developer tools (F12)');
console.log('2. Go to Console tab');
console.log('3. Navigate to http://localhost:5173/admin/portals');
console.log('4. Check console logs for debugging information');
console.log('');

console.log('🔧 Expected Console Output:');
console.log('🔑 AdminDashboard - Checking token: Found/Not found');
console.log('📍 AdminDashboard - Current path: /admin/portals');
console.log('🎯 AdminDashboard - Active section: portals');
console.log('👤 AdminDashboard - Setting admin profile');
console.log('🎨 AdminDashboard - Rendering content for section: portals');
console.log('🌐 AdminDashboard - Rendering PortalsManagement component');
console.log('');

console.log('❌ If token not found:');
console.log('🔄 AdminDashboard - No token, redirecting to login');
console.log('(This explains why no sidebar is visible)');
console.log('');

console.log('✅ Solution:');
console.log('If token issue: Login at http://localhost:5173/admin/login');
console.log('If rendering issue: Check browser console for JavaScript errors');
console.log('If routing issue: Check that AdminDashboard component is properly imported');
