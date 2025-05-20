const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const LOG_FILE = path.join(__dirname, "server.log");
let fileSize = 0;

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

wss.on("connection", (ws) => {
  console.log("🔌 Client connected to log stream");
});

// Monitor log file changes
fs.watch(LOG_FILE, (eventType) => {
  if (eventType === "change") {
    const newSize = fs.statSync(LOG_FILE).size;
    const stream = fs.createReadStream(LOG_FILE, {
      start: fileSize,
      end: newSize,
    });

    const rl = readline.createInterface({ input: stream });

    rl.on("line", (line) => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(line);
        }
      });
    });

    fileSize = newSize;
  }
});

server.listen(3000, () => {
  console.log("🚀 Log monitor server running at http://localhost:3000");
});
