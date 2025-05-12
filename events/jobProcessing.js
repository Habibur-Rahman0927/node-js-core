const EventEmitter = require('events');

class JobEmitter extends EventEmitter {
    startJob(jobId) {
        this.emit('jobStarted', jobId);

        let progress = 0;
        const interval = setInterval(() => {
            progress += 20;

            if (progress >= 100) {
                clearInterval(interval);

                // Simulate job success or failure randomly
                if (Math.random() < 0.5) {
                    this.emit('jobCompleted', jobId);
                } else {
                    this.emit('jobFailed', jobId, 'Unexpected error');
                }
            } else {
                this.emit('jobProgress', jobId, progress);
            }
        }, 1000);
    }
}

const jobEmitter = new JobEmitter();

// Event listeners
jobEmitter.on('jobStarted', (jobId) => {
    console.log(`🚀 Job ${jobId} started.`);
});

jobEmitter.on('jobProgress', (jobId, progress) => {
    console.log(`📊 Job ${jobId} progress: ${progress}%`);
});

jobEmitter.on('jobCompleted', (jobId) => {
    console.log(`✅ Job ${jobId} completed successfully!`);
});

jobEmitter.on('jobFailed', (jobId, error) => {
    console.log(`❌ Job ${jobId} failed: ${error}`);
});

// Simulate running a job
const jobId = 'IMG_456';
console.log('\n🎬 Starting image processing job...');
jobEmitter.startJob(jobId);

const jobId1 = 'IMG_457';
console.log('\n🎬 Starting image processing job...');
jobEmitter.startJob(jobId1);
