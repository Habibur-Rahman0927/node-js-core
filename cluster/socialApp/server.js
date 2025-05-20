const cluster = require('cluster');
const os = require('os');
const app = require('./app');

const PORT = 3000;

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master ${process.pid} is running`);
    console.log(`Forking server for ${numCPUs} CPUs`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // If a worker dies, fork a new one.
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Forking a new one.`);
        cluster.fork();
    });

} else {
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started server on port ${PORT}`);
    });
}
