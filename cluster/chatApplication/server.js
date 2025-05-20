const cluster = require('cluster');
const os = require('os');
const { app, server, setupSocketIO } = require('./app');

const PORT = 3000;

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`👑 Master ${process.pid} is running with ${numCPUs} CPUs`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`💀 Worker ${worker.process.pid} died. Starting new one...`);
        cluster.fork();
    });

} else {
    server.listen(PORT, async () => {
        await setupSocketIO();
        console.log(`🚀 Worker ${process.pid} listening on port ${PORT}`);
    });
}

