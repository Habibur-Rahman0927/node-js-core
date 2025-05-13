const fs = require('fs');

const data = [
  { name: 'Alice', score: 1200 },
  { name: 'Bob', score: 950 },
  { name: 'Charlie', score: 1500 },
];

const bufferArray = [];

data.forEach(entry => {
  const nameBuffer = Buffer.from(entry.name, 'utf-8');
  const nameLength = Buffer.alloc(1); // 1 byte for name length
  nameLength.writeUInt8(nameBuffer.length);



  const scoreBuffer = Buffer.alloc(4); // 4 bytes for score
  scoreBuffer.writeInt32BE(entry.score); // Big-endian
  console.log(nameLength, nameBuffer, scoreBuffer)
  bufferArray.push(nameLength, nameBuffer, scoreBuffer);
});

const finalBuffer = Buffer.concat(bufferArray);
console.log(finalBuffer)
fs.writeFileSync('scores.dat', finalBuffer);
console.log('✅ scores.dat created successfully.');
