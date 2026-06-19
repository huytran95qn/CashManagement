#!/usr/bin/env node
/**
 * Usage:
 *   node scripts/deploy.js <NOTION_TOKEN> [PORT]
 *   npm run deploy -- ntn_xxxx 3000
 */
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const [notionToken, port = '3000'] = process.argv.slice(2);

if (!notionToken) {
  console.error('ERROR: NOTION_TOKEN is required.');
  console.error('Usage: npm run deploy -- <NOTION_TOKEN> [PORT]');
  process.exit(1);
}

// ── 1. Generate .env ──────────────────────────────────────────────────────────
const envFile = path.join(__dirname, '..', 'packages', 'api', '.env');
const envContent = `NOTION_TOKEN=${notionToken}\nPORT=${port}\n`;
fs.writeFileSync(envFile, envContent, 'utf8');
console.log(`.env written to ${envFile}`);

const root = path.join(__dirname, '..');
const run = (cmd) => execSync(cmd, { stdio: 'inherit', cwd: root });

// ── 2. Check Docker availability ──────────────────────────────────────────────
const hasDocker = spawnSync('docker', ['info'], { stdio: 'ignore' }).status === 0;

if (hasDocker) {
  // ── 3a. Docker deploy ────────────────────────────────────────────────────────
  console.log('\nDocker detected — deploying with Docker Compose...');
  run('docker compose down --remove-orphans');
  run('docker compose build --no-cache');
  run('docker compose up -d');
} else {
  // ── 3b. Fallback: build & start directly with Node ───────────────────────────
  console.log('\nDocker not found — building and starting with Node directly...');
  run('npm run api:build');
  run('npm run api:start');
}

console.log(`\nAPI running at http://localhost:${port}/api/v1`);
console.log(`Swagger docs:  http://localhost:${port}/docs`);

