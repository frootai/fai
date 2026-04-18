#!/usr/bin/env node
// @ts-check
/**
 * FAI Factory — Golden Queries (BM25 Search Quality Regression)
 * Validates search quality by running 20 curated queries against the
 * BM25 search index and checking expected results appear in the top 5.
 *
 * Pass threshold: ≥90% of queries must pass.
 *
 * Usage:
 *   node scripts/factory/golden-queries.js
 *   node scripts/factory/golden-queries.js --verbose
 *
 * Exit code: 0 if ≥90% pass, 1 otherwise.
 */
const fs = require("fs");
const path = require("path");

const REPO_ROOT = process.env.FROOTAI_PUBLIC_REPO || path.resolve(__dirname, "../..");
const VERBOSE = process.argv.includes("--verbose");

// ─── BM25 Engine (self-contained, mirrors npm-mcp/index.js) ──────────────

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of",
  "with", "by", "from", "up", "out", "as", "is", "was", "are", "were", "be",
  "been", "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "need", "that", "this",
  "these", "those", "it", "its", "not", "also", "but", "if", "then", "when",
  "where", "who", "which", "how", "what", "all", "both", "each", "few", "more",
  "most", "other", "some", "such", "than", "too", "very", "just", "about",
  "above", "after", "before", "between", "into", "through", "during",
  "including", "until", "against", "among", "throughout", "within", "without",
  "over", "under", "again", "so", "yet", "only", "even", "back", "still",
]);

/**
 * Tokenize a query string for BM25 scoring.
 * @param {string} text
 * @returns {string[]}
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOP_WORDS.has(t));
}

/**
 * Score a document against query tokens using BM25.
 * @param {string[]} queryTokens
 * @param {object} doc - Document from search index
 * @param {object} index - The BM25 index
 * @returns {number}
 */
function bm25Score(queryTokens, doc, index) {
  const { idf, params } = index;
  const { k1, b, avgDocLen } = params;
  let score = 0;
  const docLen = doc.len;
  for (const term of queryTokens) {
    if (!idf[term] || !doc.tf[term]) continue;
    const tf = doc.tf[term];
    const tfScore = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (docLen / avgDocLen)));
    score += idf[term] * tfScore;
  }
  return score;
}

/**
 * Search the BM25 index for a query, return top-N results.
 * When filterType is set, only docs matching that type are searched.
 * @param {string} query
 * @param {object} index
 * @param {number} topN
 * @param {string} [filterType] - Optional: "play", "module", "term" etc.
 * @returns {{ id: string, title: string, score: number, type: string }[]}
 */
function search(query, index, topN = 5, filterType = null) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const docs = filterType
    ? index.docs.filter((d) => d.meta?.type === filterType)
    : index.docs;

  return docs
    .map((doc) => ({
      id: doc.meta?.id || doc.id,
      title: doc.title,
      score: bm25Score(queryTokens, doc, index),
      type: doc.meta?.type || "unknown",
    }))
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

// ─── Golden Queries ───────────────────────────────────────────────────────
// Each entry: { query, expectedIds: [top-3 expected IDs in any order] }
// A query passes if ALL expected IDs appear somewhere in the top 5 results.

