function decimalToHexRecursive(n) {
  const hexChars = "0123456789ABCDEF";

  if (n < 16) return hexChars[n];
  return decimalToHexRecursive(Math.floor(n / 16)) + hexChars[n % 16];
}

console.log(decimalToHexRecursive(255));