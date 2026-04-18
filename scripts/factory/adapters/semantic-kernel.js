#!/usr/bin/env node
// @ts-check
/**
 * FAI Factory — Semantic Kernel Adapter
 *
 * Translates fai-manifest.json → Semantic Kernel plugin configuration.
 * Proves cross-framework portability: any FAI play can be loaded as an SK project.
 *
 * Output per play:
 *   - sk-config.json     — SK plugin registry (KernelPlugin definitions)
 *   - sk-functions.json  — SK function definitions derived from FAI skills
 *   - sk-filters.json    — SK prompt/function filters derived from hooks + guardrails
 *   - sk-planner.json    — SK planner hints derived from agent topology
 *
 * Usage:
 *   node scripts/factory/adapters/semantic-kernel.js                        # All plays
 *   node scripts/factory/adapters/semantic-kernel.js --play 01              # Single play
 *   node scripts/factory/adapters/semantic-kernel.js --output ./out/sk      # Custom output dir
 *
 * Reference:
 *   - Semantic Kernel plugin model: https://learn.microsoft.com/semantic-kernel/
 *   - FAI Protocol §3.3: Primitives mapping
 */
const fs = require("fs");
const path = require("path");

const REPO_ROOT = process.env.FROOTAI_PUBLIC_REPO || path.resolve(__dirname, "../../..");

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseFrontmatter(content) {
  if (!content || !content.startsWith("---")) return {};
  const normalized = content.replace(/\r\n/g, "\n");
  const end = normalized.indexOf("---", 3);
  if (end === -1) return {};
  const yaml = normalized.substring(3, end).trim();
  const result = {};
  for (const line of yaml.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;
    const key = trimmed.substring(0, colonIdx).trim();
    let val = trimmed.substring(colonIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (val.startsWith("[") && val.endsWith("]")) {
      val = val.slice(1, -1).split(",").map(s => s.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
    }
    result[key] = val;
  }
  return result;
}

function slugify(name) {
  return name.replace(/[^a-zA-Z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

// ─── SK Mapping Functions ─────────────────────────────────────────────────────

/**
 * Map FAI skills → SK KernelFunction definitions.
 * Each FAI skill folder becomes an SK native function with:
 *   - functionName derived from skill folder name
 *   - description from SKILL.md frontmatter
 *   - parameters inferred from SKILL.md instructions
 */
function mapSkillsToFunctions(manifest, playDir) {
  const functions = [];
  const skills = manifest.primitives?.skills || [];

  for (const skillPath of skills) {
    const absPath = path.resolve(playDir, skillPath);
    const skillMdPath = path.join(absPath, "SKILL.md");

    let name = path.basename(absPath);
    let description = "";
    let instructions = "";

    if (fs.existsSync(skillMdPath)) {
      const content = fs.readFileSync(skillMdPath, "utf8");
      const fm = parseFrontmatter(content);
      name = fm.name || name;
      description = fm.description || "";
      // Extract body after frontmatter as instructions
      const bodyStart = content.indexOf("---", 3);
      if (bodyStart !== -1) {
        instructions = content.substring(bodyStart + 3).trim().substring(0, 2000);
      }
    }

    functions.push({
      pluginName: slugify(name),
      functionName: slugify(name),
      description: description || `Skill: ${name}`,
      parameters: extractParameters(instructions),
      returnType: "string",
      isPrompt: false,
      metadata: {
        source: "fai-skill",
        originalPath: skillPath,
      },
    });
  }

  return functions;
}

/**
 * Extract parameter hints from skill instructions text.
 * Looks for common patterns: "input:", "query:", "document:", etc.
 */
function extractParameters(instructions) {
  const params = [];
  const paramPatterns = [
    { pattern: /\b(query|question|prompt)\b/i, name: "input", type: "string", desc: "User query or prompt" },
    { pattern: /\b(document|file|content)\b/i, name: "content", type: "string", desc: "Document or content to process" },
    { pattern: /\b(context|history)\b/i, name: "context", type: "string", desc: "Conversation or task context" },
    { pattern: /\b(max_tokens|token_budget)\b/i, name: "maxTokens", type: "number", desc: "Maximum tokens for response" },
    { pattern: /\b(temperature)\b/i, name: "temperature", type: "number", desc: "Sampling temperature (0-1)" },
  ];

  for (const { pattern, name, type, desc } of paramPatterns) {
    if (pattern.test(instructions)) {
      params.push({ name, type, description: desc, required: name === "input" });
    }
  }

  // Always include at least an input parameter
  if (params.length === 0) {
    params.push({ name: "input", type: "string", description: "Input for the skill", required: true });
  }

  return params;
}

/**
 * Map FAI agents → SK planner hints.
 * Agent topology (builder/reviewer/tuner) maps to SK Handlebars/Stepwise planner steps.
 */
function mapAgentsToPlanner(manifest, playDir) {
  const agents = manifest.primitives?.agents || [];
  const steps = [];

  for (const agentPath of agents) {
    const absPath = path.resolve(playDir, agentPath);
    if (!fs.existsSync(absPath)) continue;

    const content = fs.readFileSync(absPath, "utf8");
    const fm = parseFrontmatter(content);
    const name = fm.name || path.basename(absPath, ".agent.md").replace(/\./g, "");

    // Determine agent role from name or description
    let role = "executor";
    const nameLower = name.toLowerCase();
    const descLower = (fm.description || "").toLowerCase();
    if (nameLower.includes("builder") || descLower.includes("build")) role = "builder";
    else if (nameLower.includes("reviewer") || descLower.includes("review")) role = "reviewer";
    else if (nameLower.includes("tuner") || descLower.includes("tun")) role = "tuner";
    else if (nameLower.includes("architect") || descLower.includes("architect")) role = "planner";
    else if (nameLower.includes("orchestrat") || descLower.includes("orchestrat")) role = "orchestrator";

    steps.push({
      stepName: slugify(name),
      agentRole: role,
      description: fm.description || `Agent: ${name}`,
      model: Array.isArray(fm.model) ? fm.model[0] : fm.model || "gpt-4o",
      tools: Array.isArray(fm.tools) ? fm.tools : (fm.tools ? [fm.tools] : []),
      order: role === "builder" ? 1 : role === "reviewer" ? 2 : role === "tuner" ? 3 : 0,
      metadata: {
        source: "fai-agent",
        originalPath: agentPath,
        waf: fm.waf || [],
      },
    });
  }

  // Sort by order (orchestrator → builder → reviewer → tuner)
  steps.sort((a, b) => a.order - b.order);

  return {
    type: "StepwisePlanner",
    maxIterations: steps.length * 2,
    steps,
  };
}

/**
 * Map FAI hooks + guardrails → SK prompt/function filters.
 * Hooks become pre/post-invocation filters. Guardrails become evaluation filters.
 */
function mapHooksToFilters(manifest, playDir) {
  const filters = [];

  // Map hooks to SK filters
  const hooks = manifest.primitives?.hooks || [];
  for (const hookPath of hooks) {
    const absPath = path.resolve(playDir, hookPath);
    const hooksJsonPath = path.join(absPath, "hooks.json");

    if (!fs.existsSync(hooksJsonPath)) continue;

    let hookConfig;
    try {
      hookConfig = JSON.parse(fs.readFileSync(hooksJsonPath, "utf8"));
    } catch { continue; }

    const events = hookConfig.hooks || [];
    for (const hook of events) {
      const eventName = hook.event || "";
      let filterType = "FunctionInvocationFilter";

      if (eventName === "PreToolUse" || eventName === "PostToolUse") {
        filterType = "AutoFunctionInvocationFilter";
      } else if (eventName === "UserPromptSubmit") {
        filterType = "PromptRenderFilter";
      }

      filters.push({
        name: slugify(`${path.basename(absPath)}-${eventName}`),
        filterType,
        event: eventName,
        description: hook.description || `Hook: ${eventName}`,
        metadata: {
          source: "fai-hook",
          originalPath: hookPath,
          pattern: hook.pattern || "*",
        },
      });
    }
  }

  // Map guardrails to evaluation filters
  const guardrails = manifest.primitives?.guardrails;
  if (guardrails) {
    for (const [metric, threshold] of Object.entries(guardrails)) {
      if (typeof threshold !== "number") continue;
      filters.push({
        name: `guardrail-${metric}`,
        filterType: "FunctionInvocationFilter",
        event: "PostToolUse",
        description: `Evaluate ${metric} ≥ ${threshold}`,
        threshold,
        metric,
        metadata: {
          source: "fai-guardrail",
          action: threshold === 0 && metric === "safety" ? "block" : "warn",
        },
      });
    }
  }

  return filters;
}

/**
 * Map FAI instructions → SK system prompts / prompt templates.
 */
function mapInstructionsToPrompts(manifest, playDir) {
  const prompts = [];
  const instructions = manifest.primitives?.instructions || [];

  for (const instrPath of instructions) {
    const absPath = path.resolve(playDir, instrPath);
    if (!fs.existsSync(absPath)) continue;

    const content = fs.readFileSync(absPath, "utf8");
    const fm = parseFrontmatter(content);

    // Extract body after frontmatter
    let body = content;
    if (content.startsWith("---")) {
      const end = content.indexOf("---", 3);
      if (end !== -1) body = content.substring(end + 3).trim();
    }

    prompts.push({
      name: slugify(path.basename(absPath, ".instructions.md").replace(/\./g, "")),
      description: fm.description || "",
      applyTo: fm.applyTo || "**/*",
      template: body.substring(0, 4000), // SK prompt template (truncated for size)
      templateFormat: "handlebars",
      metadata: {
        source: "fai-instruction",
        originalPath: instrPath,
      },
    });
  }

  return prompts;
}

// ─── Main Adapter ─────────────────────────────────────────────────────────────

/**
 * Generate SK configuration for a single play from its fai-manifest.json.
 */
function adaptPlay(manifestPath) {
  if (!fs.existsSync(manifestPath)) {
    return { error: `Manifest not found: ${manifestPath}` };
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (err) {
    return { error: `Invalid JSON: ${err.message}` };
  }

  // Resolve play directory (manifest may be in spec/)
  let playDir = path.dirname(manifestPath);
  if (path.basename(playDir) === "spec") playDir = path.dirname(playDir);

  const playId = manifest.play || path.basename(playDir);

  // Build SK configuration
  const functions = mapSkillsToFunctions(manifest, playDir);
  const planner = mapAgentsToPlanner(manifest, playDir);
  const filters = mapHooksToFilters(manifest, playDir);
  const prompts = mapInstructionsToPrompts(manifest, playDir);

  // SK plugin registry — groups functions into plugins
  const plugins = {};
  for (const fn of functions) {
    const pluginName = fn.pluginName;
    if (!plugins[pluginName]) {
      plugins[pluginName] = {
        name: pluginName,
        description: fn.description,
        functions: [],
      };
    }
    plugins[pluginName].functions.push({
      name: fn.functionName,
      description: fn.description,
      parameters: fn.parameters,
      returnType: fn.returnType,
      isPrompt: fn.isPrompt,
    });
  }

  // SK Kernel configuration
  const skConfig = {
    $schema: "https://frootai.dev/schemas/sk-adapter.schema.json",
    generated: new Date().toISOString(),
    source: {
      protocol: "FAI Protocol v0.1",
      play: playId,
      version: manifest.version || "1.0.0",
      manifestPath: path.relative(REPO_ROOT, manifestPath),
    },
    kernel: {
      serviceId: `fai-${playId}`,
      modelId: planner.steps?.[0]?.model || "gpt-4o",
      plugins: Object.values(plugins),
    },
    planner,
    filters,
    prompts,
    context: {
      knowledge: manifest.context?.knowledge || [],
      waf: manifest.context?.waf || [],
      scope: manifest.context?.scope || playId,
    },
  };

  return skConfig;
}

/**
 * Batch-adapt all plays or a single play.
 */
function main() {
  const args = process.argv.slice(2);
  const playFilter = args.includes("--play") ? args[args.indexOf("--play") + 1] : null;
  const outputDir = args.includes("--output")
    ? path.resolve(args[args.indexOf("--output") + 1])
    : path.join(REPO_ROOT, ".factory", "sk-adapters");
  const jsonOutput = args.includes("--json");

  console.log("🔌 FAI Factory — Semantic Kernel Adapter");
  console.log("══════════════════════════════════════");

  // Find all manifests
  const playsDir = path.join(REPO_ROOT, "solution-plays");
  const playDirs = fs.readdirSync(playsDir).filter(d => {
    const full = path.join(playsDir, d);
    if (!fs.statSync(full).isDirectory()) return false;
    if (playFilter) return d.startsWith(playFilter);
    return true;
  });

  fs.mkdirSync(outputDir, { recursive: true });

  const results = { adapted: 0, skipped: 0, errors: 0, plays: [] };

  for (const dir of playDirs) {
    const manifestPath = path.join(playsDir, dir, "spec", "fai-manifest.json");
    if (!fs.existsSync(manifestPath)) {
      results.skipped++;
      continue;
    }

    const skConfig = adaptPlay(manifestPath);
    if (skConfig.error) {
      results.errors++;
      results.plays.push({ play: dir, status: "error", error: skConfig.error });
      continue;
    }

    // Write output files
    const playOutputDir = path.join(outputDir, dir);
    fs.mkdirSync(playOutputDir, { recursive: true });

    fs.writeFileSync(
      path.join(playOutputDir, "sk-config.json"),
      JSON.stringify(skConfig, null, 2)
    );

    // Write individual files for easier consumption
    fs.writeFileSync(
      path.join(playOutputDir, "sk-functions.json"),
      JSON.stringify({ functions: skConfig.kernel.plugins }, null, 2)
    );
    fs.writeFileSync(
      path.join(playOutputDir, "sk-filters.json"),
      JSON.stringify({ filters: skConfig.filters }, null, 2)
    );
    fs.writeFileSync(
      path.join(playOutputDir, "sk-planner.json"),
      JSON.stringify({ planner: skConfig.planner }, null, 2)
    );

    results.adapted++;
    results.plays.push({
      play: dir,
      status: "adapted",
      plugins: skConfig.kernel.plugins.length,
      functions: skConfig.kernel.plugins.reduce((sum, p) => sum + p.functions.length, 0),
      filters: skConfig.filters.length,
      plannerSteps: skConfig.planner.steps.length,
    });
  }

  // Summary
  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(`\n✅ Adapted: ${results.adapted} plays`);
    console.log(`⏭️  Skipped: ${results.skipped} (no manifest)`);
    if (results.errors > 0) console.log(`❌ Errors: ${results.errors}`);
    console.log(`📁 Output: ${outputDir}`);

    // Show top-3 by function count
    const top = results.plays
      .filter(p => p.status === "adapted")
      .sort((a, b) => (b.functions || 0) - (a.functions || 0))
      .slice(0, 5);
    if (top.length > 0) {
      console.log("\nTop plays by SK function count:");
      for (const p of top) {
        console.log(`  ${p.play}: ${p.plugins} plugins, ${p.functions} functions, ${p.filters} filters`);
      }
    }
  }

  return results;
}

// Export for programmatic use
module.exports = { adaptPlay, main };

if (require.main === module) {
  main();
}
