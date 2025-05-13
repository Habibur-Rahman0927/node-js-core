// server.js
const net = require('net');

const server = net.createServer((socket) => {
  console.log('🟢 Client connected');

  socket.on('data', (data) => {
    console.log('📥 Received:', data.toString());

    // Send a response using Buffer
    const response = Buffer.from('👋 Hello from server!');
    socket.write(response);
  });

  socket.on('end', () => {
    console.log('🔌 Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('🚀 Server listening on port 3000');
});
