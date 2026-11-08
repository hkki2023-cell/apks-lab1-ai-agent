'use strict';

/**
 * Cross-platform build: packs src/hello.js into a Node.js Single Executable
 * Application -> build/hello (Linux/macOS) or build/hello.exe (Windows),
 * then runs a smoke test of the produced executable.
 * Docs: https://nodejs.org/api/single-executable-applications.html
 */

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const isWin = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const exe = path.join(buildDir, isWin ? 'hello.exe' : 'hello');
const blob = path.join(buildDir, 'sea-prep.blob');
const FUSE = 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2';

function step(msg) {
  console.log(`[build] ${msg}`);
}

async function main() {
  fs.mkdirSync(buildDir, { recursive: true });

  step('1/5 generate SEA blob');
  execFileSync(process.execPath, ['--experimental-sea-config', 'sea-config.json'], {
    cwd: root,
    stdio: 'inherit',
  });

  step(`2/5 copy node binary -> ${path.relative(root, exe)}`);
  fs.copyFileSync(process.execPath, exe);
  if (!isWin) fs.chmodSync(exe, 0o755);

  if (isMac) {
    step('2b remove macOS signature');
    execFileSync('codesign', ['--remove-signature', exe], { stdio: 'inherit' });
  }

  step('3/5 inject blob (postject)');
  const { inject } = require('postject');
  await inject(exe, 'NODE_SEA_BLOB', fs.readFileSync(blob), {
    sentinelFuse: FUSE,
    machoSegmentName: isMac ? 'NODE_SEA' : undefined,
    overwrite: true,
  });

  if (isMac) {
    step('3b ad-hoc sign for macOS');
    execFileSync('codesign', ['--sign', '-', exe], { stdio: 'inherit' });
  }

  step('4/5 smoke test');
  const out = execFileSync(exe, [], { encoding: 'utf8' }).trim();
  if (out !== 'Hello, World!') {
    throw new Error(`unexpected output from ${exe}: "${out}"`);
  }
  console.log(out);

  step(`5/5 OK -> ${path.relative(root, exe)}`);
}

main().catch((err) => {
  console.error(`[build] FAILED: ${err.message}`);
  process.exit(1);
});
