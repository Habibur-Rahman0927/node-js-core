const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'sample.tar');
if (!fs.existsSync(filePath)) {
  console.error('❌ sample.tar not found. Create it using "tar -cf sample.tar yourfile.txt"');
  process.exit(1);
}

const buffer = fs.readFileSync(filePath);

// TAR headers are 512 bytes
const HEADER_SIZE = 512;

let offset = 0;
let fileIndex = 1;

while (offset < buffer.length) {
  const header = buffer.slice(offset, offset + HEADER_SIZE);

  const name = header.slice(0, 100).toString().replace(/\0/g, '');
  if (!name) break; // End of archive

  const mode = header.slice(100, 108).toString().replace(/\0/g, '');
  const sizeOctal = header.slice(124, 136).toString().replace(/\0/g, '');
  const size = parseInt(sizeOctal, 8);

  console.log(`📄 File ${fileIndex++}:`);
  console.log(`   • Name: ${name}`);
  console.log(`   • Mode: ${mode}`);
  console.log(`   • Size: ${size} bytes\n`);

  offset += HEADER_SIZE + Math.ceil(size / HEADER_SIZE) * HEADER_SIZE;
  console.log(offset)
}
