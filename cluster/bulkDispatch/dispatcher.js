const { getBatch, requeueMessages, queueLength } = require("./queue");
const { delay } = require("./utils");

// Mock send functions
async function sendEmail(message) {
  console.log(`📧 Sending email to ${message.to} with subject "${message.subject}"`);
  // Simulate success/failure randomly
  if (Math.random() < 0.8) return true;
  throw new Error("Email failed");
}

async function sendSMS(message) {
  console.log(`📱 Sending SMS to ${message.to} with text "${message.text}"`);
  // Simulate success/failure randomly
  if (Math.random() < 0.85) return true;
  throw new Error("SMS failed");
}

const BATCH_SIZE = 5;
const RATE_LIMIT_DELAY_MS = 2000; // 2 seconds delay between batches
const MAX_RETRIES = 3;

async function processBatch() {
  const batch = getBatch(BATCH_SIZE);
  if (batch.length === 0) return;

  const failedMessages = [];

  for (const message of batch) {
    try {
      if (message.type === "email") {
        await sendEmail(message);
      } else if (message.type === "sms") {
        await sendSMS(message);
      } else {
        console.warn(`⚠️ Unknown message type: ${message.type}`);
      }
    } catch (err) {
      message.attempts++;
      if (message.attempts < MAX_RETRIES) {
        failedMessages.push(message);
      } else {
        console.error(`❌ Message to ${message.to} failed after ${MAX_RETRIES} attempts.`);
      }
    }
  }

  if (failedMessages.length > 0) {
    requeueMessages(failedMessages);
  }

  await delay(RATE_LIMIT_DELAY_MS);
}

async function startDispatching() {
  while (true) {
    if (queueLength() > 0) {
      await processBatch();
    } else {
      await delay(1000); // wait before checking queue again
    }
  }
}

module.exports = { startDispatching };
