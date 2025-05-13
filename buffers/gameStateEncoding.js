const fs = require('fs');
const path = require('path');


// Scenario Setup
// Imagine you have a player with the following data structure per frame:

// id: player ID (1 byte)

// x: float32 (4 bytes) – X position

// y: float32 (4 bytes) – Y position

// vx: float32 (4 bytes) – velocity in X

// vy: float32 (4 bytes) – velocity in Y

// angle: float32 (4 bytes) – facing angle in degrees



// Player data to encode
const players = [
  { id: 1, x: 100.5, y: 250.25, vx: 5.2, vy: -3.1, angle: 90.0 },
  { id: 2, x: 300.0, y: 120.0, vx: 0.0, vy: 1.2, angle: 45.5 },
];

// File paths
const binaryPath = path.resolve(__dirname, 'game_frame.bin');
const decodedPath = path.resolve(__dirname, 'decoded_frame.txt');

// Encode player state
const bufferArray = [];

players.forEach(player => {
  const buf = Buffer.alloc(21); // 1 + 5 * 4 = 21 bytes
  buf.writeUInt8(player.id, 0);                    // 1 byte
  buf.writeFloatLE(player.x, 1);                   // 4 bytes
  buf.writeFloatLE(player.y, 5);                   // 4 bytes
  buf.writeFloatLE(player.vx, 9);                  // 4 bytes
  buf.writeFloatLE(player.vy, 13);                 // 4 bytes
  buf.writeFloatLE(player.angle, 17);              // 4 bytes
  bufferArray.push(buf);
});

// Combine buffers and write to file
const finalBuffer = Buffer.concat(bufferArray);
fs.writeFileSync(binaryPath, finalBuffer);
console.log('📦 Encoded game state written to binary file.');

// Read binary file and decode player state
const rawBuffer = fs.readFileSync(binaryPath);
let offset = 0;
let decodedText = '🎮 Decoded Player States:\n\n';

while (offset < rawBuffer.length) {
  const id = rawBuffer.readUInt8(offset); offset += 1;
  const x = rawBuffer.readFloatLE(offset); offset += 4;
  const y = rawBuffer.readFloatLE(offset); offset += 4;
  const vx = rawBuffer.readFloatLE(offset); offset += 4;
  const vy = rawBuffer.readFloatLE(offset); offset += 4;
  const angle = rawBuffer.readFloatLE(offset); offset += 4;

  const line = `🧍 Player ${id}: x=${x.toFixed(2)}, y=${y.toFixed(2)}, vx=${vx.toFixed(2)}, vy=${vy.toFixed(2)}, angle=${angle.toFixed(2)}°`;
  console.log(line);
  decodedText += line + '\n';
}

// Write decoded data to text file
fs.writeFileSync(decodedPath, decodedText, 'utf-8');
console.log('\n📄 Decoded output saved to file.');
