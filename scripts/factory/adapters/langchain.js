#!/usr/bin/env node
// @ts-check
/**
 * FAI Factory — LangChain Adapter
 *
 * Translates fai-manifest.json → LangChain LCEL chain configuration.
 * Proves cross-framework portability: any FAI play can be loaded as a LangChain project.
 *
 * Output per play:
 *   - lc-config.json       — LangChain runnable graph definition
 *   - lc-tools.json        — LangChain tool definitions from FAI skills
 *   - lc-callbacks.json    — LangChain callback handlers from FAI hooks + guardrails
 *   - lc-prompts.json      — LangChain prompt templates from FAI instructions
 *
 * Usage:
 *   node scripts/factory/adapters/langchain.js                          # All plays
 *   node scripts/factory/adapters/langchain.js --play 01                # Single play
 *   node scripts/factory/adapters/langchain.js --output ./out/lc        # Custom output dir
 *
 * Reference:
 *   - LangChain Expression Language (LCEL): https://python.langchain.com/docs/expression_language/
 *   - LangGraph: https://langchain-ai.github.io/langgraph/
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
  return name.replace(/[^a-zA-Z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

// ─── LangChain Mapping Functions ──────────────────────────────────────────────

/**
 * Map FAI skills → LangChain Tool definitions.
 * Each skill becomes a LangChain BaseTool subclass config with:
 *   - name (snake_case)
 *   - description for LLM tool selection
 *   - args_schema (JSON Schema for input)
 *   - return_direct flag
 */
function mapSkillsToTools(manifest, playDir) {
  const tools = [];
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
      const bodyStart = content.indexOf("---", 3);
      if (bodyStart !== -1) {
        instructions = content.substring(bodyStart + 3).trim().substring(0, 2000);
      }
    }

    // Infer args_schema from instructions
    const argsSchema = inferArgsSchema(instructions);

    tools.push({
      class: "StructuredTool",
      name: slugify(name),
      description: description || `FAI Skill: ${name}`,
      args_schema: argsSchema,
      return_direct: false,
      metadata: {
        source: "fai-skill",
        originalPath: skillPath,
      },
    });
  }

  return tools;
}

/**
 * Infer JSON Schema args from skill instructions text.
 */
function inferArgsSchema(instructions) {
  const properties = {};
  const required = [];

  const patterns = [
    { pattern: /\b(query|question|prompt|input)\b/i, name: "input", type: "string", desc: "User query or prompt" },
    { pattern: /\b(document|file|content|text)\b/i, name: "content", type: "string", desc: "Document content" },
    { pattern: /\b(context|history|memory)\b/i, name: "context", type: "string", desc: "Conversation context" },
    { pattern: /\b(top_k|num_results)\b/i, name: "top_k", type: "integer", desc: "Number of results" },
    { pattern: /\b(temperature)\b/i, name: "temperature", type: "number", desc: "Sampling temperature" },
  ];

  let hasInput = false;
  for (const { pattern, name, type, desc } of patterns) {
    if (pattern.test(instructions)) {
      properties[name] = { type, description: desc };
      if (name === "input") { required.push(name); hasInput = true; }
    }
  }

  if (!hasInput) {
    properties.input = { type: "string", description: "Input for the tool" };
    required.push("input");
  }

  return {
    type: "object",
    properties,
    required,
  };
}

/**
 * Map FAI agents → LangGraph state graph nodes.
 * Builder/reviewer/tuner pattern → sequential LangGraph nodes with conditional edges.
 */
