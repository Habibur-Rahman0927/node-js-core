const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const app = express();
const PORT = 3000;

// Setup multer with memory storage (no file saved to disk initially)
const upload = multer({ storage: multer.memoryStorage() });

// Image upload route
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { buffer, originalname } = req.file;
    const outputFilename = `resized-${Date.now()}-${originalname}`;
    const outputPath = path.join(__dirname, 'uploads', outputFilename);

    // Create a write stream
    const writeStream = fs.createWriteStream(outputPath);

    // Pipe through sharp to resize and then save
    sharp(buffer)
      .resize(300, 300)
      .jpeg({ quality: 100 }) // output format
      .pipe(writeStream)
      .on('finish', () => {
        res.json({ message: '✅ Image uploaded and resized!', file: outputFilename });
      })
      .on('error', (err) => {
        console.error('Stream error:', err);
        res.status(500).json({ error: 'Image processing failed' });
      });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Ensure upload folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
