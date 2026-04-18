'use strict';
/**
 * FAI Moonshot M-9 — Evaluation Benchmark Standard
 * ==================================================
 * Universal, reproducible evaluation for AI systems.
 *
 * Problem: DeepEval, RAGAS, PromptFoo, TruLens — all use different metrics.
 * No cross-vendor benchmark standard exists for:
 *   - Reproducible evaluation with locked golden test sets
 *   - Regression detection (did the new model perform worse?)
 *   - Multi-metric scoring with weighted aggregation
 *   - Statistical significance testing between versions
 *   - Leaderboard across plays and models
 *
 * fai-manifest.json v2.0 contract:
 * {
 *   "evaluation": {
 *     "goldenSet": "./evaluation/golden-set.json",
 *     "metrics": ["groundedness", "relevance", "coherence", "safety", "latency"],
 *     "weights": { "groundedness": 0.3, "relevance": 0.25, "coherence": 0.2, "safety": 0.15, "latency": 0.1 },
 *     "thresholds": { "groundedness": 0.9, "safety": 0.99, "composite": 0.85 },
 *     "regressionGate": true,
 *     "baselineVersion": "1.0.0"
 *   }
 * }
 */

const fs = require('fs');
const crypto = require('crypto');

// ── Metric Definitions ────────────────────────────────────────────────────────

const METRIC_DEFINITIONS = {
  groundedness: {
    description: 'Response is supported by provided context/sources',
    range: [0, 1], higherIsBetter: true,
    defaultThreshold: 0.9,
    defaultWeight: 0.3
  },
  relevance: {
    description: 'Response is relevant to the question asked',
    range: [0, 1], higherIsBetter: true,
    defaultThreshold: 0.8,
    defaultWeight: 0.25
  },
  coherence: {
    description: 'Response is logically coherent and well-structured',
    range: [0, 1], higherIsBetter: true,
    defaultThreshold: 0.8,
    defaultWeight: 0.2
  },
  safety: {
    description: 'Response does not contain harmful content',
    range: [0, 1], higherIsBetter: true,
    defaultThreshold: 0.99,
    defaultWeight: 0.15
  },
  latency: {
    description: 'Response latency in milliseconds (lower is better)',
    range: [0, Infinity], higherIsBetter: false,
    defaultThreshold: 3000,
    defaultWeight: 0.1
  },
  faithfulness: {
    description: 'Response is faithful to cited sources (RAG-specific)',
    range: [0, 1], higherIsBetter: true,
    defaultThreshold: 0.85,
    defaultWeight: 0.25
  },
  contextPrecision: {
    description: 'Proportion of retrieved context that is relevant',
    range: [0, 1], higherIsBetter: true,
    defaultThreshold: 0.75,
    defaultWeight: 0.15
  },
  contextRecall: {
    description: 'Proportion of relevant context that was retrieved',
    range: [0, 1], higherIsBetter: true,
    defaultThreshold: 0.75,
    defaultWeight: 0.15
  },
  hallucination: {
    description: 'Rate of hallucinated content (lower is better)',
    range: [0, 1], higherIsBetter: false,
    defaultThreshold: 0.05,
    defaultWeight: 0.3
  },
  toxicity: {
    description: 'Toxicity score (lower is better)',
    range: [0, 1], higherIsBetter: false,
    defaultThreshold: 0.01,
    defaultWeight: 0.2
  }
};

// ── Golden Test Case ──────────────────────────────────────────────────────────

class GoldenTestCase {
  constructor(opts = {}) {
    this.id = opts.id || `tc-${crypto.randomBytes(4).toString('hex')}`;
    this.question = opts.question || opts.input || '';
    this.expectedAnswer = opts.expectedAnswer || opts.expected || '';
    this.context = opts.context || [];          // RAG context documents
    this.tags = Array.isArray(opts.tags) ? opts.tags : [];
    this.difficulty = opts.difficulty || 'medium';  // easy | medium | hard
    this.requiredCitations = opts.requiredCitations || [];
    this.language = opts.language || 'en';
    this.createdAt = opts.createdAt || Date.now();
    this.hash = this._computeHash();
  }

  _computeHash() {
    return crypto.createHash('sha256')
      .update(`${this.question}:${this.expectedAnswer}`)
      .digest('hex').slice(0, 12);
  }

  toJSON() {
    return { id: this.id, question: this.question, expectedAnswer: this.expectedAnswer,
      context: this.context, tags: this.tags, difficulty: this.difficulty,
      language: this.language, hash: this.hash };
  }
}

// ── Evaluation Run ────────────────────────────────────────────────────────────

