const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const artifactDir = 'C:\\Users\\mahes\\.gemini\\antigravity\\brain\\d894d228-d356-4f7f-a0e2-515e5c77621d';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browserPath = fs.existsSync(edgePath) ? edgePath : chromePath;

const pages = [
  { name: 'phase1_landing_desktop.png', url: 'http://localhost:3000/', width: 1280, height: 900 },
  { name: 'phase1_landing_mobile.png', url: 'http://localhost:3000/', width: 390, height: 844 },
  { name: 'phase1_start_location_login.png', url: 'http://localhost:3000/start', width: 1280, height: 900 },
  { name: 'phase1_map_hyderabad.png', url: 'http://localhost:3000/map/hyderabad', width: 1280, height: 900 },
  { name: 'phase1_report_flow.png', url: 'http://localhost:3000/report', width: 1280, height: 900 },
];

console.log('Using browser:', browserPath);

for (const p of pages) {
  const outputPath = path.join(artifactDir, p.name);
  console.log(`Capturing ${p.name} from ${p.url}...`);
  try {
    // Run headless chrome/edge with virtual-time-budget or timeout to allow animations & Leaflet to render
    const cmd = `"${browserPath}" --headless=new --screenshot="${outputPath}" --window-size=${p.width},${p.height} --virtual-time-budget=4000 --hide-scrollbars --no-first-run --no-default-browser-check "${p.url}"`;
    execSync(cmd, { stdio: 'inherit', timeout: 30000 });
    console.log(`Saved: ${outputPath}`);
  } catch (err) {
    console.error(`Failed to capture ${p.name}:`, err.message);
  }
}

console.log('All screenshots captured successfully.');
