const cluster = require("cluster");
const os = require("os");
const express = require("express");
const { handleGpsData } = require("./gpsHandler");
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
    app.use(express.static(__dirname)); // Serves dashboard.html at /


    // REST API endpoint to simulate GPS updates
    app.post("/gps", (req, res) => {
        const gpsData = req.body;

        if (!gpsData.deviceId || !gpsData.lat || !gpsData.lng) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        handleGpsData(gpsData);
        res.json({ success: true });
    });

    const server = app.listen(3000, () => {
        console.log(`🚗 Worker ${process.pid} listening on port 3000`);
    });

    setupWebSocket(server); // WebSocket for dashboard updates
}
