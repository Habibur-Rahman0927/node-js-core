function decimalToBinaryRecursive(decimal) {
    if (decimal === 0) return '0';
    if (decimal === 1) return '1';
    return binaryToDecimalRecursive(Math.floor(decimal / 2)) + (decimal % 2);
  }
  
  console.log(binaryToDecimalRecursive(10));  // Output: "1010"