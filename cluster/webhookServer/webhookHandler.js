const { publishWebhookEvent } = require("./wsServer");

function handleWebhook(data) {
    console.log(`📨 Received webhook from ${data.source}: ${data.event}`);

    publishWebhookEvent({
        source: data.source,
        event: data.event,
        timestamp: Date.now(),
        metadata: data.metadata || {}
    });

    // TODO: Save to DB or stream to Kafka if needed
}

module.exports = { handleWebhook };
