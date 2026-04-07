#!/usr/bin/env node
/**
 * FrootAI — Materialize Plugins
 * 
 * Copies referenced primitives into plugin folders for standalone distribution.
 * When a plugin references `../../agents/frootai-rag-architect.agent.md`,
 * this script copies that file into `plugins/<name>/agents/` and rewrites
 * the path in a materialized `plugin.json`.
 * 
 * Usage:
 *   node scripts/materialize-plugins.js                  # All plugins
 *   node scripts/materialize-plugins.js enterprise-rag   # Single plugin
 *   node scripts/materialize-plugins.js --dry-run        # Preview only
 */

const fs = require('fs');
const path = require('path');

const PLUGINS_DIR = path.join(__dirname, '..', 'plugins');
const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const targetPlugin = args.find(a => !a.startsWith('--'));

let totalCopied = 0;
let totalSkipped = 0;
let totalBroken = 0;
let pluginsProcessed = 0;

function resolveRef(pluginDir, ref) {
  return path.resolve(pluginDir, ref);
}

function copyPrimitive(srcPath, destDir, filename) {
  if (!fs.existsSync(srcPath)) {
    return { status: 'broken', src: srcPath };
  }

  const destPath = path.join(destDir, filename);
  if (!DRY_RUN) {
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    if (fs.statSync(srcPath).isDirectory()) {
      // Copy directory recursively
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  return { status: 'copied', dest: destPath };
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function materializePlugin(pluginName) {
  const pluginDir = path.join(PLUGINS_DIR, pluginName);
  const pluginJsonPath = path.join(pluginDir, 'plugin.json');

  if (!fs.existsSync(pluginJsonPath)) return;

  const plugin = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
  const distDir = path.join(pluginDir, 'dist');

  console.log(`\n  📦 ${pluginName} (v${plugin.version})`);

  // Materialized plugin.json with local paths
  const materialized = { ...plugin };
  const categories = ['agents', 'instructions', 'skills', 'hooks'];
  let pluginCopied = 0;
  let pluginBroken = 0;

  for (const category of categories) {
    const refs = plugin[category] || [];
    if (refs.length === 0) continue;

    const newPaths = [];
    for (const ref of refs) {
      const srcPath = resolveRef(pluginDir, ref);
      const basename = path.basename(ref.replace(/\/$/, ''));
      const destSubDir = path.join(distDir, category);
      const result = copyPrimitive(srcPath, destSubDir, basename);

      if (result.status === 'copied') {
        newPaths.push(`./${category}/${basename}`);
        pluginCopied++;
        totalCopied++;
      } else {
        console.log(`     ⚠️  Broken: ${ref}`);
        newPaths.push(ref); // Keep original broken ref
        pluginBroken++;
        totalBroken++;
      }
    }
    materialized[category] = newPaths;
  }

  // Write materialized plugin.json
  if (!DRY_RUN && pluginCopied > 0) {
    const distPluginJson = path.join(distDir, 'plugin.json');
    if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
    fs.writeFileSync(distPluginJson, JSON.stringify(materialized, null, 2) + '\n');
  }

  const statusIcon = pluginBroken > 0 ? '⚠️' : '✅';
  console.log(`     ${statusIcon} ${pluginCopied} copied, ${pluginBroken} broken`);
  pluginsProcessed++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════════════════

console.log(`🍊 FrootAI Plugin Materializer${DRY_RUN ? ' (DRY RUN)' : ''}`);
console.log(`   Root: ${ROOT}`);

if (targetPlugin) {
  materializePlugin(targetPlugin);
} else {
  const plugins = fs.readdirSync(PLUGINS_DIR).filter(f => {
    const s = fs.statSync(path.join(PLUGINS_DIR, f));
    return s.isDirectory() && fs.existsSync(path.join(PLUGINS_DIR, f, 'plugin.json'));
  });

  for (const p of plugins) {
    materializePlugin(p);
  }
}

console.log(`\n${'─'.repeat(50)}`);
console.log(`  Plugins: ${pluginsProcessed}`);
console.log(`  Copied:  ${totalCopied} primitives`);
console.log(`  Broken:  ${totalBroken} references`);
if (DRY_RUN) console.log(`  (dry run — no files written)`);
console.log(`${'─'.repeat(50)}\n`);

process.exit(totalBroken > 0 ? 1 : 0);