const GOLDEN_QUERIES = [
  {
    query: "enterprise RAG chatbot with Azure AI Search",
    expectedIds: ["play:01"],
    description: "Core RAG play should rank #1",
  },
  {
    query: "AI landing zone hub spoke network",
    expectedIds: ["play:02"],
    description: "Landing zone play",
  },
  {
    query: "deterministic agent zero temperature structured output",
    expectedIds: ["play:03"],
    description: "Deterministic AI play",
  },
  {
    query: "call center voice AI speech to text",
    expectedIds: ["play:04"],
    description: "Voice AI play",
  },
  {
    query: "IT ticket classification ServiceNow",
    expectedIds: ["play:05"],
    description: "IT ticket resolution play",
  },
  {
    query: "document intelligence OCR extraction",
    expectedIds: ["play:06"],
    description: "Document Intelligence play",
  },
  {
    query: "multi-agent AutoGen group chat orchestration",
    expectedIds: ["play:07"],
    description: "Multi-agent play",
  },
  {
    query: "fine-tuning LoRA custom model training",
    expectedIds: ["play:13"],
    description: "Fine-tuning play",
  },
  {
    query: "cost optimized AI gateway APIM routing",
    expectedIds: ["play:14"],
    description: "Cost optimization gateway play",
  },
  {
    query: "prompt engineering optimization DSPy",
    expectedIds: ["play:18"],
    description: "Prompt optimization play",
  },
  {
    query: "edge AI IoT ONNX deployment",
    expectedIds: ["play:19"],
    description: "Edge AI play",
  },
  {
    query: "real-time analytics streaming Event Hub",
    expectedIds: ["play:20"],
    description: "Real-time analytics play",
  },
  {
    query: "agentic RAG tool calling retrieval",
    expectedIds: ["play:21"],
    description: "Agentic RAG play",
  },
  {
    query: "content moderation safety filters",
    expectedIds: ["play:10"],
    description: "Content moderation play",
  },
  {
    query: "Copilot Studio bot builder Teams",
    expectedIds: ["play:08"],
    description: "Copilot Studio play",
  },
  {
    query: "AI search portal hybrid semantic",
    expectedIds: ["play:09"],
    description: "AI Search portal play",
  },
  {
    query: "model serving AKS GPU vLLM",
    expectedIds: ["play:12"],
    description: "Model serving on AKS play",
  },
  {
    query: "AI observability monitoring telemetry",
    expectedIds: ["play:17"],
    description: "Observability play",
  },
  {
    query: "swarm orchestration distributed agents",
    expectedIds: ["play:22"],
    description: "Swarm orchestration play",
  },
  {
    query: "browser automation agent Playwright",
    expectedIds: ["play:23"],
    description: "Browser agent play",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────

function run() {
  console.log("🔍 FAI Factory — Golden Queries (BM25 Search Quality)");
  console.log("══════════════════════════════════════");

  // Load search index
  const indexPath = path.join(REPO_ROOT, "npm-mcp", "search-index.json");
  if (!fs.existsSync(indexPath)) {
    console.error("❌ search-index.json not found at npm-mcp/search-index.json");
    console.error("   Run: cd npm-mcp && node build-search-index.js");
    process.exit(1);
  }

  /** @type {any} */
  let index;
  try {
    index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  } catch (err) {
    console.error(`❌ Failed to parse search-index.json: ${err.message}`);
    process.exit(1);
  }

  if (!index.docs || !index.idf || !index.params) {
    console.error("❌ search-index.json is malformed (missing docs/idf/params)");
    process.exit(1);
  }

  console.log(`  Index: ${index.docs.length} documents, ${Object.keys(index.idf).length} terms`);
  console.log(`  Queries: ${GOLDEN_QUERIES.length}\n`);

  let passCount = 0;
  let failCount = 0;

  for (const gq of GOLDEN_QUERIES) {
    const results = search(gq.query, index, 5, "play");
    const resultIds = results.map((r) => String(r.id));
    const allFound = gq.expectedIds.every((eid) => resultIds.includes(eid));

    if (allFound) {
      passCount++;
      if (VERBOSE) {
        console.log(`  ✅ "${gq.query}"`);
        console.log(`     Expected: [${gq.expectedIds.join(", ")}] — Found in top ${results.length}`);
      }
    } else {
      failCount++;
      console.log(`  ❌ "${gq.query}"`);
      console.log(`     Expected: [${gq.expectedIds.join(", ")}]`);
      console.log(`     Got top-5: [${resultIds.join(", ")}]`);
      if (results.length > 0) {
        console.log(`     Top result: "${results[0].title}" (id=${results[0].id}, score=${results[0].score.toFixed(2)})`);
      }
    }
  }

  const total = passCount + failCount;
  const passRate = total > 0 ? Math.round((passCount / total) * 100) : 0;
  const threshold = 90;

  console.log(`\n  ─────────────────────────────────────`);
  console.log(`  Total:     ${total}`);
  console.log(`  Passed:    ${passCount}`);
  console.log(`  Failed:    ${failCount}`);
  console.log(`  Pass rate: ${passRate}% (threshold: ${threshold}%)`);
  console.log(`  ─────────────────────────────────────`);

  if (passRate >= threshold) {
    console.log(`\n  ✅ SEARCH QUALITY: PASSED (${passRate}% ≥ ${threshold}%)`);
    process.exit(0);
  } else {
    console.log(`\n  ❌ SEARCH QUALITY: FAILED (${passRate}% < ${threshold}%)`);
    process.exit(1);
  }
}

run();
