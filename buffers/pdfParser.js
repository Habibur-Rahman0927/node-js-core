const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'sample.pdf');

// Step 1: Read the PDF file into a Buffer
if (!fs.existsSync(filePath)) {
  console.error('❌ sample.pdf not found. Please place it in the same folder.');
  process.exit(1);
}

const buffer = fs.readFileSync(filePath);

// Step 2: Verify the PDF Header
const header = buffer.slice(0, 5).toString();
console.log('🔍 PDF Header:', header);

if (header !== '%PDF-') {
  console.error('❌ Not a valid PDF file.');
  process.exit(1);
}

console.log('✅ Valid PDF file detected.');

// Step 3: Convert buffer to string for rough text search
const pdfString = buffer.toString();

// Step 4: Extract text within BT ... ET blocks
const textBlocks = pdfString.match(/BT[\s\S]*?ET/g);

if (!textBlocks) {
  console.log('⚠️ No BT/ET text blocks found in the PDF.');
  process.exit(0);
}

console.log(`\n📄 Found ${textBlocks.length} text blocks:\n`);

textBlocks.forEach((block, i) => {
  console.log(`--- Block ${i + 1} ---`);
  const textMatches = [...block.matchAll(/\((.*?)\)/g)];
  if (textMatches.length === 0) {
    console.log('No text found.');
  } else {
    textMatches.forEach(([, txt]) => console.log('•', txt));
  }
  console.log();
});
