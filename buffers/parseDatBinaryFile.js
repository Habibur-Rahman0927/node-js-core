const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'scores.dat');
const outputPath = path.resolve(__dirname, 'parsed_scores.txt');

if (!fs.existsSync(filePath)) {
  console.error('❌ file not found"');
  process.exit(1);
}

const buffer = fs.readFileSync(filePath);

let offset = 0;
let index = 1;

console.log('📄 Parsed Records:\n');
let outputText = '📄 Parsed Records:\n\n';

while (offset < buffer.length) {
  const nameLength = buffer.readUInt8(offset);
  offset += 1;

  const name = buffer.slice(offset, offset + nameLength).toString('utf-8');
//   console.log(offset, offset + nameLength, nameLength)
  offset += nameLength;

  const score = buffer.readInt32BE(offset);
  offset += 4;

  const line = `👤 ${index++}. ${name} — 💯 ${score}`;
  console.log(line);
  outputText += line + '\n';
}

// Write the output to a .txt file
fs.writeFileSync(outputPath, outputText, 'utf-8');
console.log(`\n📄 Output written to ${outputPath}`);
