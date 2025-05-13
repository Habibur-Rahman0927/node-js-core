const net = require('net');

const client = new net.Socket();

const buildPacket = () => {
  const buf = Buffer.alloc(12);
  buf.writeUInt16BE(0xAA55, 0);      // Header
  buf.writeUInt32BE(1, 2);           // Device ID
  buf.writeInt16BE(2000, 6);         // Temp = 20.00°C
  buf.writeUInt16BE(8000, 8);        // Humidity = 80.00%
  
  const sum = buf.slice(0, 10).reduce((acc, val) => acc + val, 0);
  buf.writeUInt16BE(sum % 65536, 10); // CRC

  return buf;
};

client.connect(4000, 'localhost', () => {
  console.log('📨 Sending test data...');
  client.write(buildPacket());
});
