class MyEventEmitter {
    constructor() {
        this.events = {};
    }

    // Register listener
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    // Emit event
    emit(event, ...args) {
        if (this.events[event]) {
            for (const listener of this.events[event]) {
                listener(...args);
            }
        }
    }

    // Remove specific listener
    off(event, listenerToRemove) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(
            listener => listener !== listenerToRemove
        );
    }
}

const emitter = new MyEventEmitter();

function onUserLogin(user) {
    console.log(`✅ User logged in: ${user}`);
}

// Add event listener
emitter.on('login', onUserLogin);

// Emit the event
emitter.emit('login', 'Habib');

// Remove the listener
emitter.off('login', onUserLogin);

// Emit again (nothing will happen)
emitter.emit('login', 'Habib');
