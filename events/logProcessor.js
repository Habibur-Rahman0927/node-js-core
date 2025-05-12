const fs = require('fs');
const path = require('path');
const readline = require('readline');
const EventEmitter = require('events');

// Custom EventEmitter
class LogEmitter extends EventEmitter {
    logInfo(message) {
        this.emit('create-info', message);
    }

    logError(message) {
        this.emit('create-error', message);
    }
}
const logEmitter = new LogEmitter();

const logFilePath = path.join(__dirname, 'server.log');

// Ensure file is empty before logging
fs.writeFileSync(logFilePath, '');

// Handle info events
logEmitter.on('create-info', (msg) => {
    const line = `INFO ${msg}`;
    fs.appendFileSync(logFilePath, line + '\n');
});

// Handle error events
logEmitter.on('create-error', (msg) => {
    const line = `ERROR ${msg}`;
    fs.appendFileSync(logFilePath, line + '\n');
});

// Simulated system events
function simulateLogs() {
    logEmitter.logInfo('Server started on port 3000');
    logEmitter.logInfo('Connected to MongoDB');
    logEmitter.logError('Failed to fetch user profile');
    logEmitter.logInfo('Request received: GET /home');
    logEmitter.logError('Payment service timeout');
    logEmitter.logInfo('Cache warmed up successfully');
    logEmitter.logInfo('User logged in');
    logEmitter.logError('Database connection lost');
    logEmitter.logInfo('Health check passed');
}

simulateLogs();

let infoCount = 0;
let errorCount = 0;

// Listener for "info" logs
logEmitter.on('info', (line) => {
    console.log(`ℹ️  Info: ${line}`);
    infoCount++;
});

// Listener for "error" logs
logEmitter.on('error', (line) => {
    console.log(`❌ Error: ${line}`);
    errorCount++;
});

// Listener for "done" event
logEmitter.on('done', () => {
    console.log('\n📊 Summary:');
    console.log(`Total Info logs: ${infoCount}`);
    console.log(`Total Error logs: ${errorCount}`);
});

// Read file line-by-line
function processLogFile(filePath) {
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
        if (line.startsWith('ERROR')) {
            logEmitter.emit('error', line);
        } else if (line.startsWith('INFO')) {
            logEmitter.emit('info', line);
        }
    });

    rl.on('close', () => {
        logEmitter.emit('done');
    });
}

// Use path to resolve the full path
const filePath = path.join(__dirname, 'server.log');

if (!fs.existsSync(filePath)) {
    console.log(`❗ File not found: ${filePath}`);
    process.exit(1);
}

console.log(`🔍 Processing file: ${filePath}`);
processLogFile(filePath);
