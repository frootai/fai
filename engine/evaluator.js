/**
 * FAI Engine — Evaluator
 * Checks output quality against guardrail thresholds defined in fai-manifest.json.
 *
 * Evaluates: groundedness, coherence, relevance, safety, cost.
 * This is what makes FrootAI evaluated — quality gates are protocol-level, not afterthoughts.
 */

/**
 * Default guardrail thresholds (used when manifest doesn't specify).
 */
const DEFAULTS = {
  groundedness: 0.95,
  coherence: 0.90,
  relevance: 0.85,
  safety: 0,
  costPerQuery: 0.01
};

/**
 * Create an evaluator with guardrail thresholds from a manifest.
 * @param {object} guardrails - manifest.primitives.guardrails
 * @returns {object} Evaluator instance
 */
function createEvaluator(guardrails = {}) {
  const thresholds = { ...DEFAULTS, ...guardrails };

  return {
    thresholds,

    /**
     * Evaluate a response against guardrail thresholds.
     * @param {object} scores - { groundedness, coherence, relevance, safety, cost }
     * @returns {{ pass: boolean, results: object[], summary: string }}
     */
    evaluate(scores) {
      const results = [];
      let allPass = true;

      // Groundedness check
      if (scores.groundedness !== undefined) {
        const pass = scores.groundedness >= thresholds.groundedness;
        results.push({
          metric: 'groundedness',
          score: scores.groundedness,
          threshold: thresholds.groundedness,
          pass,
          action: pass ? 'ok' : 'retry'
        });
        if (!pass) allPass = false;
      }

      // Coherence check
      if (scores.coherence !== undefined) {
        const pass = scores.coherence >= thresholds.coherence;
        results.push({
          metric: 'coherence',
          score: scores.coherence,
          threshold: thresholds.coherence,
          pass,
          action: pass ? 'ok' : 'retry'
        });
        if (!pass) allPass = false;
      }

      // Relevance check
      if (scores.relevance !== undefined) {
        const pass = scores.relevance >= thresholds.relevance;
        results.push({
          metric: 'relevance',
          score: scores.relevance,
          threshold: thresholds.relevance,
          pass,
          action: pass ? 'ok' : 'warn'
        });
        if (!pass) allPass = false;
      }

      // Safety check (must be exactly 0 violations)
      if (scores.safety !== undefined) {
        const pass = scores.safety <= thresholds.safety;
        results.push({
          metric: 'safety',
          score: scores.safety,
          threshold: thresholds.safety,
          pass,
          action: pass ? 'ok' : 'block'
        });
        if (!pass) allPass = false;
      }

      // Cost check
      if (scores.cost !== undefined && thresholds.costPerQuery) {
        const pass = scores.cost <= thresholds.costPerQuery;
        results.push({
          metric: 'costPerQuery',
          score: scores.cost,
          threshold: thresholds.costPerQuery,
          pass,
          action: pass ? 'ok' : 'alert'
        });
        if (!pass) allPass = false;
      }

      const failed = results.filter(r => !r.pass);
      const summary = allPass
        ? `✅ All ${results.length} quality gates passed`
        : `❌ ${failed.length}/${results.length} quality gates failed: ${failed.map(f => `${f.metric} (${f.score} < ${f.threshold})`).join(', ')}`;

      return { pass: allPass, results, summary };
    },

    /**
     * Format evaluation results as a human-readable report.
     */
    formatReport(evalResult) {
      const lines = ['📊 FAI Quality Evaluation Report', '─'.repeat(40)];
      for (const r of evalResult.results) {
        const icon = r.pass ? '✅' : '❌';
        const pct = typeof r.score === 'number' && r.score <= 1 ? `${(r.score * 100).toFixed(1)}%` : r.score;
        lines.push(`  ${icon} ${r.metric}: ${pct} (threshold: ${r.threshold}, action: ${r.action})`);
      }
      lines.push('─'.repeat(40));
      lines.push(`  ${evalResult.summary}`);
      return lines.join('\n');
    }
  };
}

module.exports = { createEvaluator, DEFAULTS };
