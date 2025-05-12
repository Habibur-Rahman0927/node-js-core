// index.js
const JobQueue = require('./jobQueue');

const queue = new JobQueue();

// Event Listeners
queue.on('jobQueued', job => console.log(`[QUEUED] ${job.name}`));
queue.on('jobStarted', job => console.log(`[STARTED] ${job.name}`));
queue.on('jobCompleted', job => console.log(`[COMPLETED] ${job.name}`));
queue.on('jobFailed', ({ job, error }) => console.error(`[FAILED] ${job.name}: ${error.message}`));

// Register Jobs
queue.addJob({
  name: 'Daily Email Report',
  handler: async () => {
    await new Promise(res => setTimeout(res, 2000));
    console.log('📧 Email sent');
  }
});

queue.addJob({
  name: 'Image Optimization',
  handler: async () => {
    await new Promise((_, rej) => setTimeout(() => rej(new Error('Image corrupted')), 3000));
  }
});

// Start Background Job Processor
queue.start(3000); // runs every 3s
