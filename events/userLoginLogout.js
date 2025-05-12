const EventEmitter = require('events');

// Custom emitter
class UserEmitter extends EventEmitter {
    login(user) {
        this.emit('user-login', user);
    }

    logout(user) {
        this.emit('user-logout', user);
    }
}

const userEmitter = new UserEmitter();

// Handlers for login/logout
userEmitter.on('user-login', (user) => {
    console.log(`✅ ${user.name} has logged in.`);
    // Simulate logging, session creation, welcome email, etc.
    console.log(`📜 Logging login event for ${user.name}`);
    console.log(`📧 Sending welcome email to ${user.email}`);
});

userEmitter.on('user-logout', (user) => {
    console.log(`🚪 ${user.name} has logged out.`);
    // Simulate logging, session cleanup, etc.
    console.log(`📜 Logging logout event for ${user.name}`);
    console.log(`🧹 Clearing session data for ${user.name}`);
});

// Simulate a user object
const user = {
    id: 1,
    name: 'Habib',
    email: 'habib@example.com'
};

// Simulate login/logout actions
function simulateUserSession() {
    console.log('\n🟢 Simulating user session...');
    userEmitter.login(user);

    setTimeout(() => {
        userEmitter.logout(user);
    }, 3000);
}

simulateUserSession();
