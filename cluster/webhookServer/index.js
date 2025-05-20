const cluster = require("cluster");
const os = require("os");
const express = require("express");
const { handleWebhook } = require("./webhookHandler");
const { setupWebSocket } = require("./wsServer");

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`👑 Master ${process.pid} running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(`💀 Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    const app = express();
    app.use(express.json());
    app.use(express.static(__dirname)); // Serves dashboard.html

    // Webhook endpoint
    app.post("/webhook", (req, res) => {
        const payload = req.body;

        // You can validate headers or signatures here
        if (!payload.event || !payload.source) {
            return res.status(400).json({ error: "Invalid webhook payload" });
        }

        handleWebhook(payload);
        res.status(200).json({ success: true });
    });

    const server = app.listen(4000, () => {
        console.log(`⚙️ Worker ${process.pid} listening on port 4000`);
    });

    setupWebSocket(server); // Real-time updates
}
