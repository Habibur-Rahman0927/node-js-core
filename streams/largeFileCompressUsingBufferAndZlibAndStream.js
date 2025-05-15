const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// Paths
const userCSV = path.resolve(__dirname, 'users.csv');
const gzipPath = path.resolve(__dirname, 'users.csv.gz');

// 2️⃣ Compress the log file using gzip
const input = fs.createReadStream(userCSV);
const output = fs.createWriteStream(gzipPath);
const gzip = zlib.createGzip();

input.pipe(gzip).pipe(output).on('finish', () => {
  console.log('📦 Log file compressed to user.csv.gz');
});
