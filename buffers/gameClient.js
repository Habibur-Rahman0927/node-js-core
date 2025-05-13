const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:8080');

socket.on('open', () => {
  console.log('🖥️ Connected to game server');
});

socket.on('message', (data) => {
  const buffer = Buffer.from(data);
  const count = buffer.readUInt8(0);
  const playerSize = 10;

  console.log(`\n🎯 Received ${count} player(s):`);

  for (let i = 0; i < count; i++) {
    const offset = 1 + i * playerSize;
    const id = buffer.readUInt8(offset);
    const x = buffer.readFloatBE(offset + 1);
    const y = buffer.readFloatBE(offset + 5);
    const health = buffer.readUInt8(offset + 9);

    console.log(`   👤 Player ${id} — X: ${x.toFixed(2)} | Y: ${y.toFixed(2)} | ❤️ Health: ${health}`);
  }
});
