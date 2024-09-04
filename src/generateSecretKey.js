const crypto = require('crypto');

// Function to generate a secure random key
function generateSecretKey(length) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

// Usage example: Generate a 32-character (256-bit) secret key
const secretKey = generateSecretKey(32);
console.log('Generated Secret Key:', secretKey);
