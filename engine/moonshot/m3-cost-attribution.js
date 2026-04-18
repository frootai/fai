'use strict';
/**
 * FAI Moonshot M-3 — Recursive Cost Attribution
 * ===============================================
 * The first universal standard for tracking and attributing AI costs
 * across multi-agent systems, recursively through agent call graphs.
 *
 * Problem: Per-query cost tracking exists, but in multi-agent systems:
 *   - Agent A calls Agent B, Agent B calls Agent C
 *   - Who "owns" the cost? Who's over budget?
 *   - How do you enforce budget limits per agent, per play, per user?
 *   - How do you attribute costs back to business units?
 *
 * FAI Solution: The `cost` contract declares budget topology.
 * The engine tracks cost recursively and enforces limits.
 *
 * fai-manifest.json v2.0 contract:
 * {
 *   "cost": {
 *     "maxPerQuery": 0.01,        // Max USD per single LLM call
 *     "maxPerSession": 0.50,      // Max USD per user session
 *     "maxPerDay": 100.00,        // Max USD per day (org-level)
 *     "attribution": "recursive", // "flat" | "recursive" | "proportional"
 *     "alertAt": 0.80,            // Alert when 80% of budget consumed
 *     "haltAt": 1.00,             // Halt when 100% consumed
 *     "currency": "USD",
 *     "costCenter": "engineering-ai",
 *     "models": {                 // Override pricing per model
 *       "gpt-4o": { "input": 0.000005, "output": 0.000015 }
 *     }
 *   }
 * }
 */

// ── Azure OpenAI Pricing Table (per 1K tokens, USD) ─────────────────────────
// Updated: April 2026 — always override with contract.models for accuracy

const DEFAULT_PRICING = {
  'gpt-4o':              { input: 0.000005,  output: 0.000015  },
  'gpt-4o-mini':         { input: 0.00000015, output: 0.0000006 },
  'gpt-4-turbo':         { input: 0.00001,   output: 0.00003   },
  'gpt-35-turbo':        { input: 0.0000005, output: 0.0000015 },
  'gpt-4':               { input: 0.00003,   output: 0.00006   },
  'claude-sonnet-4-5':   { input: 0.000003,  output: 0.000015  },
  'claude-3-haiku':      { input: 0.00000025, output: 0.00000125 },
  'gemini-2.0-flash':    { input: 0.0000001, output: 0.0000004 },
  'o1':                  { input: 0.000015,  output: 0.00006   },
  'o3-mini':             { input: 0.0000011, output: 0.0000044 },
  'text-embedding-3-small': { input: 0.00000002, output: 0 },
  'text-embedding-3-large': { input: 0.00000013, output: 0 }
};

// ── Attribution Models ────────────────────────────────────────────────────────

const ATTRIBUTION_MODELS = {
  flat:          'Each agent reports only its own direct cost',
  recursive:     'Each agent reports its own cost PLUS cost of all agents it called',
  proportional:  'Parent agent shares cost with children proportionally'
};

// ── Cost Event ───────────────────────────────────────────────────────────────

