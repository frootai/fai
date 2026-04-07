#!/usr/bin/env node
/**
 * FrootAI Marketplace Generator
 * Scans plugins/ directory and generates marketplace.json.
 *
 * Usage: node scripts/generate-marketplace.js
 *
 * Reads each plugin.json, extracts metadata, counts bundled items,
 * and writes the marketplace registry.
 */

const { readFileSync, writeFileSync, existsSync, readdirSync, statSync } = require('fs');
const { join, resolve } = require('path');

const ROOT = resolve(join(__dirname, '..'));
const PLUGINS_DIR = join(ROOT, 'plugins');
const OUTPUT = join(ROOT, 'marketplace.json');

function readJSON(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch { return null; }
}

function countItems(pluginJson) {
  const counts = {};
  for (const type of ['agents', 'instructions', 'skills', 'hooks']) {
    if (Array.isArray(pluginJson[type])) {
      counts[type] = pluginJson[type].length;
    }
  }
  return counts;
}

console.log('🍊 FrootAI Marketplace Generator');
console.log(`   Scanning: ${PLUGINS_DIR}`);

if (!existsSync(PLUGINS_DIR)) {
  console.log('   No plugins/ directory found. Creating empty marketplace.');
  writeFileSync(OUTPUT, JSON.stringify({
    name: 'FrootAI Plugin Marketplace',
    plugins: [],
    external: [],
    stats: { totalPlugins: 0, totalItems: 0, categories: [] }
  }, null, 2));
  process.exit(0);
}

const folders = readdirSync(PLUGINS_DIR).filter(f => {
  const p = join(PLUGINS_DIR, f);
  return statSync(p).isDirectory() && !f.startsWith('.');
});

const plugins = [];
const allKeywords = new Set();
let totalItems = 0;

for (const folder of folders) {
  const pjPath = join(PLUGINS_DIR, folder, 'plugin.json');
  if (!existsSync(pjPath)) {
    console.warn(`   ⚠️  ${folder}/ — no plugin.json, skipping`);
    continue;
  }

  const pj = readJSON(pjPath);
  if (!pj) {
    console.error(`   ❌ ${folder}/plugin.json — invalid JSON, skipping`);
    continue;
  }

  const items = countItems(pj);
  const itemCount = Object.values(items).reduce((a, b) => a + b, 0);
  totalItems += itemCount;

  if (pj.keywords) pj.keywords.forEach(k => allKeywords.add(k));

  plugins.push({
    name: pj.name || folder,
    description: pj.description || '',
    version: pj.version || '0.0.0',
    author: typeof pj.author === 'object' ? pj.author.name : (pj.author || 'Unknown'),
    license: pj.license || 'MIT',
    source: `./plugins/${folder}`,
    keywords: pj.keywords || [],
    plays: pj.plays || [],
    items
  });

  console.log(`   ✅ ${folder} — ${itemCount} items (v${pj.version || '0.0.0'})`);
}

// Sort by name
plugins.sort((a, b) => a.name.localeCompare(b.name));

// Build categories from keywords (deduplicated, sorted)
const categories = [...allKeywords].sort();

const marketplace = {
  "$schema": "https://frootai.dev/schemas/marketplace.schema.json",
  name: 'FrootAI Plugin Marketplace',
  description: 'Registry of all FrootAI plugins — themed bundles of agents, instructions, skills, and hooks.',
  version: '1.0.0',
  generated: new Date().toISOString(),
  plugins,
  external: [],
  stats: {
    totalPlugins: plugins.length,
    totalItems,
    categories
  }
};

writeFileSync(OUTPUT, JSON.stringify(marketplace, null, 2) + '\n');

console.log(`\n   📦 Generated marketplace.json`);
console.log(`   ${plugins.length} plugin(s), ${totalItems} total items, ${categories.length} categories`);
