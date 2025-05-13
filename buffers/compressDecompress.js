const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// Paths
const logPath = path.resolve(__dirname, 'log.txt');
const gzipPath = path.resolve(__dirname, 'log.txt.gz');
const decompressedPath = path.resolve(__dirname, 'log_decompressed.txt');

// 1️⃣ Create a sample log file
const logContent = `
[INFO] Server started at 10:00
[INFO] Connected to database
[ERROR] Failed to fetch user data
[INFO] Server shut down at 18:00
`;

fs.writeFileSync(logPath, logContent, 'utf-8');
console.log('✅ Log file created.');

// 2️⃣ Compress the log file using gzip
const input = fs.createReadStream(logPath);
const output = fs.createWriteStream(gzipPath);
const gzip = zlib.createGzip();

input.pipe(gzip).pipe(output).on('finish', () => {
  console.log('📦 Log file compressed to log.txt.gz');

  // 3️⃣ Decompress it back to a readable file
  const decompressInput = fs.createReadStream(gzipPath);
  const decompressOutput = fs.createWriteStream(decompressedPath);
  const gunzip = zlib.createGunzip();

  decompressInput.pipe(gunzip).pipe(decompressOutput).on('finish', () => {
    console.log('📂 Log file decompressed to log_decompressed.txt');

    // 4️⃣ Display decompressed content
    const result = fs.readFileSync(decompressedPath, 'utf-8');
    console.log('\n📄 Decompressed Log Content:\n');
    console.log(result);
  });
});
