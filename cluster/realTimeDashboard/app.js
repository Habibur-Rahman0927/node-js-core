const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 20000,
  pingInterval: 10000,
});

app.use(express.static(__dirname + "/public"));

let totalConnections = 0;

async function setupSocketIO() {
  const pubClient = createClient({ url: "redis://localhost:6379" });
  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", (socket) => {
    console.log(`🔗 New connection: ${socket.id} (PID: ${process.pid})`);
    totalConnections++;
    io.emit("stats", { totalConnections });

    socket.on("user-event", (data) => {
      console.log(`📥 Event from user:`, data);
      io.emit("user-event", data);
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Disconnected: ${socket.id}, reason: ${reason}`);
      totalConnections--;
      io.emit("stats", { totalConnections });
    });
  });
}

module.exports = { app, server, setupSocketIO };
