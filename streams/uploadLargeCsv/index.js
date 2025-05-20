const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static(path.join(__dirname, "public")));

app.post("/upload", upload.single("csvfile"), (req, res) => {
  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      // Simulate processing and saving
      console.log("✅ Processed:", data);
      results.push(data);
    })
    .on("end", () => {
      fs.unlinkSync(filePath); // remove temp file
      res.send("CSV file processed successfully");
    })
    .on("error", (err) => {
      console.error("❌ Error reading file:", err);
      res.status(500).send("Error processing file");
    });
});

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
