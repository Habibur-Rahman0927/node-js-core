function binaryToHexRecursive(bin) {
  const hexChars = "0123456789ABCDEF";

  // Pad to make length a multiple of 4
  const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, "0");

  // Base case
  if (padded.length === 0) return "";

  // Take first 4 bits and convert to decimal manually
  const nibble = padded.slice(0, 4);
  let decimal = 0;
  for (let i = 0; i < 4; i++) {
    decimal += parseInt(nibble[i]) * Math.pow(2, 3 - i);
  }

  return hexChars[decimal] + binaryToHexRecursive(padded.slice(4));
}

binaryToHexRecursive("1101");