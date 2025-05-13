class RingBuffer {
  constructor(size = 1024 * 1024) {
    this.buffer = Buffer.alloc(size);
    this.size = size;
    this.writePtr = 0;
    this.readPtr = 0;
  }

  write(message) {
    const msgBuffer = Buffer.from(message);
    const msgLength = msgBuffer.length;

    // Total bytes = 4 bytes (length) + message
    const total = 4 + msgLength;

    if (this.availableSpace() < total) {
      throw new Error("Buffer overflow — not enough space to write message");
    }

    if (this.writePtr + total > this.size) {
      // Wrap around
      this.buffer.fill(0, this.writePtr); // optional: zero out tail
      this.writePtr = 0;
    }

    this.buffer.writeUInt32BE(msgLength, this.writePtr);
    msgBuffer.copy(this.buffer, this.writePtr + 4);
    this.writePtr += total;
  }

  read() {
    if (this.readPtr === this.writePtr) {
      return null; // Buffer is empty
    }

    if (this.readPtr + 4 > this.size) {
      this.readPtr = 0; // wrap around
    }

    const msgLength = this.buffer.readUInt32BE(this.readPtr);
    const end = this.readPtr + 4 + msgLength;

    if (end > this.size) {
      // Message wraps around — not supported in this simple example
      return null;
    }

    const message = this.buffer.slice(this.readPtr + 4, end).toString();
    this.readPtr = end;

    return message;
  }

  availableSpace() {
    if (this.writePtr >= this.readPtr) {
      return this.size - (this.writePtr - this.readPtr);
    } else {
      return this.readPtr - this.writePtr;
    }
  }
}
const ring = new RingBuffer(1024); // 1 KB

ring.write('hello');
ring.write('world');

console.log(ring.read()); // "hello"
console.log(ring.read()); // "world"
console.log(ring.read()); // null
