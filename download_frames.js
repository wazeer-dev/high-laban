import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOTAL_FRAMES = 264;
const BASE_URL = 'https://pwhyyqvqxmjkbwqlcipn.supabase.co/storage/v1/object/public/webp%20sequence/frame_';
const OUTPUT_DIR = path.join(__dirname, 'public', 'webp-sequence');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => { });
      reject(err);
    });
  });
};

async function downloadAll() {
  console.log(`Starting download of ${TOTAL_FRAMES} frames...`);
  const batchSize = 20;

  for (let i = 0; i < TOTAL_FRAMES; i += batchSize) {
    const batch = [];
    for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES); j++) {
      const frameNum = String(j).padStart(3, '0');
      const url = `${BASE_URL}${frameNum}_delay-0.03s.webp`;
      const dest = path.join(OUTPUT_DIR, `frame_${frameNum}.webp`);
      batch.push(downloadFile(url, dest).then(() => {
        // console.log(`Downloaded frame ${j}`);
      }).catch(e => {
        console.error(`Error downloading frame ${j}:`, e.message);
      }));
    }
    await Promise.all(batch);
    console.log(`Downloaded batch ${i} - ${Math.min(i + batchSize, TOTAL_FRAMES)} / ${TOTAL_FRAMES}`);
  }
  console.log('Download complete.');
}

downloadAll();
