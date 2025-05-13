const http = require('http');
const fs = require('fs');
const path = require('path');

const MAX_SIZE = 5 * 1024 * 1024; // 5MB max size
const UPLOAD_DIR = path.resolve(__dirname, 'uploads');
const FILE_PATH = path.join(UPLOAD_DIR, 'image.png');

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/upload') {
    let dataBuffer = Buffer.alloc(0); // Empty buffer to start with

    req.on('data', chunk => {
        dataBuffer = Buffer.concat([dataBuffer, chunk]);
        console.log(chunk)
        console.log(dataBuffer)

        console.log(dataBuffer.slice(0, 8).toString('hex'))
        console.log(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]).toString('hex'))

        const hexString = dataBuffer.slice(0, 8).toString('hex'); 
        const byteArray = [];

        for (let i = 0; i < hexString.length; i += 2) {
            byteArray.push(`0x${hexString[i]}${hexString[i + 1]}`);
        }

        console.log(byteArray.join(', '));

      if (dataBuffer.length > MAX_SIZE) {
        res.writeHead(413, { 'Content-Type': 'text/plain' });
        res.end('File too large');
        req.destroy(); // Stop reading more data
      }
    });

    req.on('end', () => {
      const isPng = dataBuffer.slice(0, 8).equals(
        Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
      );

      if (!isPng) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Only PNG files are allowed');
        return;
      }

      // ✅ Ensure upload directory exists
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      // ✅ Save to disk
      fs.writeFileSync(FILE_PATH, dataBuffer);

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Image uploaded and saved successfully');
    });
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
