import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createSolidPng(width, height, r, g, b, innerR, innerG, innerB) {
  // Generates an uncompressed/deflated RGB PNG
  const buffer = Buffer.alloc(width * height * 3 + height);
  let pos = 0;
  const radius = Math.min(width, height) / 2;
  const cx = width / 2;
  const cy = height / 2;

  for (let y = 0; y < height; y++) {
    buffer[pos++] = 0; // Filter byte: None
    for (let x = 0; x < width; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist < radius * 0.45) {
        // Center accent (amber: 245, 158, 11)
        buffer[pos++] = innerR;
        buffer[pos++] = innerG;
        buffer[pos++] = innerB;
      } else if (dist < radius * 0.85) {
        // Slate surface (30, 41, 59)
        buffer[pos++] = 30;
        buffer[pos++] = 41;
        buffer[pos++] = 59;
      } else {
        // Background dark (9, 13, 22)
        buffer[pos++] = r;
        buffer[pos++] = g;
        buffer[pos++] = b;
      }
    }
  }

  const deflated = zlib.deflateSync(buffer);

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crc = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = chunk('IHDR', ihdr);
  const idatChunk = chunk('IDAT', deflated);
  const iendChunk = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

// 192x192
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createSolidPng(192, 192, 9, 13, 22, 245, 158, 11));
// 512x512
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createSolidPng(512, 512, 9, 13, 22, 245, 158, 11));
// Maskable 512x512
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createSolidPng(512, 512, 15, 23, 42, 245, 158, 11));
// Apple Touch Icon 180x180
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createSolidPng(180, 180, 9, 13, 22, 245, 158, 11));

console.log('PWA PNG icons generated successfully!');
