#!/usr/bin/env node
/**
 * Writes packages/api/.env from either:
 *   - CLI args:    node scripts/setup-env.js <NOTION_TOKEN> [PORT]
 *   - Env vars:    NOTION_TOKEN=xxx node scripts/setup-env.js  (CI/hosting platforms)
 */
const fs = require('fs');
const path = require('path');

const notionToken = process.argv[2] || process.env.NOTION_TOKEN;
const port = process.argv[3] || process.env.PORT || '3000';

if (!notionToken) {
  console.error('ERROR: NOTION_TOKEN is required.');
  console.error('  CLI:      node scripts/setup-env.js <NOTION_TOKEN> [PORT]');
  console.error('  Env var:  set NOTION_TOKEN in your platform dashboard');
  process.exit(1);
}

const envFile = path.join(__dirname, '..', 'packages', 'api', '.env');
fs.mkdirSync(path.dirname(envFile), { recursive: true });
fs.writeFileSync(envFile, `NOTION_TOKEN=${notionToken}\nPORT=${port}\n`, 'utf8');
console.log(`.env written to ${envFile}`);
