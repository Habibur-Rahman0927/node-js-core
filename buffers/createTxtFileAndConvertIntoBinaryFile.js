const fs = require('fs');

// Step 1: Write text to original.txt
const originalText = `Hello, this is a test file.
It contains multiple lines of text.
We'll convert this into a binary file and back.`;

fs.writeFileSync('original.txt', originalText, 'utf-8');
console.log('✅ original.txt created.');

// Step 2: Convert original.txt to binary
const textContent = fs.readFileSync('original.txt', 'utf-8');
const binaryBuffer = Buffer.from(textContent, 'utf-8');
fs.writeFileSync('converted.dat', binaryBuffer);
console.log('✅ converted.dat (binary) created.');

// Step 3: Read binary and write to reconstructed.txt
const readBinaryBuffer = fs.readFileSync('converted.dat');
const reconstructedText = readBinaryBuffer.toString('utf-8');
fs.writeFileSync('reconstructed.txt', reconstructedText, 'utf-8');
console.log('✅ reconstructed.txt created from binary.');

// Step 4: Print to console
console.log('\n📄 Reconstructed Text from Binary File:\n');
console.log(reconstructedText);
