function hexToBinaryRecursive(hex) {
  const hexMap = {
    0: "0000",
    1: "0001",
    2: "0010",
    3: "0011",
    4: "0100",
    5: "0101",
    6: "0110",
    7: "0111",
    8: "1000",
    9: "1001",
    A: "1010",
    B: "1011",
    C: "1100",
    D: "1101",
    E: "1110",
    F: "1111",
  };

  if (hex.length === 0) return "";

  const char = hex[0].toUpperCase();

  if (!hexMap[char]) {
    throw new Error(`Invalid hex character: ${char}`);
  }

  return hexMap[char] + hexToBinaryRecursive(hex.slice(1));
}

console.log(hexToBinaryRecursive("A"));