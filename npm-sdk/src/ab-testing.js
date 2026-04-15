/**
 * FrootAI Prompt A/B Testing Framework
 *
 * Run prompt experiments across variants, measure quality, pick winners.
 * Requires a modelFn callback for actual LLM inference.
 *
 * Usage:
 *   import { PromptExperiment, PromptVariant } from 'frootai';
 *
 *   const experiment = new PromptExperiment({
 *     name: 'rag-system-prompt-v2',
 *     variants: [
 *       new PromptVariant('control', 'You are a helpful assistant.'),
 *       new PromptVariant('concise', 'Answer in 2 sentences max.'),
 *       new PromptVariant('expert', 'You are an Azure AI expert. Cite sources.'),
 *     ],
 *     metrics: ['groundedness', 'relevance', 'latency'],
 *   });
 *
 *   const results = await experiment.run({
 *     queries: ['What is RAG?', 'Explain embeddings'],
 *     modelFn: async (systemPrompt, query) => callLLM(systemPrompt, query),
 *     scorerFn: async (query, response) => ({ groundedness: 4.5, relevance: 4.0 }),
 *   });
 *
 *   const winner = experiment.pickWinner(results);
 */

/**
 * A single prompt variant in an A/B test.
 */
export class PromptVariant {
  constructor(name, systemPrompt, weight = 1.0) {
    this.name = name;
    this.systemPrompt = systemPrompt;
    this.weight = weight;
  }
}

/**
 * Result of running one variant against one query.
 */
export class ExperimentResult {
  constructor({ variant, query, response, latencyMs, scores = {} }) {
    this.variant = variant;
    this.query = query;
    this.response = response;
    this.latencyMs = latencyMs;
    this.scores = scores;
  }
}

/**
 * A/B testing experiment for prompt variants.
 */
export class PromptExperiment {
  /**
   * @param {object} opts
   * @param {string} opts.name - Experiment identifier
   * @param {PromptVariant[]} opts.variants - Variants to test
   * @param {string[]} [opts.metrics] - Quality metrics to measure
   */
  constructor({ name, variants, metrics = ['groundedness', 'relevance', 'coherence'] }) {
    this.name = name;
    this.variants = variants;
    this.metrics = metrics;
  }

  /**
   * Run the experiment using provided model and scorer functions.
   * @param {object} opts
   * @param {string[]} opts.queries - Test queries
   * @param {function} opts.modelFn - async (systemPrompt, query) => response
   * @param {function} [opts.scorerFn] - async (query, response) => {metric: score}
   * @param {number} [opts.rounds=1] - Rounds to repeat for statistical stability
   * @returns {Promise<ExperimentResult[]>}
   */
  async run({ queries, modelFn, scorerFn = null, rounds = 1 }) {
    const results = [];

    for (let r = 0; r < rounds; r++) {
      for (const query of queries) {
        for (const variant of this.variants) {
          const start = performance.now();
          const response = await modelFn(variant.systemPrompt, query);
          const latencyMs = Math.round((performance.now() - start) * 10) / 10;

          let scores = {};
          if (scorerFn) {
            scores = await scorerFn(query, response);
          }
          scores.latency_ms = latencyMs;

          results.push(new ExperimentResult({
            variant: variant.name,
            query,
            response,
            latencyMs,
            scores,
          }));
        }
      }
    }

    return results;
  }

  /**
   * Pick the best variant based on average scores (excluding latency).
   * Falls back to lowest latency if no quality scores available.
   * @param {ExperimentResult[]} results
   * @returns {string} Winner variant name
   */
  pickWinner(results) {
    const variantScores = {};

    for (const r of results) {
      if (!variantScores[r.variant]) variantScores[r.variant] = [];
      const qualityScores = Object.entries(r.scores)
        .filter(([k]) => k !== 'latency_ms')
        .map(([, v]) => v);
      if (qualityScores.length > 0) {
        const avg = qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length;
        variantScores[r.variant].push(avg);
      }
    }

    const hasScores = Object.values(variantScores).some(v => v.length > 0);
    if (!hasScores) {
      // Fall back to lowest latency
      const latencies = {};
      for (const r of results) {
        if (!latencies[r.variant]) latencies[r.variant] = [];
        latencies[r.variant].push(r.latencyMs);
      }
      let bestVariant = null, bestAvg = Infinity;
      for (const [v, vals] of Object.entries(latencies)) {
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        if (avg < bestAvg) { bestAvg = avg; bestVariant = v; }
      }
      return bestVariant;
    }

    let bestVariant = null, bestAvg = -Infinity;
    for (const [v, scores] of Object.entries(variantScores)) {
      if (scores.length === 0) continue;
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg > bestAvg) { bestAvg = avg; bestVariant = v; }
    }
    return bestVariant;
  }

  /**
   * Generate a human-readable experiment summary.
   * @param {ExperimentResult[]} results
   * @returns {string}
   */
  summary(results) {
    const lines = [`Experiment: ${this.name}`, '='.repeat(50)];
    const variantData = {};

    for (const r of results) {
      if (!variantData[r.variant]) variantData[r.variant] = [];
      variantData[r.variant].push(r);
    }

    for (const [variant, data] of Object.entries(variantData)) {
      const allMetrics = new Set();
      for (const r of data) Object.keys(r.scores).forEach(k => allMetrics.add(k));

      const avgScores = {};
      for (const m of [...allMetrics].sort()) {
        const vals = data.filter(r => m in r.scores).map(r => r.scores[m]);
        if (vals.length > 0) avgScores[m] = vals.reduce((a, b) => a + b, 0) / vals.length;
      }

      lines.push(`\n  Variant: ${variant}`);
      lines.push(`  Samples: ${data.length}`);
      for (const [m, s] of Object.entries(avgScores)) {
        lines.push(`    ${m}: ${s.toFixed(2)}`);
      }
    }

    const winner = this.pickWinner(results);
    lines.push(`\n  Winner: ${winner}`);
    return lines.join('\n');
  }

  /**
   * Export experiment config as JSON string.
   * @returns {string}
   */
  toJSON() {
    return JSON.stringify({
      name: this.name,
      variants: this.variants.map(v => ({
        name: v.name, systemPrompt: v.systemPrompt, weight: v.weight,
      })),
      metrics: this.metrics,
    }, null, 2);
  }
}
