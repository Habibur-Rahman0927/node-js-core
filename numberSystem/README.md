# 🔢 Number System Conversions (Binary, Decimal, Hexadecimal)

This document explains how to manually convert between Decimal, Binary, and Hexadecimal systems using JavaScript, along with step-by-step breakdowns.

---

## 1️⃣ Decimal to Binary (Recursive Manual)

### Example: Convert 13 to Binary

**Steps:**

```
13 ÷ 2 = 6 remainder 1  
6 ÷ 2  = 3 remainder 0  
3 ÷ 2  = 1 remainder 1  
1 ÷ 2  = 0 remainder 1
```

Now, read remainders **from bottom to top**:

```
Binary = 1101
```

### JavaScript Code (Recursive)

```js
function decimalToBinary(n) {
  if (n === 0) return '';
  return decimalToBinary(Math.floor(n / 2)) + (n % 2);
}
console.log(decimalToBinary(13)); // 1101
```

---

## 2️⃣ Binary to Decimal (Manual)

### Example: Convert `1101` to Decimal

```
1 × 2³ = 8  
1 × 2² = 4  
0 × 2¹ = 0  
1 × 2⁰ = 1  
-----------------
Total = 8 + 4 + 0 + 1 = 13
```

### JavaScript Code

```js
function binaryToDecimal(binStr) {
  return binStr.split('').reverse().reduce((acc, bit, i) => {
    return acc + parseInt(bit) * Math.pow(2, i);
  }, 0);
}
console.log(binaryToDecimal('1101')); // 13
```

---

## 3️⃣ Decimal to Hexadecimal

### Example: Convert 254 to Hexadecimal

**Steps:**

```
254 ÷ 16 = 15 remainder 14
15 ÷ 16 = 0 remainder 15
```

Now convert remainders to hex symbols:
- 15 = F
- 14 = E

```
Hex = FE
```

### JavaScript Code

```js
function decimalToHex(decimal) {
  const hexChars = '0123456789ABCDEF';
  let result = '';
  while (decimal > 0) {
    result = hexChars[decimal % 16] + result;
    decimal = Math.floor(decimal / 16);
  }
  return result || '0';
}
console.log(decimalToHex(254)); // FE
```

---

## 4️⃣ Hexadecimal to Decimal

### Example: Convert `1A` to Decimal

```
1 × 16¹ = 16  
A = 10 → 10 × 16⁰ = 10  
-------------------------
Total = 16 + 10 = 26
```

### JavaScript Code

```js
function hexToDecimal(hexStr) {
  return parseInt(hexStr, 16);
}
console.log(hexToDecimal('1A')); // 26
```

---

## 5️⃣ Binary to Hexadecimal

### Example: Convert `11011111` to Hex

Group bits in 4s from right:

```
1101 1111 → D F  
Hex = DF
```

### JavaScript Code

```js
function binaryToHex(binStr) {
  return parseInt(binStr, 2).toString(16).toUpperCase();
}
console.log(binaryToHex('11011111')); // DF
```

---

## 6️⃣ Hexadecimal to Binary

### Example: Convert `3F` to Binary

```
3 → 0011  
F → 1111  
Binary = 00111111
```

### JavaScript Code

```js
function hexToBinary(hexStr) {
  return hexStr.split('').map(char => {
    return parseInt(char, 16).toString(2).padStart(4, '0');
  }).join('');
}
console.log(hexToBinary('3F')); // 00111111
```

---
