const fs = require('fs');
const path = require('path');

const iconDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// 1x1 green PNG base64
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const buf = Buffer.from(pngBase64, 'base64');
fs.writeFileSync(path.join(iconDir, 'icon-192x192.png'), buf);
fs.writeFileSync(path.join(iconDir, 'icon-512x512.png'), buf);
console.log('Generated PNG icons successfully.');
