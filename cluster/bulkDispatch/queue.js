// In-memory queue simulating a message store
const messageQueue = [];

function addMessagesToQueue(messages) {
  messages.forEach(msg => messageQueue.push({ ...msg, attempts: 0 }));
}

function getBatch(batchSize = 10) {
  return messageQueue.splice(0, batchSize);
}

function requeueMessages(messages) {
  messages.forEach(msg => messageQueue.push(msg));
}

function queueLength() {
  return messageQueue.length;
}

module.exports = { addMessagesToQueue, getBatch, requeueMessages, queueLength };
