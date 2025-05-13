const net = require('net');

// Helper to read signed/unsigned integers
const readUInt16 = (buf, offset) => buf.readUInt16BE(offset);
const readInt16 = (buf, offset) => buf.readInt16BE(offset);
const readUInt32 = (buf, offset) => buf.readUInt32BE(offset);

// Validate checksum
const validateCRC = (buf) => {
  const dataSum = buf.slice(0, 10).reduce((sum, b) => sum + b, 0);
  const crc = buf.readUInt16BE(10);
  return (dataSum % 65536) === crc;
};

const server = net.createServer((socket) => {
  console.log('📡 IoT device connected');

  socket.on('data', (chunk) => {
    if (chunk.length !== 12) {
      console.log('❌ Invalid packet length');
      return;
    }

    const header = chunk.readUInt16BE(0);
    if (header !== 0xAA55) {
      console.log('❌ Invalid header');
      return;
    }

    const deviceId = readUInt32(chunk, 2);
    const tempRaw = readInt16(chunk, 6);
    const humidityRaw = readUInt16(chunk, 8);

    if (!validateCRC(chunk)) {
      console.log('❌ CRC mismatch');
      return;
    }

    const temperature = tempRaw / 100;
    const humidity = humidityRaw / 100;

    console.log(`✅ Device ${deviceId}: Temp = ${temperature}°C, Humidity = ${humidity}%`);
  });

  socket.on('end', () => {
    console.log('📴 Device disconnected');
  });
});

server.listen(4000, () => {
  console.log('🚀 IoT TCP Server running on port 4000');
});
