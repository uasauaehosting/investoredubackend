// Debug specific issue with admin portals page
console.log('🔍 Debugging Admin Portals Specific Issue\n');

console.log('📋 Issue Confirmed:');
console.log('- Left sidebar works on ALL admin pages EXCEPT /admin/portals');
console.log('- This suggests a specific issue with the portals route handling');
console.log('- The component might be crashing or not rendering properly');
console.log('');

console.log('🔍 Possible Root Causes:');
console.log('1. PortalsManagement component has a JavaScript error');
console.log('2. API call in PortalsManagement is failing');
console.log('3. CSS/layout issue specific to PortalsManagement');
console.log('4. AdminDashboard not properly wrapping PortalsManagement');
console.log('5. Routing issue - component rendered outside AdminDashboard');
console.log('');

console.log('🛠️ Debugging Steps:');
console.log('1. Check browser console for JavaScript errors');
console.log('2. Verify AdminDashboard is actually rendering');
console.log('3. Check if PortalsManagement is causing the crash');
console.log('4. Test with a simplified PortalsManagement component');
console.log('');

console.log('🔧 Quick Test - Temporarily Replace PortalsManagement:');
console.log('If we replace PortalsManagement with a simple component,');
console.log('and the sidebar appears, then PortalsManagement is the issue.');
console.log('');

console.log('📊 Expected Behavior:');
console.log('URL: http://localhost:5173/admin/portals');
console.log('Should render: AdminDashboard (with sidebar) + PortalsManagement');
console.log('Actually renders: ? (need to check)');
console.log('');

console.log('🎯 Next Steps:');
console.log('1. Add temporary debugging to see what component is actually rendering');
console.log('2. Create a minimal test component for portals');
console.log('3. Check if the issue is in the component or the routing');
console.log('');

console.log('❓ Questions to Answer:');
console.log('- Is AdminDashboard mounting at all?');
console.log('- Is the error boundary catching something?');
console.log('- Are there any JavaScript errors in console?');
console.log('- Is the API call failing and causing a crash?');