function mapAgentsToGraph(manifest, playDir) {
  const agents = manifest.primitives?.agents || [];
  const nodes = [];

  for (const agentPath of agents) {
    const absPath = path.resolve(playDir, agentPath);
    if (!fs.existsSync(absPath)) continue;

    const content = fs.readFileSync(absPath, "utf8");
    const fm = parseFrontmatter(content);
    const name = fm.name || path.basename(absPath, ".agent.md").replace(/\./g, "");

    let role = "agent";
    const nameLower = name.toLowerCase();
    const descLower = (fm.description || "").toLowerCase();
    if (nameLower.includes("builder") || descLower.includes("build")) role = "builder";
    else if (nameLower.includes("reviewer") || descLower.includes("review")) role = "reviewer";
    else if (nameLower.includes("tuner") || descLower.includes("tun")) role = "tuner";
    else if (nameLower.includes("orchestrat") || descLower.includes("orchestrat")) role = "supervisor";

    nodes.push({
      id: slugify(name),
      type: role === "supervisor" ? "supervisor" : "agent",
      role,
      name,
      description: fm.description || `Agent: ${name}`,
      model: Array.isArray(fm.model) ? fm.model[0] : fm.model || "gpt-4o",
      tools: Array.isArray(fm.tools) ? fm.tools : (fm.tools ? [fm.tools] : []),
      order: role === "supervisor" ? 0 : role === "builder" ? 1 : role === "reviewer" ? 2 : role === "tuner" ? 3 : 4,
      metadata: {
        source: "fai-agent",
        originalPath: agentPath,
        waf: fm.waf || [],
      },
    });
  }

  nodes.sort((a, b) => a.order - b.order);

  // Build edges — sequential flow with conditional routing
  const edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      source: nodes[i].id,
      target: nodes[i + 1].id,
      condition: null, // unconditional sequential
    });
  }
  // Add START → first node and last node → END
  if (nodes.length > 0) {
    edges.unshift({ source: "__start__", target: nodes[0].id, condition: null });
    edges.push({ source: nodes[nodes.length - 1].id, target: "__end__", condition: null });
  }

  return {
    type: "StateGraph",
    graphType: "langgraph",
    nodes,
    edges,
    entryPoint: nodes[0]?.id || null,
    finishPoint: nodes[nodes.length - 1]?.id || null,
  };
}

/**
 * Map FAI hooks + guardrails → LangChain callback handlers.
 */
function mapHooksToCallbacks(manifest, playDir) {
  const callbacks = [];

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

      // Map FAI events → LangChain callback methods
      const lcEvent = {
        SessionStart: "on_chain_start",
        UserPromptSubmit: "on_llm_start",
        PreToolUse: "on_tool_start",
        PostToolUse: "on_tool_end",
        PreCompact: "on_chain_end",
        SubagentStart: "on_agent_action",
        SubagentStop: "on_agent_finish",
        Stop: "on_chain_end",
      }[eventName] || "on_chain_start";

      callbacks.push({
        handler: slugify(`${path.basename(absPath)}_${eventName}`),
        event: lcEvent,
        faiEvent: eventName,
        description: hook.description || `Callback: ${eventName}`,
        metadata: {
          source: "fai-hook",
          originalPath: hookPath,
        },
      });
    }
  }

  // Map guardrails → evaluation callbacks
  const guardrails = manifest.primitives?.guardrails;
  if (guardrails) {
    for (const [metric, threshold] of Object.entries(guardrails)) {
      if (typeof threshold !== "number") continue;
      callbacks.push({
        handler: `guardrail_${metric}`,
        event: "on_llm_end",
        faiEvent: "PostToolUse",
        description: `Evaluate ${metric} ≥ ${threshold}`,
        threshold,
        metric,
        metadata: {
          source: "fai-guardrail",
          evaluator: metric === "groundedness" ? "QAEvalChain" : metric === "safety" ? "CriteriaEvalChain" : "StringEvaluator",
        },
      });
    }
  }

  return callbacks;
}

/**
 * Map FAI instructions → LangChain prompt templates.
 */
function mapInstructionsToPrompts(manifest, playDir) {
  const prompts = [];
  const instructions = manifest.primitives?.instructions || [];

  for (const instrPath of instructions) {
    const absPath = path.resolve(playDir, instrPath);
    if (!fs.existsSync(absPath)) continue;

    const content = fs.readFileSync(absPath, "utf8");
    const fm = parseFrontmatter(content);

    let body = content;
    if (content.startsWith("---")) {
      const end = content.indexOf("---", 3);
      if (end !== -1) body = content.substring(end + 3).trim();
    }

    // Detect input variables in the template text
    const inputVars = [];
    const varPattern = /\{(\w+)\}/g;
    let match;
    while ((match = varPattern.exec(body)) !== null) {
      if (!inputVars.includes(match[1])) inputVars.push(match[1]);
    }
    if (inputVars.length === 0) inputVars.push("input");

    prompts.push({
      class: "ChatPromptTemplate",
      name: slugify(path.basename(absPath, ".instructions.md").replace(/\./g, "")),
      description: fm.description || "",
      template: body.substring(0, 4000),
      input_variables: inputVars,
      template_format: "f-string",
      metadata: {
        source: "fai-instruction",
        originalPath: instrPath,
        applyTo: fm.applyTo || "**/*",
      },
    });
  }

  return prompts;
}

