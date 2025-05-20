const cluster = require("cluster");
const os = require("os");
const express = require("express");
const { addMessagesToQueue } = require("./queue");

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`👑 Master ${process.pid} running`);

  // Fork workers
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

  // API endpoint to accept bulk messages (email/SMS)
  app.post("/send-bulk", (req, res) => {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    addMessagesToQueue(messages);

    res.json({ success: true, queued: messages.length });
  });

  app.listen(3000, () => {
    console.log(`🚀 Worker ${process.pid} listening on port 3000`);
  });

  // Import dispatcher logic and start processing queue batches
  require("./dispatcher").startDispatching();
}
