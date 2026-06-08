const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const isWindows = os.platform() === 'win32';

const tmpDir = path.join(process.cwd(), '.vercel-tmp');
const logFile = path.join(tmpDir, 'login.log');

function log(msg) {
  console.error(msg);
}

log('========================================');
log('Vercel Login Authorization');
log('========================================');
log('');

// Start background login process
const logStream = fs.openSync(logFile, 'w');
const child = spawn('node', ['node_modules/.bin/vercel', 'login'], {
  detached: true,
  stdio: ['ignore', logStream, logStream],
  shell: isWindows
});

child.unref();
log(`Login process started (PID: ${child.pid})`);
log('Waiting for authorization URL...');
log('');

// Wait for URL to appear in log file
setTimeout(() => {
  try {
    const content = fs.readFileSync(logFile, 'utf8');
    const match = content.match(/https:\/\/vercel\.com\/oauth\/device\?user_code=[A-Z0-9-]+/);
    if (match) {
      log('========================================');
      log('Authorization URL ready!');
      log('========================================');
      log('');
      log('Please open this URL in your browser:');
      log(match[0]);
      log('');
      log('After authorizing, let me know and I\'ll proceed with deployment.');
    } else {
      log('Waiting... Please check log file: ' + logFile);
    }
  } catch (e) {
    log('Waiting for login process...');
  }
}, 5000);
