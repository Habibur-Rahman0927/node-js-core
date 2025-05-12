// jobQueue.js
class JobQueue {
    constructor() {
      this.queue = [];
      this.listeners = {};
    }
  
    on(event, handler) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(handler);
    }
  
    emit(event, data) {
      if (this.listeners[event]) {
        for (const handler of this.listeners[event]) {
          handler(data);
        }
      }
    }
  
    addJob(job) {
      this.queue.push(job);
      this.emit('jobQueued', job);
    }
  
    async runNext() {
      if (this.queue.length === 0) return;
  
      const job = this.queue.shift();
      this.emit('jobStarted', job);
  
      try {
        await job.handler();
        this.emit('jobCompleted', job);
      } catch (error) {
        this.emit('jobFailed', { job, error });
      }
    }
  
    start(interval = 5000) {
      setInterval(() => {
        this.runNext();
      }, interval);
    }
  }
  
  module.exports = JobQueue;
  