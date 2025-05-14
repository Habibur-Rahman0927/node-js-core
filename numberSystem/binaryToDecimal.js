function binaryToDecimalRecursive(binaryStr, index = 0) {
    if (index >= binaryStr.length) return 0;
    const bit = parseInt(binaryStr[binaryStr.length - 1 - index]);
    return bit * Math.pow(2, index) + binaryToDecimalRecursive(binaryStr, index + 1);
}
  
console.log(binaryToDecimalRecursive("1010"));  // Output: "10