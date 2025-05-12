const EventEmitter = require('events');
const https = require('https');

class RequestTracker extends EventEmitter {
    sendRequest(url, timeout = 3000) {
        const req = https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => data += chunk);

            res.on('end', () => {
                if (res.statusCode === 200) {
                    this.emit('requestSuccess', {
                        statusCode: res.statusCode,
                        data: data.slice(0, 100) // Limit preview
                    });
                } else {
                    this.emit('requestFailed', {
                        statusCode: res.statusCode,
                        message: 'Non-200 response'
                    });
                }
            });
        });

        req.on('error', (err) => {
            this.emit('requestFailed', {
                statusCode: null,
                message: err.message
            });
        });

        // Handle timeout
        req.setTimeout(timeout, () => {
            req.abort();
            this.emit('requestTimeout', {
                message: `Request timed out after ${timeout}ms`
            });
        });
    }
}

const tracker = new RequestTracker();

// Listeners
tracker.on('requestSuccess', (info) => {
    console.log(`✅ Success [${info.statusCode}]:`, info.data);
});

tracker.on('requestTimeout', (info) => {
    console.warn(`⏱️ Timeout: ${info.message}`);
});

tracker.on('requestFailed', (info) => {
    console.error(`❌ Failed: ${info.message}`);
});

// Example usage
console.log('🌐 Sending request...');
tracker.sendRequest('https://jsonplaceholder.typicode.com/posts/1', 2000);

// Uncomment to simulate a timeout or error
// tracker.sendRequest('https://10.255.255.1', 1000); // Simulated timeout
// tracker.sendRequest('https://invalid.url', 2000);  // Invalid domain
