#!/usr/bin/env node
/**
 * FrootAI Release Manager — Unified versioning + publishing
 * 
 * TAGGING STRATEGY:
 * ─────────────────────────────────────────────────────────────
 * Each distribution channel has its OWN version and tag prefix:
 * 
 *   Channel        │ Tag Prefix  │ Version File                         │ Example Tag
 *   ───────────────┼─────────────┼──────────────────────────────────────┼─────────────
 *   npm (MCP)      │ mcp-v       │ npm-mcp/package.json              │ mcp-v5.0.2
 *   VS Code        │ ext-v       │ vscode-extension/package.json        │ ext-v5.0.2
 *   PyPI SDK       │ sdk-v       │ python-sdk/pyproject.toml            │ sdk-v5.0.2
 *   PyPI MCP       │ pymcp-v     │ python-mcp/pyproject.toml            │ pymcp-v5.0.2
 *   Docker         │ mcp-v       │ (same as npm — Docker = MCP image)   │ mcp-v5.0.2
 *   ALL at once    │ rel-v       │ bumps ALL channels                   │ rel-v2025.04.09
 * 
 * USAGE:
 *   node scripts/release-channel.js mcp patch     →  mcp-v5.0.2
 *   node scripts/release-channel.js ext minor     →  ext-v5.1.0
 *   node scripts/release-channel.js sdk patch     →  sdk-v5.0.2
 *   node scripts/release-channel.js pymcp patch   →  pymcp-v5.0.2
 *   node scripts/release-channel.js all patch     →  bumps ALL + rel-v tag
 *   node scripts/release-channel.js --dry-run mcp patch  →  preview only
 * 
 * After running, it will:
 *   1. Bump the version in the correct file
 *   2. Update functions/server.js refs (for consistency checker)
 *   3. Run validate-consistency.js
 *   4. git add + commit + tag + push (unless --dry-run)
 *
 * AUTO-BUMP (how big companies do it):
 *   If no bump type is specified, the script reads commit messages since the
 *   last tag for the channel and determines the bump automatically:
 *     - "feat:" or "feat(scope):" → MINOR (new feature)
 *     - "fix:", "perf:", "refactor:" → PATCH (bug fix / improvement)
 *     - "BREAKING CHANGE" in body or "!" after type → MAJOR
 *     - "docs:", "style:", "test:", "ci:", "chore:" → PATCH (maintenance)
 *   If no commits found since last tag → exits with "nothing to release"
 *
 *   node scripts/release-channel.js mcp          →  auto-detect bump
 *   node scripts/release-channel.js mcp auto     →  same (explicit)
 *   node scripts/release-channel.js mcp patch    →  force patch
 */

const fs = require("fs");
const { execSync } = require("child_process");

