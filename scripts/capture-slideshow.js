const { execSync } = require('child_process');
const path = require('path');

const artifactDir = 'C:\\Users\\mahes\\.gemini\\antigravity\\brain\\d894d228-d356-4f7f-a0e2-515e5c77621d';
const browserPath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const outputPath = path.join(artifactDir, 'hero_background_slideshow.png');
console.log('Capturing hero_background_slideshow.png...');
try {
  const cmd = `"${browserPath}" --headless=new --screenshot="${outputPath}" --window-size=1366,900 --virtual-time-budget=3000 --hide-scrollbars --no-first-run --no-default-browser-check "http://localhost:3000"`;
  execSync(cmd, { stdio: 'inherit', timeout: 30000 });
  console.log(`Saved: ${outputPath}`);
} catch (err) {
  console.error('Error capturing slideshow:', err.message);
}
