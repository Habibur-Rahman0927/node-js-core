// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = 3000;

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// Endpoint to stream video with quality selection
app.get("/video/:quality", (req, res) => {
  const quality = req.params.quality; // e.g., '480p', '720p'
  const videoPath = path.join(__dirname, `videos/video-${quality}.mp4`);

  fs.stat(videoPath, (err, stats) => {
    if (err) {
      return res.status(404).send("Video not found");
    }

    const range = req.headers.range;
    if (!range) {
      // Default to sending entire file
      const fileSize = stats.size;
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      });
      fs.createReadStream(videoPath).pipe(res);
    } else {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;

      if (start >= stats.size) {
        res.status(416).send("Requested range not satisfiable");
        return;
      }

      const chunksize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      });
      file.pipe(res);
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
