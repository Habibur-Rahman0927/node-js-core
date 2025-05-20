const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

async function setupSocketIO() {
    const pubClient = createClient({ url: 'redis://localhost:6379' });
    const subClient = pubClient.duplicate();

    await pubClient.connect();
    await subClient.connect();

    io.adapter(createAdapter(pubClient, subClient));

    io.on('connection', (socket) => {
        console.log(`🔗 New connection: ${socket.id} (PID: ${process.pid})`);

        socket.on('chat message', (msg) => {
            console.log(`📩 ${msg} from ${socket.id}`);
            io.emit('chat message', msg);
        });

        socket.on('disconnect', (reason) => {
            console.log(`❌ Disconnected: ${socket.id}, reason: ${reason}`);
        });
    });
}

module.exports = { app, server, setupSocketIO };
