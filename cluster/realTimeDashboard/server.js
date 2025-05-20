const cluster = require('cluster');
const os = require('os');
const { server, setupSocketIO } = require('./app');

const PORT = 3000;

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`👑 Master ${process.pid} running with ${numCPUs} workers`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`💀 Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {
  server.listen(PORT, async () => {
    await setupSocketIO();
    console.log(`🚀 Worker ${process.pid} running on port ${PORT}`);
  });
}
