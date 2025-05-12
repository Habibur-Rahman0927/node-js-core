const EventEmitter = require('events');

// Create a central event bus
const eventBus = new EventEmitter();

// --- Microservice: Auth Service ---
function registerUser(userData) {
    console.log('✅ [Auth] User registered:', userData);
    eventBus.emit('userRegistered', userData);
}

// --- Microservice: Email Service ---
eventBus.on('userRegistered', (user) => {
    console.log(`📧 [Email] Sending welcome email to ${user.email}`);
});

// --- Microservice: Analytics Service ---
eventBus.on('userRegistered', (user) => {
    console.log(`📊 [Analytics] Tracking registration for user ID ${user.id}`);
});

// --- Microservice: Billing Service ---
eventBus.on('userRegistered', (user) => {
    console.log(`💰 [Billing] Creating free trial for ${user.name}`);
});

// --- Simulate Registration ---
const newUser = {
    id: 101,
    name: 'Habib',
    email: 'habib@example.com'
};

console.log('🚀 Starting registration process...\n');
registerUser(newUser);