class CostEvent {
  constructor(opts = {}) {
    this.id = opts.id || `cost-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.timestamp = opts.timestamp || Date.now();
    this.agentId = opts.agentId || 'system';
    this.playId = opts.playId || null;
    this.sessionId = opts.sessionId || null;
    this.model = opts.model || 'unknown';
    this.promptTokens = opts.promptTokens || 0;
    this.completionTokens = opts.completionTokens || 0;
    this.totalTokens = this.promptTokens + this.completionTokens;
    this.unitCost = opts.unitCost || 0;        // Direct cost from model pricing
    this.attributedCost = opts.attributedCost || this.unitCost; // After attribution
    this.callDepth = opts.callDepth || 0;      // 0 = root, 1 = first sub-agent, etc.
    this.parentAgentId = opts.parentAgentId || null;
    this.operation = opts.operation || 'chat'; // 'chat' | 'embedding' | 'image' | 'tts' | 'stt'
    this.tags = opts.tags || [];
    this.metadata = opts.metadata || {};
  }

  toJSON() {
    return {
      id: this.id, timestamp: this.timestamp,
      agentId: this.agentId, playId: this.playId, sessionId: this.sessionId,
      model: this.model, promptTokens: this.promptTokens, completionTokens: this.completionTokens,
      totalTokens: this.totalTokens, unitCost: this.unitCost, attributedCost: this.attributedCost,
      callDepth: this.callDepth, parentAgentId: this.parentAgentId, operation: this.operation
    };
  }
}

// ── Budget State ─────────────────────────────────────────────────────────────

class BudgetState {
  constructor(limits = {}) {
    this.limits = limits;
    this.consumed = {
      query: 0, session: {}, day: 0, month: 0,
      agent: {}, costCenter: {}
    };
    this._lastDayReset = this._dayKey();
    this._lastMonthReset = this._monthKey();
  }

  _dayKey() { return new Date().toISOString().slice(0, 10); }
  _monthKey() { return new Date().toISOString().slice(0, 7); }

  _checkDayReset() {
    const today = this._dayKey();
    if (today !== this._lastDayReset) {
      this.consumed.day = 0;
      this._lastDayReset = today;
    }
  }

  _checkMonthReset() {
    const month = this._monthKey();
    if (month !== this._lastMonthReset) {
      this.consumed.month = 0;
      this._lastMonthReset = month;
    }
  }

  record(event) {
    const cost = event.attributedCost;
    this._checkDayReset();
    this._checkMonthReset();

    this.consumed.query = cost; // Per-query is single event
    this.consumed.day += cost;
    this.consumed.month += cost;

    // Per-session
    if (event.sessionId) {
      this.consumed.session[event.sessionId] = (this.consumed.session[event.sessionId] || 0) + cost;
    }

    // Per-agent
    this.consumed.agent[event.agentId] = (this.consumed.agent[event.agentId] || 0) + cost;
  }

  check(event) {
    const cost = event.attributedCost;
    const violations = [];
    const warnings = [];

    if (this.limits.maxPerQuery && cost > this.limits.maxPerQuery)
      violations.push({ limit: 'maxPerQuery', value: cost, max: this.limits.maxPerQuery });

    if (this.limits.maxPerSession && event.sessionId) {
      const sessionTotal = (this.consumed.session[event.sessionId] || 0) + cost;
      if (sessionTotal > this.limits.maxPerSession)
        violations.push({ limit: 'maxPerSession', value: sessionTotal, max: this.limits.maxPerSession });
      else if (this.limits.alertAt && sessionTotal > this.limits.maxPerSession * this.limits.alertAt)
        warnings.push({ limit: 'maxPerSession', value: sessionTotal, max: this.limits.maxPerSession, pct: sessionTotal / this.limits.maxPerSession });
    }

    if (this.limits.maxPerDay) {
      this._checkDayReset();
      const dayTotal = this.consumed.day + cost;
      if (dayTotal > this.limits.maxPerDay)
        violations.push({ limit: 'maxPerDay', value: dayTotal, max: this.limits.maxPerDay });
      else if (this.limits.alertAt && dayTotal > this.limits.maxPerDay * this.limits.alertAt)
        warnings.push({ limit: 'maxPerDay', value: dayTotal, max: this.limits.maxPerDay, pct: dayTotal / this.limits.maxPerDay });
    }

    return { ok: violations.length === 0, violations, warnings };
  }

  utilization(sessionId) {
    this._checkDayReset();
    const result = { day: null, month: null, session: null };
    if (this.limits.maxPerDay) result.day = { consumed: this.consumed.day, max: this.limits.maxPerDay, pct: this.consumed.day / this.limits.maxPerDay };
    if (this.limits.maxPerSession && sessionId) {
      const s = this.consumed.session[sessionId] || 0;
      result.session = { consumed: s, max: this.limits.maxPerSession, pct: s / this.limits.maxPerSession };
    }
    return result;
  }
}

// ── Cost Attribution Engine ──────────────────────────────────────────────────

class CostAttributionEngine {
  /**
   * @param {object} contract — The `cost` block from fai-manifest.json
   * @param {string} playId   — Current play identifier
   */
  constructor(contract = {}, playId = 'unknown') {
    this.playId = playId;
    this.contract = this._normalizeContract(contract);
    this._events = [];
    this._callGraph = new Map(); // agentId → [childAgentId, ...]
    this._budget = new BudgetState({
      maxPerQuery:   this.contract.maxPerQuery,
      maxPerSession: this.contract.maxPerSession,
      maxPerDay:     this.contract.maxPerDay,
      alertAt:       this.contract.alertAt
    });
    this._stats = {
      totalEvents: 0, totalCost: 0, alertsFired: 0, halts: 0,
      modelBreakdown: {}, agentBreakdown: {}
    };
  }

  _normalizeContract(c) {
    return {
      maxPerQuery:   typeof c.maxPerQuery === 'number' ? c.maxPerQuery : null,
      maxPerSession: typeof c.maxPerSession === 'number' ? c.maxPerSession : null,
      maxPerDay:     typeof c.maxPerDay === 'number' ? c.maxPerDay : null,
      maxPerMonth:   typeof c.maxPerMonth === 'number' ? c.maxPerMonth : null,
      attribution:   ['flat', 'recursive', 'proportional'].includes(c.attribution) ? c.attribution : 'recursive',
      alertAt:       typeof c.alertAt === 'number' ? c.alertAt : 0.8,
      haltAt:        typeof c.haltAt === 'number' ? c.haltAt : 1.0,
      currency:      c.currency || 'USD',
      costCenter:    c.costCenter || null,
      models:        typeof c.models === 'object' ? c.models : {}
    };
  }

  static validateContract(contract) {
    const errors = [];
    const numFields = ['maxPerQuery', 'maxPerSession', 'maxPerDay', 'alertAt', 'haltAt'];
    for (const f of numFields) {
      if (contract[f] !== undefined && typeof contract[f] !== 'number')
        errors.push(`${f} must be a number`);
    }
    if (contract.attribution && !['flat', 'recursive', 'proportional'].includes(contract.attribution))
      errors.push(`Invalid attribution "${contract.attribution}". Must be: flat | recursive | proportional`);
    if (contract.alertAt !== undefined && (contract.alertAt < 0 || contract.alertAt > 1))
      errors.push('alertAt must be between 0 and 1');
    return errors;
  }

  // ── Pricing ───────────────────────────────────────────────────────────────

  _getModelPricing(model) {
    // Contract overrides take precedence
    const override = this.contract.models[model];
    if (override) return { input: override.input || 0, output: override.output || 0 };

    // Try exact match, then fuzzy match
    if (DEFAULT_PRICING[model]) return DEFAULT_PRICING[model];
    for (const [key, pricing] of Object.entries(DEFAULT_PRICING)) {
      if (model.includes(key) || key.includes(model.split('/').pop())) return pricing;
    }

    return { input: 0.00001, output: 0.00003 }; // Conservative fallback
  }

  /**
   * Calculate cost for a model call.
   */
  calculateCost(model, promptTokens, completionTokens) {
    const pricing = this._getModelPricing(model);
    const inputCost = (promptTokens / 1000) * pricing.input;
    const outputCost = (completionTokens / 1000) * pricing.output;
    return {
      inputCost: Math.round(inputCost * 1e8) / 1e8,
      outputCost: Math.round(outputCost * 1e8) / 1e8,
      totalCost: Math.round((inputCost + outputCost) * 1e8) / 1e8,
      pricing,
      model
    };
  }

  // ── Call Graph ────────────────────────────────────────────────────────────

  registerCall(parentAgentId, childAgentId) {
    if (!this._callGraph.has(parentAgentId)) this._callGraph.set(parentAgentId, []);
    if (!this._callGraph.get(parentAgentId).includes(childAgentId)) {
      this._callGraph.get(parentAgentId).push(childAgentId);
    }
  }

  // ── Cost Recording ────────────────────────────────────────────────────────

  /**
   * Record a cost event. Returns budget check result.
   */
  record(opts = {}) {
    const { model, promptTokens = 0, completionTokens = 0, agentId, sessionId,
            callDepth = 0, parentAgentId = null, operation = 'chat' } = opts;

    const { totalCost } = this.calculateCost(model, promptTokens, completionTokens);

    const event = new CostEvent({
      agentId: agentId || 'system',
      playId: this.playId, sessionId,
      model, promptTokens, completionTokens,
      unitCost: totalCost, attributedCost: totalCost,
      callDepth, parentAgentId, operation,
      tags: opts.tags || []
    });

    // Register call graph
    if (parentAgentId) this.registerCall(parentAgentId, agentId);

    // Check budget BEFORE recording
    const check = this._budget.check(event);

    if (!check.ok) {
      this._stats.halts++;
      return {
        ok: false,
        halt: true,
        event: event.toJSON(),
        violations: check.violations,
        message: `Cost budget exceeded: ${check.violations.map(v => `${v.limit} ($${v.value.toFixed(6)} > $${v.max})`).join(', ')}`
      };
    }

    // Record event
    this._events.push(event);
    this._budget.record(event);
    this._stats.totalEvents++;
    this._stats.totalCost = Math.round((this._stats.totalCost + totalCost) * 1e8) / 1e8;

    // Model breakdown
    if (!this._stats.modelBreakdown[model]) this._stats.modelBreakdown[model] = { calls: 0, tokens: 0, cost: 0 };
    this._stats.modelBreakdown[model].calls++;
    this._stats.modelBreakdown[model].tokens += promptTokens + completionTokens;
    this._stats.modelBreakdown[model].cost = Math.round((this._stats.modelBreakdown[model].cost + totalCost) * 1e8) / 1e8;

    // Agent breakdown
    const aid = agentId || 'system';
    if (!this._stats.agentBreakdown[aid]) this._stats.agentBreakdown[aid] = { calls: 0, tokens: 0, cost: 0 };
    this._stats.agentBreakdown[aid].calls++;
    this._stats.agentBreakdown[aid].tokens += promptTokens + completionTokens;
    this._stats.agentBreakdown[aid].cost = Math.round((this._stats.agentBreakdown[aid].cost + totalCost) * 1e8) / 1e8;

    if (check.warnings.length > 0) this._stats.alertsFired += check.warnings.length;

    return { ok: true, event: event.toJSON(), cost: totalCost, warnings: check.warnings };
  }

  // ── Recursive Attribution ─────────────────────────────────────────────────

  /**
   * Compute recursive cost attribution for an agent.
   * Returns the agent's direct cost PLUS all costs of agents it called.
   */
  getAttributedCost(agentId, visited = new Set()) {
    if (visited.has(agentId)) return 0; // Cycle detection
    visited.add(agentId);

    const directCost = this._events
      .filter(e => e.agentId === agentId)
      .reduce((sum, e) => sum + e.unitCost, 0);

    if (this.contract.attribution === 'flat') return directCost;

    // Recursive: add children's costs
    const children = this._callGraph.get(agentId) || [];
    const childCost = children.reduce((sum, child) => sum + this.getAttributedCost(child, visited), 0);

    return Math.round((directCost + childCost) * 1e8) / 1e8;
  }

  // ── Reporting ─────────────────────────────────────────────────────────────

  /**
   * Generate cost attribution report for the entire play.
   */
  report(sessionId) {
    const agents = new Set(this._events.map(e => e.agentId));
    const agentAttribution = {};
    for (const agentId of agents) {
      agentAttribution[agentId] = {
        direct: Math.round(this._events.filter(e => e.agentId === agentId).reduce((s, e) => s + e.unitCost, 0) * 1e8) / 1e8,
        attributed: this.getAttributedCost(agentId),
        calls: this._events.filter(e => e.agentId === agentId).length
      };
    }

    return {
      playId: this.playId,
      attribution: this.contract.attribution,
      currency: this.contract.currency,
      costCenter: this.contract.costCenter,
      summary: {
        totalCost: this._stats.totalCost,
        totalEvents: this._stats.totalEvents,
        halts: this._stats.halts,
        alerts: this._stats.alertsFired
      },
      budgetUtilization: this._budget.utilization(sessionId),
      agentAttribution,
      modelBreakdown: this._stats.modelBreakdown,
      callGraph: Object.fromEntries(this._callGraph),
      topModels: Object.entries(this._stats.modelBreakdown)
        .sort((a, b) => b[1].cost - a[1].cost)
        .slice(0, 5)
        .map(([model, data]) => ({ model, ...data }))
    };
  }

  stats() {
    return {
      playId: this.playId,
      contract: {
        maxPerQuery: this.contract.maxPerQuery,
        maxPerSession: this.contract.maxPerSession,
        maxPerDay: this.contract.maxPerDay,
        attribution: this.contract.attribution,
        currency: this.contract.currency
      },
      ...this._stats,
      budgetDay: this._budget.consumed.day,
      agentCount: this._callGraph.size
    };
  }
}

// ── Factory ──────────────────────────────────────────────────────────────────

function createCostEngine(manifest, playId) {
  const contract = manifest?.cost || {};
  const errors = CostAttributionEngine.validateContract(contract);
  if (errors.length > 0) throw new Error(`Invalid cost contract: ${errors.join('; ')}`);
  return new CostAttributionEngine(contract, playId || manifest?.play || 'unknown');
}

module.exports = { CostAttributionEngine, CostEvent, createCostEngine, DEFAULT_PRICING, ATTRIBUTION_MODELS };
