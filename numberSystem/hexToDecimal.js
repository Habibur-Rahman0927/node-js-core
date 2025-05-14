function hexToDecimalRecursive(hex, index = 0) {
  if (hex.length === 0) return 0;

  const hexChars = "0123456789ABCDEF";
  const lastChar = hex[hex.length - 1].toUpperCase();
  const value = hexChars.indexOf(lastChar);

  return (
    value * Math.pow(16, index) +
    hexToDecimalRecursive(hex.slice(0, -1), index + 1)
  );
}

console.log(hexToDecimalRecursive("FF"));