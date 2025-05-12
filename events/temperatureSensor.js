const EventEmitter = require('events');

class SensorEmitter extends EventEmitter {
    start() {
        console.log('📡 Sensor connection established.');

        const interval = setInterval(() => {
            // Randomly emit either data, error, or disconnect
            const rand = Math.random();

            if (rand < 0.7) {
                const temp = (Math.random() * 30 + 10).toFixed(2); // 10°C to 40°C
                this.emit('sensorData', { temperature: temp });
            } else if (rand < 0.9) {
                this.emit('sensorError', '⚠️ Sensor read error');
            } else {
                clearInterval(interval);
                this.emit('connectionLost', '❌ Sensor disconnected unexpectedly');
            }
        }, 1000); // Simulate data every second
    }
}

const sensor = new SensorEmitter();

// Event listeners
sensor.on('sensorData', (data) => {
    console.log(`🌡️  Temp: ${data.temperature}°C`);
});

sensor.on('sensorError', (error) => {
    console.error(`🚨 Error: ${error}`);
});

sensor.on('connectionLost', (message) => {
    console.warn(`🔌 Disconnected: ${message}`);
    console.log('🔄 Attempting to reconnect in 5 seconds...');
    setTimeout(() => {
        console.log('🔁 Reconnecting...');
        sensor.start(); // Attempt reconnection
    }, 5000);
});

// Start sensor simulation
sensor.start();
