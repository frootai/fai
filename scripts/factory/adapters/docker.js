#!/usr/bin/env node
// @ts-check
/**
 * FAI Factory — Docker Adapter
 * Updates Docker channel from fai-catalog.json:
 *   1. Updates Dockerfile labels (version, description, title)
 *   2. Updates docker-compose.yml labels (if exists)
 *
 * Usage: node scripts/factory/adapters/docker.js
 */
const fs = require("fs");
const path = require("path");

const REPO_ROOT = process.env.FROOTAI_PUBLIC_REPO || path.resolve(__dirname, "../../..");

/**
 * Update OCI labels in a Dockerfile.
 * Replaces org.opencontainers.image.version, .description, .title labels.
 * @param {string} dockerfilePath - Absolute path to the Dockerfile
 * @param {object} catalog - The fai-catalog.json object
 * @returns {string[]} List of changes made
 */
function updateDockerfileLabels(dockerfilePath, catalog) {
  if (!fs.existsSync(dockerfilePath)) return [];

  let content = fs.readFileSync(dockerfilePath, "utf8");
  const original = content;
  const changes = [];
  const s = catalog.stats;

  // Update version label
  const versionRe = /(LABEL\s+org\.opencontainers\.image\.version=)"[^"]*"/;
  if (versionRe.test(content)) {
    content = content.replace(versionRe, `$1"${catalog.version}"`);
  }

  // Update description label
  const descRe = /(LABEL\s+org\.opencontainers\.image\.description=)"[^"]*"/;
  if (descRe.test(content)) {
    const desc = `FrootAI FAI Engine MCP Server — ${s.mcpTools} tools, ${s.plays} plays, ${s.totalPrimitives}+ primitives, stdio + HTTP`;
    content = content.replace(descRe, `$1"${desc}"`);
  }

  // Update title label
  const titleRe = /(LABEL\s+org\.opencontainers\.image\.title=)"[^"]*"/;
  if (titleRe.test(content)) {
    content = content.replace(titleRe, `$1"frootai-mcp"`);
  }

  // Update FROOTAI_VERSION env if present
  const envVersionRe = /(ENV\s+FROOTAI_VERSION=)\S+/;
  if (envVersionRe.test(content)) {
    content = content.replace(envVersionRe, `$1${catalog.version}`);
  }

  if (content !== original) {
    fs.writeFileSync(dockerfilePath, content);
    changes.push(`Dockerfile — labels updated (v${catalog.version}, ${s.mcpTools} tools, ${s.plays} plays)`);
  } else {
    changes.push("Dockerfile — labels unchanged");
  }

  return changes;
}

/**
 * Update OCI labels in a docker-compose.yml file.
 * Updates version and description labels within the labels section.
 * @param {string} composePath - Absolute path to docker-compose.yml
 * @param {object} catalog - The fai-catalog.json object
 * @returns {string[]} List of changes made
 */
function updateComposeLabels(composePath, catalog) {
  if (!fs.existsSync(composePath)) return [];

  let content = fs.readFileSync(composePath, "utf8");
  const original = content;
  const s = catalog.stats;

  // Update version in compose labels (YAML format: org.opencontainers.image.version: "X.Y.Z")
  content = content.replace(
    /(org\.opencontainers\.image\.version:\s*)"[^"]*"/g,
    `$1"${catalog.version}"`
  );
  content = content.replace(
    /(org\.opencontainers\.image\.version:\s*)['"][^'"]*['"]/g,
    `$1"${catalog.version}"`
  );

  // Update description in compose labels
  const desc = `FrootAI FAI Engine MCP Server — ${s.mcpTools} tools, ${s.plays} plays, ${s.totalPrimitives}+ primitives`;
  content = content.replace(
    /(org\.opencontainers\.image\.description:\s*)"[^"]*"/g,
    `$1"${desc}"`
  );

  if (content !== original) {
    fs.writeFileSync(composePath, content);
    return [`docker-compose.yml — labels updated (v${catalog.version})`];
  }

  return ["docker-compose.yml — labels unchanged"];
}

/**
 * Docker channel adapter entry point.
 * @param {object} catalog - The fai-catalog.json object
 * @returns {{ channel: string, updates: string[] }}
 */
function adapt(catalog) {
  const results = { channel: "docker", updates: [] };

  // 1. Update npm-mcp/Dockerfile (primary Docker channel)
  const dockerfilePath = path.join(REPO_ROOT, "npm-mcp", "Dockerfile");
  results.updates.push(...updateDockerfileLabels(dockerfilePath, catalog));

  // 2. Update root Dockerfile if it exists
  const rootDockerfile = path.join(REPO_ROOT, "Dockerfile");
  if (fs.existsSync(rootDockerfile)) {
    results.updates.push(...updateDockerfileLabels(rootDockerfile, catalog));
  }

  // 3. Update docker-compose.yml if it exists
  const composePaths = [
    path.join(REPO_ROOT, "docker-compose.yml"),
    path.join(REPO_ROOT, "docker-compose.yaml"),
    path.join(REPO_ROOT, "npm-mcp", "docker-compose.yml"),
    path.join(REPO_ROOT, "npm-mcp", "docker-compose.yaml"),
  ];
  for (const composePath of composePaths) {
    if (fs.existsSync(composePath)) {
      results.updates.push(...updateComposeLabels(composePath, catalog));
    }
  }

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