// ── Auto-bump detection from conventional commits ──
function detectBumpType(tagPrefix) {
  let lastTag;
  try {
    lastTag = execSync(
      `git tag --list "${tagPrefix}*" --sort=-version:refname`,
      { encoding: "utf8", stdio: "pipe" }
    ).trim().split("\n")[0];
  } catch { lastTag = ""; }

  const range = lastTag ? `${lastTag}..HEAD` : "HEAD~50..HEAD";
  let commits;
  try {
    commits = execSync(
      `git log ${range} --pretty=format:"%s%n%b" --no-merges`,
      { encoding: "utf8", stdio: "pipe" }
    ).trim();
  } catch { commits = ""; }

  if (!commits) {
    return { bump: null, reason: "No commits since last tag", commits: 0 };
  }

  const lines = commits.split("\n").filter(Boolean);
  const subjects = commits.split("\n").filter((_, i) => i % 2 === 0);

  // Check for breaking changes
  const hasBreaking = lines.some(l =>
    l.includes("BREAKING CHANGE") ||
    /^(feat|fix|refactor|perf)(\(.+\))?!:/.test(l)
  );
  if (hasBreaking) {
    return { bump: "major", reason: "BREAKING CHANGE detected", commits: subjects.length };
  }

  // Check for features
  const hasFeats = subjects.some(s => /^feat(\(.+\))?:/.test(s));
  if (hasFeats) {
    return { bump: "minor", reason: "feat: commits detected", commits: subjects.length };
  }

  // Everything else is patch
  return { bump: "patch", reason: "fix/chore/docs commits only", commits: subjects.length };
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const filteredArgs = args.filter(a => a !== "--dry-run");
const channel = filteredArgs[0];
let bumpType = filteredArgs[1] || "auto";

if (!channel || !["mcp", "cli", "ext", "sdk", "pymcp", "all"].includes(channel)) {
    console.log(`
FrootAI Release Manager
═══════════════════════

Usage: node scripts/release-channel.js [--dry-run] <channel> [bump]

Channels:
  mcp     npm MCP Server + Docker        (tag: mcp-vX.Y.Z)
  cli     npm CLI & SDK (frootai)        (tag: cli-vX.Y.Z)
  ext     VS Code Extension              (tag: ext-vX.Y.Z)
  sdk     Python SDK (PyPI)              (tag: sdk-vX.Y.Z)
  pymcp   Python MCP (PyPI)             (tag: pymcp-vX.Y.Z)
  all     ALL channels at once           (tag: rel-vYYYY.MM.DD)

Bump types:
  auto    Detect from commit messages (default — recommended)
  patch   Bug fixes (5.0.1 → 5.0.2)
  minor   New features (5.0.2 → 5.1.0)
  major   Breaking changes (5.1.0 → 6.0.0)

Auto-detection rules (from conventional commits):
  feat:              → MINOR
  fix: / perf:       → PATCH
  BREAKING CHANGE    → MAJOR
  docs: / chore:     → PATCH

Examples:
  node scripts/release-channel.js mcp              # auto-detect bump
  node scripts/release-channel.js ext minor         # force minor
  node scripts/release-channel.js all               # auto-detect all
  node scripts/release-channel.js --dry-run all     # preview
`);
    process.exit(0);
}

// ── Version helpers ──
function bumpVersion(version, type) {
    const [major, minor, patch] = version.split(".").map(Number);
    switch (type) {
        case "major": return `${major + 1}.0.0`;
        case "minor": return `${major}.${minor + 1}.0`;
        case "patch": return `${major}.${minor}.${patch + 1}`;
        default: throw new Error(`Unknown bump type: ${type}`);
    }
}

function readJsonVersion(file) {
    return JSON.parse(fs.readFileSync(file, "utf8")).version;
}

function writeJsonVersion(file, version) {
    const content = fs.readFileSync(file, "utf8");
    const updated = content.replace(/"version":\s*"[^"]*"/, `"version": "${version}"`);
    fs.writeFileSync(file, updated);
}

function readTomlVersion(file) {
    const content = fs.readFileSync(file, "utf8");
    const match = content.match(/^version\s*=\s*"([^"]+)"/m);
    return match ? match[1] : "0.0.0";
}

