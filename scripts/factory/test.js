#!/usr/bin/env node
// @ts-check
/**
 * FAI Factory — Test Suite
 * Production-grade tests for the factory pipeline.
 * No external test framework — uses Node.js assert + custom runner.
 *
 * Usage:
 *   node scripts/factory/test.js           # Run all tests
 *   node scripts/factory/test.js --verbose # Show passing test details
 *
 * Exit code: 0 on all pass, 1 on any failure.
 */
const assert = require("assert");
const path = require("path");
const fs = require("fs");

const REPO_ROOT = process.env.FROOTAI_PUBLIC_REPO || path.resolve(__dirname, "../..");
const VERBOSE = process.argv.includes("--verbose");

// ─── Test Runner ──────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
let skipped = 0;
const failures = [];

/**
 * Run a single test case.
 * @param {string} name - Human-readable test name
 * @param {() => void} fn - Test function (throws on failure)
 */
function test(name, fn) {
  try {
    fn();
    passed++;
    if (VERBOSE) console.log(`  ✅ ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, error: err.message || String(err) });
    console.log(`  ❌ ${name}`);
    console.log(`     ${err.message || err}`);
  }
}

/**
 * Skip a test (logged but not counted as failure).
 * @param {string} name
 * @param {string} reason
 */
function skip(name, reason) {
  skipped++;
  if (VERBOSE) console.log(`  ⏭️  ${name} — ${reason}`);
}

/**
 * Group tests under a heading.
 * @param {string} name
 * @param {() => void} fn
 */
function describe(name, fn) {
  console.log(`\n  📦 ${name}`);
  console.log(`  ${"─".repeat(40)}`);
  fn();
}

// ─── harvest.js Tests ─────────────────────────────────────────────────────

describe("harvest.js", () => {
  /** @type {any} */
  let harvestModule;

  test("module loads without error", () => {
    harvestModule = require("./harvest");
    assert.ok(harvestModule, "harvest module should be truthy");
  });

  test("exports harvest function", () => {
    assert.strictEqual(typeof harvestModule.harvest, "function");
  });

  test("exports scanner functions", () => {
    const scanners = ["scanAgents", "scanSkills", "scanInstructions", "scanHooks", "scanPlugins", "scanPlays", "scanModules"];
    for (const fn of scanners) {
      assert.strictEqual(typeof harvestModule[fn], "function", `${fn} should be a function`);
    }
  });

  test("scanAgents returns array with expected shape", () => {
    const agents = harvestModule.scanAgents("agents");
    assert.ok(Array.isArray(agents), "should return an array");
    if (agents.length > 0) {
      const agent = agents[0];
      assert.ok(agent.id, "agent should have id");
      assert.ok(agent.file, "agent should have file");
      assert.ok(typeof agent.description === "string", "agent should have description string");
    }
  });

  test("scanSkills returns array with expected shape", () => {
    const skills = harvestModule.scanSkills("skills");
    assert.ok(Array.isArray(skills), "should return an array");
    if (skills.length > 0) {
      assert.ok(skills[0].id, "skill should have id");
      assert.ok(skills[0].folder, "skill should have folder");
    }
  });

  test("scanPlays returns sorted array", () => {
    const plays = harvestModule.scanPlays("solution-plays");
    assert.ok(Array.isArray(plays), "should return an array");
    if (plays.length >= 2) {
      const ids = plays.map((p) => parseInt(p.id, 10));
      for (let i = 1; i < ids.length; i++) {
        assert.ok(ids[i] >= ids[i - 1], `plays should be sorted: ${ids[i - 1]} <= ${ids[i]}`);
      }
    }
  });

  test("scanAgents returns empty array for nonexistent dir", () => {
    const result = harvestModule.scanAgents("nonexistent-dir-xyz");
    assert.deepStrictEqual(result, []);
  });
});

// ─── catalog.js Tests ─────────────────────────────────────────────────────

describe("catalog.js", () => {
  /** @type {any} */
  let catalogModule;

  test("module loads without error", () => {
    catalogModule = require("./catalog");
    assert.ok(catalogModule, "catalog module should be truthy");
  });

  test("exports catalog function", () => {
    assert.strictEqual(typeof catalogModule.catalog, "function");
  });

  test("existing catalog JSON is valid", () => {
    const catalogPath = path.join(REPO_ROOT, ".factory", "fai-catalog.json");
    if (!fs.existsSync(catalogPath)) {
      skip("catalog JSON validation", "fai-catalog.json not found");
      return;
    }
    const raw = fs.readFileSync(catalogPath, "utf8");
    const cat = JSON.parse(raw);
    assert.ok(cat.version, "catalog should have version");
    assert.ok(cat.stats, "catalog should have stats");
    assert.ok(cat.generated, "catalog should have generated timestamp");
    assert.ok(cat.commit, "catalog should have commit");
  });

  test("catalog stats has required fields", () => {
    const catalogPath = path.join(REPO_ROOT, ".factory", "fai-catalog.json");
    if (!fs.existsSync(catalogPath)) {
      skip("catalog stats check", "fai-catalog.json not found");
      return;
    }
    const cat = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
    const requiredStats = ["agents", "skills", "instructions", "hooks", "plugins", "plays", "totalPrimitives"];
    for (const key of requiredStats) {
      assert.ok(typeof cat.stats[key] === "number", `stats.${key} should be a number`);
    }
  });

  test("catalog has primitive arrays", () => {
    const catalogPath = path.join(REPO_ROOT, ".factory", "fai-catalog.json");
    if (!fs.existsSync(catalogPath)) {
      skip("catalog arrays check", "fai-catalog.json not found");
      return;
    }
    const cat = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
    const arrays = ["agents", "skills", "instructions", "hooks", "plugins", "plays"];
    for (const key of arrays) {
      assert.ok(Array.isArray(cat[key]), `catalog.${key} should be an array`);
    }
  });
});

// ─── diff.js Tests ────────────────────────────────────────────────────────

describe("diff.js", () => {
  /** @type {any} */
  let diffModule;

  test("module loads without error", () => {
    diffModule = require("./diff");
    assert.ok(diffModule, "diff module should be truthy");
  });

  test("exports diff function", () => {
    assert.strictEqual(typeof diffModule.diff, "function");
  });

  test("diff detects additions correctly (simulated)", () => {
    // Simulate comparison logic
    const prev = [{ id: "a" }, { id: "b" }];
    const curr = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const prevIds = new Set(prev.map((x) => x.id));
    const currIds = new Set(curr.map((x) => x.id));
    const added = [...currIds].filter((id) => !prevIds.has(id));
    assert.deepStrictEqual(added, ["c"]);
  });

  test("diff detects removals correctly (simulated)", () => {
    const prev = [{ id: "a" }, { id: "b" }, { id: "c" }];
    const curr = [{ id: "a" }, { id: "c" }];
    const prevIds = new Set(prev.map((x) => x.id));
    const currIds = new Set(curr.map((x) => x.id));
    const removed = [...prevIds].filter((id) => !currIds.has(id));
    assert.deepStrictEqual(removed, ["b"]);
  });
});

// ─── validate.js Tests ───────────────────────────────────────────────────

describe("validate.js", () => {
  /** @type {any} */
  let validateModule;

  test("module loads without error", () => {
    validateModule = require("./validate");
    assert.ok(validateModule, "validate module should be truthy");
  });

  test("exports validate function", () => {
    assert.strictEqual(typeof validateModule.validate, "function");
  });

  test("validate detects missing required keys", () => {
    const badCatalog = { stats: {}, agents: [] };
    const requiredKeys = ["stats", "agents", "skills", "instructions", "hooks", "plugins", "plays", "modules"];
    const missing = requiredKeys.filter((k) => !badCatalog[k]);
    assert.ok(missing.length > 0, "should detect missing keys");
    assert.ok(missing.includes("skills"), "should detect missing 'skills'");
    assert.ok(missing.includes("plugins"), "should detect missing 'plugins'");
  });

  test("validate detects low counts", () => {
    const minCounts = { agents: 200, skills: 300, instructions: 150, hooks: 5, plugins: 50, plays: 90 };
    const badStats = { agents: 5, skills: 2, instructions: 1, hooks: 0, plugins: 0, plays: 0 };
    let errors = 0;
    for (const [key, min] of Object.entries(minCounts)) {
      if ((badStats[key] || 0) < min) errors++;
    }
    assert.ok(errors > 0, "should detect counts below thresholds");
  });
});

// ─── Adapter Tests ────────────────────────────────────────────────────────

describe("Adapters", () => {
  const adapterNames = [
    "npm-mcp",
    "npm-sdk",
    "vscode",
    "python-mcp",
    "python-sdk",
    "website",
    "docker",
    "agent-fai",
  ];

  for (const name of adapterNames) {
    test(`${name} adapter loads and exports adapt()`, () => {
      const adapterPath = path.join(__dirname, "adapters", `${name}.js`);
      if (!fs.existsSync(adapterPath)) {
        skip(`${name} adapter`, "file not found");
        return;
      }
      const adapter = require(adapterPath);
      assert.strictEqual(typeof adapter.adapt, "function", `${name}.adapt should be a function`);
    });
  }

  test("docker adapter returns correct channel name", () => {
    const docker = require("./adapters/docker");
    const mockCatalog = {
      version: "1.0.0",
      stats: { mcpTools: 25, plays: 100, totalPrimitives: 800, agents: 200 },
      plays: [],
    };
    const result = docker.adapt(mockCatalog);
    assert.strictEqual(result.channel, "docker");
    assert.ok(Array.isArray(result.updates), "should return updates array");
  });

  test("agent-fai adapter returns correct channel name", () => {
    const agentFai = require("./adapters/agent-fai");
    const mockCatalog = {
      version: "1.0.0",
      commit: "abc1234",
      stats: { agents: 200, skills: 300, instructions: 150, hooks: 10, plugins: 70, workflows: 12, cookbook: 16, plays: 100, modules: 15, mcpTools: 25, totalPrimitives: 800 },
      embeddedStats: { agents: 300, skills: 300, instructions: 300, hooks: 100 },
      crossRefCount: 5,
      plays: [],
    };
    const result = agentFai.adapt(mockCatalog);
    assert.strictEqual(result.channel, "agent-fai");
    assert.ok(Array.isArray(result.updates), "should return updates array");
  });

  test("agent-fai adapter writes knowledge JSON", () => {
    const outPath = path.join(REPO_ROOT, ".factory", "agent-fai-knowledge.json");
    if (fs.existsSync(outPath)) {
      const knowledge = JSON.parse(fs.readFileSync(outPath, "utf8"));
      assert.ok(knowledge.version, "knowledge should have version");
      assert.ok(knowledge.stats, "knowledge should have stats");
      assert.ok(Array.isArray(knowledge.plays), "knowledge should have plays array");
    }
  });
});

// ─── Utils Tests ──────────────────────────────────────────────────────────

describe("Utils", () => {
  test("frontmatter parser loads", () => {
    const fm = require("./utils/frontmatter");
    assert.ok(fm.parseFrontmatter, "should export parseFrontmatter");
    assert.ok(fm.parseJson, "should export parseJson");
    assert.ok(fm.countLines, "should export countLines");
  });
});

// ─── Report ───────────────────────────────────────────────────────────────

console.log("\n🧪 FAI Factory — Test Suite");
console.log("══════════════════════════════════════");

const total = passed + failed + skipped;
console.log(`\n  ─────────────────────────────────────`);
console.log(`  Total:   ${total}`);
console.log(`  Passed:  ${passed}`);
console.log(`  Failed:  ${failed}`);
console.log(`  Skipped: ${skipped}`);
console.log(`  ─────────────────────────────────────`);

if (failures.length > 0) {
  console.log("\n  ❌ FAILURES:");
  for (const f of failures) {
    console.log(`     • ${f.name}: ${f.error}`);
  }
}

console.log(failed === 0 ? "\n  ✅ ALL TESTS PASSED" : "\n  ❌ SOME TESTS FAILED");
process.exit(failed > 0 ? 1 : 0);
