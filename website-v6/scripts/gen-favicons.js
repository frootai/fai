const sharp = require('sharp');
const fs = require('fs');

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="6" fill="#050508"/>
  <circle cx="16" cy="8" r="7.5" fill="#10b981" opacity="0.95"/>
  <circle cx="10" cy="12" r="5.5" fill="#7c3aed" opacity="0.6"/>
  <circle cx="22" cy="12" r="5.5" fill="#06b6d4" opacity="0.6"/>
  <circle cx="16" cy="13" r="4" fill="#ec4899" opacity="0.5"/>
  <rect x="14" y="15" width="4" height="9" rx="2" fill="#f59e0b"/>
  <path d="M13.5 24 L9 28.5" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <path d="M16 25 L16 29.5" stroke="#10b981" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <path d="M18.5 24 L23 28.5" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
</svg>`;

const buf = Buffer.from(faviconSvg);

Promise.all([
  sharp(buf).resize(32, 32).png().toFile('public/favicon-32x32.png'),
  sharp(buf).resize(16, 16).png().toFile('public/favicon-16x16.png'),
  sharp(buf).resize(180, 180).png().toFile('public/apple-touch-icon.png'),
  sharp(buf).resize(192, 192).png().toFile('public/android-chrome-192x192.png'),
  sharp(buf).resize(512, 512).png().toFile('public/android-chrome-512x512.png'),
]).then(() => console.log('All favicon PNGs created')).catch(e => console.error(e));
