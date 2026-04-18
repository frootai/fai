#!/usr/bin/env node
// @ts-check
/**
 * FAI Factory — Agent FAI Knowledge Refresh Adapter
 * Updates Agent FAI's runtime knowledge from fai-catalog.json:
 *   1. Scans for ecosystem prompt fragments in functions/ and vscode-extension/
 *   2. Generates .factory/agent-fai-knowledge.json with fresh stats and play list
 *
 * Usage: node scripts/factory/adapters/agent-fai.js
 */
const fs = require("fs");
const path = require("path");

const REPO_ROOT = process.env.FROOTAI_PUBLIC_REPO || path.resolve(__dirname, "../../..");

/**
 * Update ecosystem stats in a prompt/system-message file.
 * Looks for markers like "<!-- FAI_ECOSYSTEM_START -->" / "<!-- FAI_ECOSYSTEM_END -->"
 * or JSON blocks with ecosystem data and replaces them.
 * @param {string} filePath
 * @param {object} stats - Catalog stats object
 * @returns {boolean} Whether the file was modified
 */
function updateEcosystemFragment(filePath, stats) {
  if (!fs.existsSync(filePath)) return false;

  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  // Pattern 1: Replace counts in natural language (e.g., "238 agents", "100 plays")
  content = content
    .replace(/\d+ agents/gi, `${stats.agents} agents`)
    .replace(/\d+ skills/gi, `${stats.skills} skills`)
    .replace(/\d+ instructions/gi, `${stats.instructions} instructions`)
    .replace(/\d+ hooks/gi, `${stats.hooks} hooks`)
    .replace(/\d+ plugins/gi, `${stats.plugins} plugins`)
    .replace(/\d+ workflows/gi, `${stats.workflows} workflows`)
    .replace(/\d+ solution plays/gi, `${stats.plays} solution plays`)
    .replace(/\d+ MCP tools/gi, `${stats.mcpTools} MCP tools`)
    .replace(/\d+\+ primitives/gi, `${stats.totalPrimitives}+ primitives`);

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

/**
 * Scan a directory tree for files that may contain ecosystem data.
 * @param {string} dir - Directory to scan
 * @param {string[]} extensions - File extensions to check
 * @returns {string[]} List of matching file paths
 */
function findEcosystemFiles(dir, extensions = [".md", ".txt", ".json", ".js", ".ts"]) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
      results.push(...findEcosystemFiles(full, extensions));
    } else if (entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext))) {
      // Only include files that actually reference ecosystem stats
      try {
        const content = fs.readFileSync(full, "utf8");
        if (/\d+\s*(agents|plays|primitives|MCP tools)/i.test(content)) {
          results.push(full);
        }
      } catch { /* skip unreadable files */ }
    }
  }
  return results;
}

/**
 * Build the Agent FAI knowledge JSON payload.
 * Contains everything Agent FAI needs for runtime awareness.
 * @param {object} catalog - The fai-catalog.json object
 * @returns {object}
 */
function buildKnowledge(catalog) {
  return {
    _generated: {
      tool: "FAI Factory",
      command: "npm run factory (agent-fai adapter)",
      timestamp: new Date().toISOString(),
      warning: "DO NOT EDIT MANUALLY — regenerate with: npm run factory",
    },
    version: catalog.version,
    commit: catalog.commit,
    stats: catalog.stats,
    embeddedStats: catalog.embeddedStats,
    crossRefCount: catalog.crossRefCount,
    plays: (catalog.plays || []).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      hasManifest: p.hasManifest,
      devkit: p.devkit,
    })),
    primitives: {
      agents: catalog.stats.agents,
      skills: catalog.stats.skills,
      instructions: catalog.stats.instructions,
      hooks: catalog.stats.hooks,
      plugins: catalog.stats.plugins,
      workflows: catalog.stats.workflows,
      cookbook: catalog.stats.cookbook,
      total: catalog.stats.totalPrimitives,
    },
  };
}

/**
 * Agent FAI knowledge refresh adapter entry point.
 * @param {object} catalog - The fai-catalog.json object
 * @returns {{ channel: string, updates: string[] }}
 */
function adapt(catalog) {
  const results = { channel: "agent-fai", updates: [] };

  // 1. Scan for ecosystem prompt fragments in known locations
  const scanDirs = [
    path.join(REPO_ROOT, "functions"),
    path.join(REPO_ROOT, "vscode-extension"),
  ];

  let updatedFiles = 0;
  for (const dir of scanDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = findEcosystemFiles(dir);
    for (const file of files) {
      if (updateEcosystemFragment(file, catalog.stats)) {
        const relPath = path.relative(REPO_ROOT, file);
        results.updates.push(`${relPath} — ecosystem counts updated`);
        updatedFiles++;
      }
    }
  }

  if (updatedFiles === 0) {
    results.updates.push("ecosystem fragments — no files needed updating");
  }

  // 2. Generate .factory/agent-fai-knowledge.json
  const knowledge = buildKnowledge(catalog);
  const outDir = path.join(REPO_ROOT, ".factory");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, "agent-fai-knowledge.json");
  fs.writeFileSync(outPath, JSON.stringify(knowledge, null, 2));
  const sizeKB = Math.round(fs.statSync(outPath).size / 1024);
  results.updates.push(
    `agent-fai-knowledge.json — generated (${catalog.stats.plays} plays, ${catalog.stats.totalPrimitives} primitives, ${sizeKB}KB)`
  );

  return results;
}

if (require.main === module) {
  const catalogPath = path.join(REPO_ROOT, ".factory", "fai-catalog.json");
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const r = adapt(catalog);
  console.log(`  📦 ${r.channel}:`);
  r.updates.forEach((u) => console.log(`     ✅ ${u}`));
}

module.exports = { adapt };
