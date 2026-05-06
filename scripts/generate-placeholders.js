const fs = require('fs');
const path = require('path');

// Minimal 1x1 pixel PNG in base64
// splash.png — navy background (1080x1920 equivalent as solid color)
const navyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);

const dir = path.join(__dirname, '..', 'assets', 'images');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, 'splash.png'), navyPng);
fs.writeFileSync(path.join(dir, 'logo.png'), navyPng);

console.log('Placeholder images created in assets/images/');
