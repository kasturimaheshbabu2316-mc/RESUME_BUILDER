#!/usr/bin/env node
const { spawnSync } = require('child_process');
const os = require('os');
const isWindows = os.platform() === 'win32';

function log(msg) {
  console.error(msg);
}

function commandExists(cmd) {
  try {
    if (isWindows) {
      const result = spawnSync('where', [cmd], { stdio: 'ignore' });
      return result.status === 0;
    } else {
      const result = spawnSync('sh', ['-c', `command -v "$1"`, '--', cmd], { stdio: 'ignore' });
      return result.status === 0;
    }
  } catch {
    return false;
  }
}

function getCommandOutput(cmd, args) {
  try {
    const result = spawnSync(cmd, args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], shell: isWindows });
    return result.status === 0 ? (result.stdout || '').trim() : null;
  } catch {
    return null;
  }
}

log('========================================');
log('Vercel CLI Installation Script');
log('========================================');
log('');

if (commandExists('vercel')) {
  const version = getCommandOutput('vercel', ['--version']) || 'unknown';
  log(`Vercel CLI already installed: ${version}`);
  process.exit(0);
}

log('Installing Vercel CLI using npm...');
log('');

try {
  const result = spawnSync('npm', ['install', '-g', 'vercel'], { stdio: 'inherit', shell: isWindows });
  if (result.status !== 0) throw new Error(`Exit code: ${result.status}`);
  
  log('');
  log('========================================');
  log('Vercel CLI installed successfully!');
  log('========================================');
} catch (error) {
  log(`Installation failed: ${error.message}`);
  process.exit(1);
}
