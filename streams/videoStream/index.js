const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.get('/video', (req, res) => {
  const videoPath = path.join(__dirname, 'sample.mp4');

  fs.stat(videoPath, (err, stats) => {
    if (err) {
      return res.status(404).send('Video not found');
    }

    const fileSize = stats.size;
    const range = req.headers.range;

    let start, end;

    if (range) {
      // Parse requested range
      const parts = range.replace(/bytes=/, '').split('-');
      start = parseInt(parts[0], 10);
      end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    } else {
      // Default range: first 1MB
      start = 0;
      end = Math.min(fileSize - 1, start + 1024 * 1024 - 1); // 1MB chunk
    }

    // Validate range
    if (start >= fileSize || end >= fileSize) {
      res.status(416).send('Range Not Satisfiable');
      return;
    }

    const chunkSize = (end - start) + 1;
    const videoStream = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });

    videoStream.pipe(res);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/video`);
});
