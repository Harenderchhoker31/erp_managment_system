// Quick script to clear expired tokens
localStorage.removeItem('token');
localStorage.removeItem('user');
console.log('Expired tokens cleared. Please refresh and log in again.');