// ─── Main Adapter ─────────────────────────────────────────────────────────────

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

  let playDir = path.dirname(manifestPath);
  if (path.basename(playDir) === "spec") playDir = path.dirname(playDir);

  const playId = manifest.play || path.basename(playDir);

  const tools = mapSkillsToTools(manifest, playDir);
  const graph = mapAgentsToGraph(manifest, playDir);
  const callbacks = mapHooksToCallbacks(manifest, playDir);
  const prompts = mapInstructionsToPrompts(manifest, playDir);

  const lcConfig = {
    $schema: "https://frootai.dev/schemas/lc-adapter.schema.json",
    generated: new Date().toISOString(),
    source: {
      protocol: "FAI Protocol v0.1",
      play: playId,
      version: manifest.version || "1.0.0",
      manifestPath: path.relative(REPO_ROOT, manifestPath),
    },
    chain: {
      type: "RunnableSequence",
      name: `fai-${playId}`,
      model: graph.nodes?.[0]?.model || "gpt-4o",
      tools,
    },
    graph,
    callbacks,
    prompts,
    context: {
      knowledge: manifest.context?.knowledge || [],
      waf: manifest.context?.waf || [],
      scope: manifest.context?.scope || playId,
    },
  };

  return lcConfig;
}

function main() {
  const args = process.argv.slice(2);
  const playFilter = args.includes("--play") ? args[args.indexOf("--play") + 1] : null;
  const outputDir = args.includes("--output")
    ? path.resolve(args[args.indexOf("--output") + 1])
    : path.join(REPO_ROOT, ".factory", "lc-adapters");
  const jsonOutput = args.includes("--json");

  console.log("🦜 FAI Factory — LangChain Adapter");
  console.log("══════════════════════════════════════");

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

    const lcConfig = adaptPlay(manifestPath);
    if (lcConfig.error) {
      results.errors++;
      results.plays.push({ play: dir, status: "error", error: lcConfig.error });
      continue;
    }

    const playOutputDir = path.join(outputDir, dir);
    fs.mkdirSync(playOutputDir, { recursive: true });

    fs.writeFileSync(
      path.join(playOutputDir, "lc-config.json"),
      JSON.stringify(lcConfig, null, 2)
    );
    fs.writeFileSync(
      path.join(playOutputDir, "lc-tools.json"),
      JSON.stringify({ tools: lcConfig.chain.tools }, null, 2)
    );
    fs.writeFileSync(
      path.join(playOutputDir, "lc-callbacks.json"),
      JSON.stringify({ callbacks: lcConfig.callbacks }, null, 2)
    );
    fs.writeFileSync(
      path.join(playOutputDir, "lc-prompts.json"),
      JSON.stringify({ prompts: lcConfig.prompts }, null, 2)
    );

    results.adapted++;
    results.plays.push({
      play: dir,
      status: "adapted",
      tools: lcConfig.chain.tools.length,
      graphNodes: lcConfig.graph.nodes.length,
      callbacks: lcConfig.callbacks.length,
      prompts: lcConfig.prompts.length,
    });
  }

  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(`\n✅ Adapted: ${results.adapted} plays`);
    console.log(`⏭️  Skipped: ${results.skipped} (no manifest)`);
    if (results.errors > 0) console.log(`❌ Errors: ${results.errors}`);
    console.log(`📁 Output: ${outputDir}`);

    const top = results.plays
      .filter(p => p.status === "adapted")
      .sort((a, b) => (b.tools || 0) - (a.tools || 0))
      .slice(0, 5);
    if (top.length > 0) {
      console.log("\nTop plays by tool count:");
      for (const p of top) {
        console.log(`  ${p.play}: ${p.tools} tools, ${p.graphNodes} graph nodes, ${p.callbacks} callbacks`);
      }
    }
  }

  return results;
}

module.exports = { adaptPlay, main };

if (require.main === module) {
  main();
}
