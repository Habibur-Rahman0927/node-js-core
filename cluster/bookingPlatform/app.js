const express = require('express');
const app = express();
app.use(express.json());

/**
 * Simulate in-memory room store
 * Room: { id, isBooked }
 */
const rooms = [
  { id: 1, isBooked: true },
  { id: 2, isBooked: false },
  { id: 3, isBooked: false },
];

app.get('/rooms', (req, res) => {
  res.json(rooms);
});

app.post('/book/:roomId', (req, res) => {
  const roomId = parseInt(req.params.roomId);
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) return res.status(404).json({ message: 'Room not found' });

  if (room.isBooked) {
    return res.status(409).json({ message: 'Room already booked!' });
  }

  // Simulate booking delay
  setTimeout(() => {
    room.isBooked = true;
    console.log(`[${process.pid}] Room ${roomId} booked`);
    res.json({ message: `Room ${roomId} booked successfully!` });
  }, 1000);
});

module.exports = app;
