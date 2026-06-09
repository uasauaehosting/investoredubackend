// Test if there's an issue with the PortalsManagement component
console.log('🔍 Testing PortalsManagement Component Issue\n');

console.log('📋 Issue Analysis:');
console.log('User reports left navigation works on ALL admin pages except /admin/portals');
console.log('This suggests a specific issue with the PortalsManagement component');
console.log('');

console.log('🔍 Possible Causes:');
console.log('1. JavaScript error in PortalsManagement component');
console.log('2. API call failure causing component crash');
console.log('3. Component import issue');
console.log('4. CSS/layout issue specific to PortalsManagement');
console.log('5. Infinite loop or memory leak in useEffect');
console.log('');

console.log('🛠️ Debugging Steps:');
console.log('1. Check browser console for JavaScript errors when visiting /admin/portals');
console.log('2. Compare with other admin pages that work correctly');
console.log('3. Test API calls that PortalsManagement makes on mount');
console.log('4. Check if component is properly imported in AdminDashboard');
console.log('');

console.log('🔧 Quick Test:');
console.log('Open browser dev tools and navigate to /admin/portals');
console.log('Look for red error messages in console');
console.log('Check Network tab for failed API calls');
console.log('');

console.log('📊 Expected API Calls:');
console.log('GET http://localhost:5001/api/portals');
console.log('This should return the 10 portals we inserted earlier');
console.log('');

console.log('❌ If API Call Fails:');
console.log('Component should fall back to mock data');
console.log('But should still render with sidebar visible');
console.log('');

console.log('🎯 Most Likely Issue:');
console.log('JavaScript error in PortalsManagement preventing AdminDashboard from rendering');
console.log('This would cause the entire admin layout (including sidebar) to disappear');
console.log('');

console.log('✅ Solution:');
console.log('1. Check browser console for specific error messages');
console.log('2. Fix any JavaScript errors in PortalsManagement component');
console.log('3. Add error boundary to prevent component crashes from breaking admin layout');
