const EventEmitter = require('events');

class EmailQueue extends EventEmitter {
  constructor() {
    super();
    this.queue = [];
    this.maxRetries = 3;
  }

  // Simulate a user submitting an email to send
  submit(email) {
    this.queue.push({ ...email, retries: 0 });
    this.emit('queued', email);
  }

  // Start processing emails
  startProcessing() {
    if (this.queue.length === 0) return;

    const job = this.queue.shift();
    this.emit('processing', job);
  }
}

const emailQueue = new EmailQueue();

// Listener: When an email is queued
emailQueue.on('queued', (email) => {
  console.log(`📩 Email to "${email.to}" has been queued.`);
  setTimeout(() => emailQueue.startProcessing(), 1000);
});

// Listener: When email starts processing
emailQueue.on('processing', (job) => {
  console.log(`⚙️  Processing email to "${job.to}"...`);

  // Simulate email sending logic
  const success = Math.random() > 0.3; // 70% chance of success

  setTimeout(() => {
    if (success) {
      emailQueue.emit('sent', job);
    } else {
      emailQueue.emit('failed', job);
    }
  }, 1500);
});

// Listener: Email successfully sent
emailQueue.on('sent', (job) => {
  console.log(`✅ Email to "${job.to}" sent successfully.`);
  emailQueue.startProcessing(); // Continue with next email
});

// Listener: Email failed
emailQueue.on('failed', (job) => {
  console.log(`❌ Failed to send email to "${job.to}".`);

  if (job.retries < emailQueue.maxRetries) {
    job.retries++;
    console.log(`🔁 Retrying (${job.retries}/${emailQueue.maxRetries})...`);
    emailQueue.queue.unshift(job); // Put it back in the front of the queue
  } else {
    console.log(`🚫 Max retries reached for "${job.to}". Giving up.`);
  }

  emailQueue.startProcessing();
});

// SUBMIT EMAIL JOBS
emailQueue.submit({ to: 'alice@example.com', subject: 'Welcome Alice!' });
emailQueue.submit({ to: 'bob@example.com', subject: 'Welcome Bob!' });
emailQueue.submit({ to: 'charlie@example.com', subject: 'Welcome Charlie!' });
