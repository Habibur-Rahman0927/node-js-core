const express = require("express");
const http = require("http");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static HTML
app.use(express.static(path.join(__dirname, "public")));

let connectedClient = null;
wss.on("connection", (ws) => {
  console.log("📡 Client connected for upload progress");
  connectedClient = ws;
});

const storage = multer.memoryStorage(); // store in memory buffer
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const { originalname, buffer } = req.file;
  const targetPath = path.join(__dirname, "uploads", originalname);
  const writeStream = fs.createWriteStream(targetPath);

  let uploadedBytes = 0;
  const totalBytes = buffer.length;

  const CHUNK_SIZE = 64 * 1024; // 64KB per chunk

  function sendChunk() {
    if (uploadedBytes >= totalBytes) {
      writeStream.end(() => {
        connectedClient?.send(JSON.stringify({ done: true }));
        res.send("✅ Upload complete");
      });
      return;
    }

    const nextChunk = buffer.slice(uploadedBytes, uploadedBytes + CHUNK_SIZE);
    writeStream.write(nextChunk, () => {
      uploadedBytes += CHUNK_SIZE;
      const percent = Math.min(
        100,
        ((uploadedBytes / totalBytes) * 100).toFixed(2)
      );
      connectedClient?.send(JSON.stringify({ percent }));

      setImmediate(sendChunk); // async recursion
    });
  }

  sendChunk(); // Start chunked upload
});

server.listen(3000, () => {
  console.log("🚀 Upload server running at http://localhost:3000");
});