class EvaluationRun {
  constructor(opts = {}) {
    this.runId = opts.runId || `run-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    this.playId = opts.playId || 'unknown';
    this.version = opts.version || '1.0.0';
    this.model = opts.model || 'unknown';
    this.startTime = Date.now();
    this.endTime = null;
    this.results = [];   // Array of EvalResult per test case
    this.metadata = opts.metadata || {};
  }

  addResult(testCaseId, metrics) {
    this.results.push({ testCaseId, metrics, timestamp: Date.now() });
  }

  end() { this.endTime = Date.now(); return this; }

  get duration() { return this.endTime ? this.endTime - this.startTime : Date.now() - this.startTime; }

  aggregateMetrics(weights = {}) {
    if (this.results.length === 0) return {};
    const allMetrics = new Set(this.results.flatMap(r => Object.keys(r.metrics)));
    const agg = {};

    for (const metric of allMetrics) {
      const values = this.results.map(r => r.metrics[metric]).filter(v => typeof v === 'number');
      if (values.length === 0) continue;
      agg[metric] = {
        mean:   values.reduce((a, b) => a + b, 0) / values.length,
        min:    Math.min(...values),
        max:    Math.max(...values),
        p50:    this._percentile(values, 50),
        p95:    this._percentile(values, 95),
        count:  values.length
      };
    }

    // Composite score
    const weightMap = { ...Object.fromEntries(Object.entries(METRIC_DEFINITIONS).map(([k, v]) => [k, v.defaultWeight])), ...weights };
    let composite = 0, totalWeight = 0;
    for (const [metric, stats] of Object.entries(agg)) {
      const w = weightMap[metric] || 0.1;
      const def = METRIC_DEFINITIONS[metric];
      if (!def || def.higherIsBetter === false) continue; // Skip inverted metrics for composite
      composite += stats.mean * w;
      totalWeight += w;
    }
    agg._composite = totalWeight > 0 ? Math.round(composite / totalWeight * 1000) / 1000 : 0;

    return agg;
  }

  _percentile(values, p) {
    const sorted = [...values].sort((a, b) => a - b);
    const idx = Math.ceil(p / 100 * sorted.length) - 1;
    return Math.round(sorted[Math.max(0, idx)] * 1000) / 1000;
  }

  toJSON() {
    return {
      runId: this.runId, playId: this.playId, version: this.version, model: this.model,
      startTime: this.startTime, endTime: this.endTime, duration: this.duration,
      testCaseCount: this.results.length, metadata: this.metadata
    };
  }
}

// ── Evaluation Engine ────────────────────────────────────────────────────────

class EvaluationEngine {
  /**
   * @param {object} contract — The `evaluation` block from fai-manifest.json
   * @param {string} playId   — Current play identifier
   */
  constructor(contract = {}, playId = 'unknown') {
    this.playId = playId;
    this.contract = this._normalizeContract(contract);
    this._goldenSet = [];
    this._runs = new Map();          // runId → EvaluationRun
    this._baseline = null;           // Baseline run metrics for regression detection
    this._stats = { runsCompleted: 0, testCasesEvaluated: 0, regressions: 0, passes: 0, failures: 0 };
  }

  _normalizeContract(c) {
    const defaultMetrics = ['groundedness', 'relevance', 'coherence', 'safety'];
    return {
      goldenSet:       c.goldenSet || null,
      metrics:         Array.isArray(c.metrics) ? c.metrics.filter(m => METRIC_DEFINITIONS[m]) : defaultMetrics,
      weights:         typeof c.weights === 'object' ? c.weights : {},
      thresholds:      typeof c.thresholds === 'object' ? c.thresholds : {},
      regressionGate:  c.regressionGate !== false,
      baselineVersion: c.baselineVersion || null
    };
  }

  static validateContract(contract) {
    const errors = [];
    if (contract.metrics) {
      for (const m of contract.metrics) {
        if (!METRIC_DEFINITIONS[m]) errors.push(`Unknown evaluation metric "${m}"`);
      }
    }
    return errors;
  }

  // ── Golden Set ────────────────────────────────────────────────────────────

  addTestCase(opts) {
    const tc = new GoldenTestCase(opts);
    this._goldenSet.push(tc);
    return tc;
  }

  loadGoldenSet(data) {
    if (Array.isArray(data)) {
      this._goldenSet = data.map(d => new GoldenTestCase(d));
    }
    return { ok: true, loaded: this._goldenSet.length };
  }

  loadGoldenSetFromFile(filePath) {
    if (!fs.existsSync(filePath)) return { ok: false, error: `Golden set file not found: ${filePath}` };
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return this.loadGoldenSet(Array.isArray(data) ? data : data.cases || []);
  }

  get goldenSetHash() {
    const content = this._goldenSet.map(tc => tc.hash).join('');
    return crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
  }

  // ── Run Evaluation ────────────────────────────────────────────────────────

  startRun(opts = {}) {
    const run = new EvaluationRun({
      playId: this.playId,
      version: opts.version || '1.0.0',
      model: opts.model || 'unknown',
      metadata: { goldenSetHash: this.goldenSetHash, ...opts.metadata }
    });
    this._runs.set(run.runId, run);
    return run;
  }

  /**
   * Record metrics for a single test case result.
   */
  recordResult(runId, testCaseId, metrics) {
    const run = this._runs.get(runId);
    if (!run) return { ok: false, error: 'Run not found' };
    run.addResult(testCaseId, metrics);
    this._stats.testCasesEvaluated++;
    return { ok: true };
  }

  /**
   * Complete an evaluation run and check thresholds.
   */
  completeRun(runId) {
    const run = this._runs.get(runId);
    if (!run) return { ok: false, error: 'Run not found' };
    run.end();
    this._stats.runsCompleted++;

    const aggregated = run.aggregateMetrics(this.contract.weights);
    const violations = [];
    const thresholds = {
      ...Object.fromEntries(this.contract.metrics.map(m => [m, METRIC_DEFINITIONS[m]?.defaultThreshold])),
      ...this.contract.thresholds
    };

    // Check each threshold
    for (const [metric, threshold] of Object.entries(thresholds)) {
      if (!threshold || !aggregated[metric]) continue;
      const value = aggregated[metric].mean;
      const def = METRIC_DEFINITIONS[metric];
      const failed = def?.higherIsBetter === false ? value > threshold : value < threshold;
      if (failed) {
        violations.push({ metric, value: Math.round(value * 1000) / 1000, threshold, higherIsBetter: def?.higherIsBetter !== false });
      }
    }

    // Regression detection
    let regression = null;
    if (this.contract.regressionGate && this._baseline) {
      regression = this._detectRegression(aggregated, this._baseline.metrics);
    }

    const passed = violations.length === 0 && !regression?.significant;
    if (passed) this._stats.passes++;
    else this._stats.failures++;
    if (regression?.significant) this._stats.regressions++;

    return {
      ok: passed, runId,
      metrics: aggregated,
      violations,
      regression,
      composite: aggregated._composite,
      duration: run.duration,
      testCaseCount: run.results.length
    };
  }

  // ── Baseline & Regression ─────────────────────────────────────────────────

  setBaseline(runId) {
    const run = this._runs.get(runId);
    if (!run) return { ok: false, error: 'Run not found' };
    this._baseline = { runId, version: run.version, metrics: run.aggregateMetrics(this.contract.weights) };
    return { ok: true, baselineSet: runId };
  }

  _detectRegression(current, baseline) {
    const regressions = [];
    for (const metric of this.contract.metrics) {
      const curr = current[metric]?.mean;
      const base = baseline[metric]?.mean;
      if (curr === undefined || base === undefined) continue;
      const def = METRIC_DEFINITIONS[metric];
      const delta = curr - base;
      const pct = base !== 0 ? Math.abs(delta / base) : 0;
      // Regression = worse performance (>5% degradation)
      const isRegression = def?.higherIsBetter === false ? delta > base * 0.05 : delta < -(base * 0.05);
      if (isRegression) regressions.push({ metric, baseline: Math.round(base * 1000) / 1000, current: Math.round(curr * 1000) / 1000, delta: Math.round(delta * 1000) / 1000, pct: Math.round(pct * 100) });
    }
    return { significant: regressions.length > 0, regressions };
  }

  // ── Leaderboard ───────────────────────────────────────────────────────────

  leaderboard() {
    const entries = [];
    for (const run of this._runs.values()) {
      if (!run.endTime) continue;
      const metrics = run.aggregateMetrics(this.contract.weights);
      entries.push({ runId: run.runId, version: run.version, model: run.model,
        composite: metrics._composite, groundedness: metrics.groundedness?.mean,
        safety: metrics.safety?.mean, latency: metrics.latency?.p95 });
    }
    return entries.sort((a, b) => (b.composite || 0) - (a.composite || 0));
  }

  stats() {
    return {
      playId: this.playId,
      contract: { metrics: this.contract.metrics, regressionGate: this.contract.regressionGate, baselineVersion: this.contract.baselineVersion },
      goldenSetSize: this._goldenSet.length,
      goldenSetHash: this.goldenSetHash,
      hasBaseline: this._baseline !== null,
      operations: this._stats,
      runs: this._runs.size
    };
  }
}

function createEvaluationEngine(manifest, playId) {
  const contract = manifest?.evaluation || {};
  const errors = EvaluationEngine.validateContract(contract);
  if (errors.length > 0) throw new Error(`Invalid evaluation contract: ${errors.join('; ')}`);
  return new EvaluationEngine(contract, playId || manifest?.play || 'unknown');
}

module.exports = { EvaluationEngine, GoldenTestCase, EvaluationRun, createEvaluationEngine, METRIC_DEFINITIONS };
