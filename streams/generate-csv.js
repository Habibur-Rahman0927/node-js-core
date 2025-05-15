const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Define the output path
const filePath = path.join(__dirname, 'small-users.csv');
const writeStream = fs.createWriteStream(filePath);

// // Write CSV header
writeStream.write('id,name,email,age\n');

const totalRecords = 1000000000000; // use it only for test 1 trillion row
// const totalRecords = 10000;
let i = 1;

// Define a function to write in chunks respecting backpressure
function writeChunk() {
  let canWrite = true;

  while (i <= totalRecords && canWrite) {
    const name = `User${i}`;
    const email = `user${i}@example.com`;
    const age = Math.floor(Math.random() * 50) + 18;
    const row = `${i},${name},${email},${age}\n`;

    canWrite = writeStream.write(row);
    i++;
  }

  // If buffer is full, wait for 'drain' event
  if (i <= totalRecords) {
    writeStream.once('drain', writeChunk);
  } else {
    writeStream.end(() => {
      console.log(`✅ Finished writing ${totalRecords} users to users.csv`);
    });
  }
}

// Start writing
writeChunk();



// Create a readable stream from the file
const readStream = fs.createReadStream(filePath);

// Use the CSV parser stream
readStream
  .pipe(csv()) // Each row is parsed into an object
  .on('data', (row) => {
    // This is where you can process each row
    console.log(`User: ${row.name}, Email: ${row.email}, Age: ${row.age}`);
    // You could insert into DB here
  })
  .on('end', () => {
    console.log('✅ CSV file processing complete.');
  })
  .on('error', (err) => {
    console.error('❌ Error while processing file:', err);
  });