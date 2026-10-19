const https = require('https');
const fs = require('fs');
const path = require('path');

const slidesDir = path.join(__dirname, '..', 'public', 'slides');
if (!fs.existsSync(slidesDir)) {
  fs.mkdirSync(slidesDir, { recursive: true });
}

const slides = [
  {
    name: 'slide-1.jpg',
    url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1920&q=80',
    title: 'Community Riverbank & Park Cleanup'
  },
  {
    name: 'slide-2.jpg',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1920&q=80',
    title: 'Tree Planting & Eco Regeneration'
  },
  {
    name: 'slide-3.jpg',
    url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1920&q=80',
    title: 'Spotless Green Urban Parks'
  },
  {
    name: 'slide-4.jpg',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    title: 'Clean Sustainable Smart City'
  }
];

function download(item) {
  return new Promise((resolve, reject) => {
    const dest = path.join(slidesDir, item.name);
    const file = fs.createWriteStream(dest);
    
    https.get(item.url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (res2) => {
          res2.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${item.name} (${fs.statSync(dest).size} bytes)`);
            resolve();
          });
        }).on('error', reject);
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${item.name} (${fs.statSync(dest).size} bytes)`);
          resolve();
        });
      } else {
        reject(new Error(`Status ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading high-res background slides...');
  for (const s of slides) {
    try {
      await download(s);
    } catch (e) {
      console.warn(`Failed downloading ${s.name}: ${e.message}`);
    }
  }
  console.log('Done.');
}

run();
