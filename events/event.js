const EventEmitter = require('events');

// Create an instance
class FileProcessor extends EventEmitter {}
const processor = new FileProcessor();

// 1. Start upload
processor.on('upload-start', (fileName) => {
  console.log(`🚀 Upload started for ${fileName}`);
  setTimeout(() => {
    processor.emit('upload-complete', fileName);
  }, 1000); // simulate delay
});

// 2. On upload complete
processor.on('upload-complete', (fileName) => {
  console.log(`✅ Upload complete for ${fileName}`);
  processor.emit('process-start', fileName);
});

// 3. On process start
processor.on('process-start', (fileName) => {
  console.log(`⚙️  Processing ${fileName}`);
  setTimeout(() => {
    processor.emit('process-complete', fileName);
  }, 1500); // simulate delay
});

// 4. On process complete
processor.on('process-complete', (fileName) => {
  console.log(`📁 Processing complete for ${fileName}`);
  processor.emit('cleanup', fileName);
});

// 5. One-time event listener for cleanup
processor.once('cleanup', (fileName) => {
  console.log(`🧹 Cleaned up temporary files for ${fileName}`);
});

// Emit the first event
processor.emit('upload-start', 'profile_picture.jpg');
