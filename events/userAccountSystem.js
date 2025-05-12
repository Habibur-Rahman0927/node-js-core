const EventEmitter = require('events');

class UserSystem extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(15); // avoid memory leak warning
  }

  registerUser(user) {
    this.emit('register', user);
  }

  loginUser(user) {
    this.emit('login', user);
  }

  shutdownSystem() {
    this.removeAllListeners(); // Clean up everything on shutdown
    console.log('System shutdown. All listeners removed.');
  }
}

const system = new UserSystem();

// 1. `on` - Listen to registration
system.on('register', (user) => {
  console.log(`✅ User Registered: ${user.name}`);
});

// 2. `prependListener` - Log before actual register logic
system.prependListener('register', (user) => {
  console.log(`📋 Logging user registration: ${user.name}`);
});

// 3. `once` - One-time initialization
system.once('init', () => {
  console.log('🔄 System initialized for the first time.');
});

// 4. `prependOnceListener` - One-time audit log before init
system.prependOnceListener('init', () => {
  console.log('📦 [Audit] Initialization started...');
});

// 5. `emit` - Emit custom events
system.emit('init');

// 6. `on` for login
const loginHandler = (user) => {
  console.log(`👋 ${user.name} logged in.`);
};
system.on('login', loginHandler);

// 7. `off` or `removeListener`
setTimeout(() => {
  system.off('login', loginHandler); // or removeListener
  console.log('❌ Login listener removed.');
}, 3000);

// 8. Another listener for login
system.on('login', (user) => {
  console.log(`🔐 Authenticated: ${user.name}`);
});

// 9. `listeners`
console.log('👂 Current register listeners:', system.listeners('register').length);

// 10. `listenerCount`
console.log('🔢 Login listener count:', system.listenerCount('login'));

// 11. `eventNames`
console.log('📡 Events registered:', system.eventNames());

// Trigger register and login
system.registerUser({ name: 'Habib' });
system.loginUser({ name: 'Habib' });

// 12. `getMaxListeners`
console.log('⚙️ Max listeners allowed:', system.getMaxListeners());

// 13. `removeAllListeners`
setTimeout(() => {
  system.shutdownSystem();
}, 5000);
