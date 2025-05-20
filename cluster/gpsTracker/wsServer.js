// wsServer.js
const WebSocket = require("ws");
const Redis = require("ioredis");

const pub = new Redis();      // For publishing
const sub = new Redis();      // For subscribing

let wss;

function setupWebSocket(server) {
    wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        console.log("🖥️ Dashboard connected");

        ws.on("close", () => {
            console.log("❌ Dashboard disconnected");
        });
    });

    // Subscribe to "gps" channel
    sub.subscribe("gps");
    sub.on("message", (channel, message) => {
        if (channel === "gps") {
            broadcast(message);
        }
    });
}

function broadcast(message) {
    if (!wss) return;
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// This gets called by gpsHandler
function publishGpsUpdate(data) {
    pub.publish("gps", JSON.stringify(data));
}

module.exports = { setupWebSocket, broadcast, publishGpsUpdate };
