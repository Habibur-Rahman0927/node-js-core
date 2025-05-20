const { publishGpsUpdate } = require("./wsServer");

function handleGpsData(data) {
    console.log(`📍 Received GPS from ${data.deviceId}: (${data.lat}, ${data.lng})`);

    publishGpsUpdate({
        deviceId: data.deviceId,
        lat: data.lat,
        lng: data.lng,
        timestamp: Date.now()
    });

    // TODO: persist to DB or Redis stream if needed
}

module.exports = { handleGpsData };
