const WebSocket = require("ws");
const Redis = require("ioredis");

const pub = new Redis(); // Publisher
const sub = new Redis(); // Subscriber

let wss;

function setupWebSocket(server) {
    wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        console.log("🖥️ Dashboard connected");

        ws.on("close", () => {
            console.log("❌ Dashboard disconnected");
        });
    });

    sub.subscribe("webhook-events");
    sub.on("message", (channel, message) => {
        if (channel === "webhook-events") {
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

function publishWebhookEvent(data) {
    pub.publish("webhook-events", JSON.stringify(data));
}

module.exports = { setupWebSocket, broadcast, publishWebhookEvent };
