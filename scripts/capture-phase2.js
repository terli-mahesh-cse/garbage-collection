const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const artifactDir = 'C:\\Users\\mahes\\.gemini\\antigravity\\brain\\d894d228-d356-4f7f-a0e2-515e5c77621d';
const browserPath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const pages = [
  { name: 'phase2_communities.png', url: 'http://localhost:3000/communities', width: 1280, height: 900 },
  { name: 'phase2_community_detail.png', url: 'http://localhost:3000/communities/org-ckg', width: 1280, height: 900 },
  { name: 'phase2_events.png', url: 'http://localhost:3000/events', width: 1280, height: 900 },
  { name: 'phase2_event_detail.png', url: 'http://localhost:3000/events/event-1', width: 1280, height: 900 },
  { name: 'phase2_event_scan.png', url: 'http://localhost:3000/events/event-1/scan', width: 1280, height: 900 },
];

for (const p of pages) {
  const outputPath = path.join(artifactDir, p.name);
  console.log(`Capturing ${p.name}...`);
  try {
    const cmd = `"${browserPath}" --headless=new --screenshot="${outputPath}" --window-size=${p.width},${p.height} --virtual-time-budget=3000 --hide-scrollbars --no-first-run --no-default-browser-check "${p.url}"`;
    execSync(cmd, { stdio: 'inherit', timeout: 30000 });
    console.log(`Saved: ${outputPath}`);
  } catch (err) {
    console.error(`Error capturing ${p.name}:`, err.message);
  }
}
console.log('Phase 2 screenshots completed.');
