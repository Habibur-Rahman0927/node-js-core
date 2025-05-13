const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
console.log('🎮 Game server running on ws://localhost:8080');

const players = [
  { id: 1, x: 10, y: 20, health: 95 },
  { id: 2, x: 40, y: 80, health: 70 },
];

server.on('connection', (socket) => {
  console.log('✅ Player connected');

  const interval = setInterval(() => {
    const playerSize = 10; // 1 + 4 + 4 + 1
    const buffer = Buffer.alloc(1 + players.length * playerSize); // 1 byte for count
    buffer.writeUInt8(players.length, 0);

    players.forEach((player, i) => {
      const offset = 1 + i * playerSize;
      buffer.writeUInt8(player.id, offset);         // 1 byte
      buffer.writeFloatBE(player.x, offset + 1);    // 4 bytes
      buffer.writeFloatBE(player.y, offset + 5);    // 4 bytes
      buffer.writeUInt8(player.health, offset + 9); // 1 byte
    });

    socket.send(buffer);
  }, 1000);

  socket.on('close', () => {
    console.log('❌ Player disconnected');
    clearInterval(interval);
  });
});