function writeTomlVersion(file, version) {
    const content = fs.readFileSync(file, "utf8");
    fs.writeFileSync(file, content.replace(/^version\s*=\s*"[^"]+"/m, `version = "${version}"`));
}

function run(cmd) {
    if (dryRun) { console.log(`  [DRY RUN] ${cmd}`); return ""; }
    return execSync(cmd, { encoding: "utf8", stdio: "pipe" }).trim();
}

// ── Channel definitions ──
const channels = {
    mcp: {
        name: "npm MCP Server + Docker",
        file: "npm-mcp/package.json",
        read: () => readJsonVersion("npm-mcp/package.json"),
        write: (v) => writeJsonVersion("npm-mcp/package.json", v),
        tagPrefix: "mcp-v",
        serverRef: "FROOTAI_MCP_VERSION",
        serverFormat: (v) => `"@${v}"`,
    },
    cli: {
        name: "npm CLI & SDK (frootai)",
        file: "npm-sdk/package.json",
        read: () => readJsonVersion("npm-sdk/package.json"),
        write: (v) => {
            writeJsonVersion("npm-sdk/package.json", v);
            // Keep frootai-mcp dependency in sync
            const content = fs.readFileSync("npm-sdk/package.json", "utf8");
            const updated = content.replace(/"frootai-mcp":\s*"\^[^"]*"/, `"frootai-mcp": "^${v}"`);
            fs.writeFileSync("npm-sdk/package.json", updated);
        },
        tagPrefix: "cli-v",
        serverRef: "FROOTAI_CLI_VERSION",
        serverFormat: (v) => `"@${v}"`,
    },
    ext: {
        name: "VS Code Extension",
        file: "vscode-extension/package.json",
        read: () => readJsonVersion("vscode-extension/package.json"),
        write: (v) => writeJsonVersion("vscode-extension/package.json", v),
        tagPrefix: "ext-v",
        serverRef: "FROOTAI_EXT_VERSION",
        serverFormat: (v) => `"v${v}"`,
    },
    sdk: {
        name: "Python SDK (PyPI)",
        file: "python-sdk/pyproject.toml",
        read: () => readTomlVersion("python-sdk/pyproject.toml"),
        write: (v) => writeTomlVersion("python-sdk/pyproject.toml", v),
        tagPrefix: "sdk-v",
    },
    pymcp: {
        name: "Python MCP (PyPI)",
        file: "python-mcp/pyproject.toml",
        read: () => readTomlVersion("python-mcp/pyproject.toml"),
        write: (v) => writeTomlVersion("python-mcp/pyproject.toml", v),
        tagPrefix: "pymcp-v",
    },
};

// ── Execute ──
console.log(`\n🚀 FrootAI Release Manager\n`);

const targets = channel === "all" ? Object.keys(channels) : [channel];

// ── Auto-detect bump type if "auto" ──
if (bumpType === "auto") {
  // For "all" channel, use the highest bump detected across all channels
  const detections = targets.map(ch => {
    const det = detectBumpType(channels[ch].tagPrefix);
    return { ch, ...det };
  });

  const hasAny = detections.some(d => d.bump !== null);
  if (!hasAny) {
    console.log("  ℹ️  No commits found since last tags. Nothing to release.");
    process.exit(0);
  }

  // Highest bump wins: major > minor > patch
  const priority = { major: 3, minor: 2, patch: 1 };
  const highest = detections
    .filter(d => d.bump)
    .reduce((max, d) => priority[d.bump] > priority[max.bump] ? d : max);

  bumpType = highest.bump;

  console.log("  📊 Auto-detected bump type from conventional commits:\n");
  for (const d of detections) {
    const icon = d.bump === "major" ? "🔴" : d.bump === "minor" ? "🟡" : "🟢";
    console.log(`     ${icon} ${channels[d.ch].name.padEnd(25)} → ${(d.bump || "none").padEnd(6)} (${d.commits} commits: ${d.reason})`);
  }
  console.log(`\n  🎯 Using: ${bumpType.toUpperCase()}\n`);
}

if (!["patch", "minor", "major"].includes(bumpType)) {
  console.error(`  ❌ Unknown bump type: ${bumpType}. Options: auto, patch, minor, major`);
  process.exit(1);
}

const bumps = {};

for (const ch of targets) {
    const c = channels[ch];
    const current = c.read();
    const next = bumpVersion(current, bumpType);
    bumps[ch] = { current, next, tag: `${c.tagPrefix}${next}` };
    console.log(`  ${c.name.padEnd(25)} ${current} → ${next}  (tag: ${c.tagPrefix}${next})`);
}

console.log("");

// Bump versions
for (const ch of targets) {
    const c = channels[ch];
    const { next } = bumps[ch];
    if (!dryRun) c.write(next);
    console.log(`  ✅ ${c.file} → ${next}`);
}

// Update server.js refs
if (!dryRun) {
    let serverContent = fs.readFileSync("functions/server.js", "utf8");
    for (const ch of targets) {
        const c = channels[ch];
        if (c.serverRef) {
            const { next } = bumps[ch];
            const pattern = new RegExp(`const ${c.serverRef}\\s*=\\s*"[^"]*"`);
            serverContent = serverContent.replace(pattern, `const ${c.serverRef} = ${c.serverFormat(next)}`);
            console.log(`  ✅ functions/server.js ${c.serverRef} → ${c.serverFormat(next)}`);
        }
    }
    fs.writeFileSync("functions/server.js", serverContent);
}

// Validate
console.log("\n📋 Running consistency check...");
try {
    const result = run("node scripts/validate-consistency.js");
    if (result.includes("ERRORS")) {
        console.error("  ❌ Consistency check FAILED. Fix errors before releasing.");
        process.exit(1);
    }
    console.log("  ✅ All checks passed");
} catch (e) {
    if (!dryRun) {
        console.error("  ❌ Consistency check FAILED:", e.message);
        process.exit(1);
    }
    console.log("  [DRY RUN] Skipped validation");
}

// Git operations
console.log("\n📦 Git operations...");
const tags = targets.map(ch => bumps[ch].tag);
const tagStr = tags.join(", ");
const desc = targets.map(ch => `${channels[ch].name}: ${bumps[ch].current} → ${bumps[ch].next}`).join("; ");

run(`git add -A`);
run(`git commit -m "release: ${tagStr} — ${bumpType} bump\n\n${desc}"`);

for (const tag of tags) {
    run(`git tag ${tag} -m "${tag}"`);
}

if (channel === "all") {
    const dateTag = `rel-v${new Date().toISOString().slice(0, 10).replace(/-/g, ".")}`;
    run(`git tag ${dateTag} -m "${dateTag} — unified release: ${tagStr}"`);
    tags.push(dateTag);
}

run(`git push origin main --tags`);

console.log(`\n✅ Released: ${tags.join(", ")}`);
console.log(`\n📋 Summary:`);
for (const ch of targets) {
    console.log(`  ${channels[ch].name.padEnd(25)} ${bumps[ch].next}  →  ${bumps[ch].tag}`);
}
if (channel === "all") console.log(`  ${"Unified release".padEnd(25)} →  rel-v${new Date().toISOString().slice(0, 10).replace(/-/g, ".")}`);
console.log("");
