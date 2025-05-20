const cluster = require('cluster');
const os = require('os');
const http = require('http');
const app = require('./app');
const numCPUs = os.cpus().length;
const PORT = 3000;

if (cluster.isPrimary) {
  console.log(`👑 Master ${process.pid} running...`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`💀 Worker ${worker.process.pid} died`);
    cluster.fork();
  });

} else {
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`🚀 Worker ${process.pid} listening on port ${PORT}`);
  });
}
