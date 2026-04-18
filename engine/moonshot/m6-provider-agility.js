'use strict';
/**
 * FAI Moonshot M-6 — Provider Agility
 * =====================================
 * Hot-swap LLM providers with declarative fallback chains.
 *
 * Problem: Portkey/LiteLLM route to providers at the infrastructure level.
 * But there is NO STANDARD for declaring acceptable providers in a manifest:
 *   - Which providers are allowed for this play?
 *   - What's the fallback order when primary is down?
 *   - Should we route by cost, latency, or quality?
 *   - How do we enforce data residency (EU data → EU providers)?
 *
 * fai-manifest.json v2.0 contract:
 * {
 *   "providers": {
 *     "primary": "azure-openai/gpt-4o",
 *     "fallback": ["openai/gpt-4o", "anthropic/claude-sonnet", "ollama/llama3"],
 *     "routing": "cost-optimized" | "latency-optimized" | "quality-optimized" | "round-robin",
 *     "dataResidency": "eu" | "us" | "global",
 *     "blocked": ["provider-with-data-issues"],
 *     "overrides": { "embedding": "text-embedding-3-small", "vision": "gpt-4o" }
 *   }
 * }
 */

// ── Provider Registry ─────────────────────────────────────────────────────────

const PROVIDER_CATALOG = {
  'azure-openai': {
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-35-turbo', 'o1', 'o3-mini',
             'text-embedding-3-small', 'text-embedding-3-large'],
    regions: ['eastus', 'eastus2', 'westus', 'northeurope', 'westeurope', 'swedencentral'],
    dataResidency: ['eu', 'us'],
    supportedModalities: ['text', 'image', 'embedding'],
    avgLatencyMs: 800,
    costIndex: 1.0 // Reference cost
  },
  'openai': {
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'o1', 'o3-mini'],
    regions: ['us'],
    dataResidency: ['us'],
    supportedModalities: ['text', 'image', 'embedding', 'audio'],
    avgLatencyMs: 700,
    costIndex: 1.1
  },
  'anthropic': {
    models: ['claude-sonnet-4-5', 'claude-3-haiku', 'claude-3-5-sonnet'],
    regions: ['us'],
    dataResidency: ['us'],
    supportedModalities: ['text', 'image'],
    avgLatencyMs: 900,
    costIndex: 0.9
  },
  'google-vertex': {
    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    regions: ['us', 'eu'],
    dataResidency: ['eu', 'us'],
    supportedModalities: ['text', 'image', 'audio', 'video'],
    avgLatencyMs: 600,
    costIndex: 0.7
  },
  'azure-ai-studio': {
    models: ['mistral-large', 'llama-3.1-70b', 'cohere-command-r'],
    regions: ['eastus', 'westeurope'],
    dataResidency: ['eu', 'us'],
    supportedModalities: ['text'],
    avgLatencyMs: 1200,
    costIndex: 0.5
  },
  'ollama': {
    models: ['llama3', 'llama3.1', 'mistral', 'phi3', 'gemma2'],
    regions: ['local'],
    dataResidency: ['local'],
    supportedModalities: ['text'],
    avgLatencyMs: 200, // local
    costIndex: 0.0
  },
  'groq': {
    models: ['llama-3.1-70b', 'llama-3.3-70b', 'mistral-8x7b'],
    regions: ['us'],
    dataResidency: ['us'],
    supportedModalities: ['text'],
    avgLatencyMs: 150, // Very fast
    costIndex: 0.2
  }
};

const ROUTING_STRATEGIES = ['cost-optimized', 'latency-optimized', 'quality-optimized', 'round-robin', 'primary-only'];
const DATA_RESIDENCY = ['eu', 'us', 'global', 'local'];

// ── Provider Health Tracker ───────────────────────────────────────────────────

class ProviderHealth {
  constructor(providerId) {
    this.providerId = providerId;
    this.available = true;
    this.successCount = 0;
    this.failureCount = 0;
    this.totalLatencyMs = 0;
    this.lastError = null;
    this.lastCheck = Date.now();
    this.circuitOpen = false;
    this.circuitOpenedAt = null;
    this.circuitResetAfterMs = 60_000; // 1 minute
  }

  get avgLatencyMs() {
    const total = this.successCount + this.failureCount;
    return total > 0 ? Math.round(this.totalLatencyMs / total) : 1000;
  }

  get errorRate() {
    const total = this.successCount + this.failureCount;
    return total > 0 ? this.failureCount / total : 0;
  }

  recordSuccess(latencyMs) {
    this.successCount++;
    this.totalLatencyMs += latencyMs;
    this.lastCheck = Date.now();
    // Close circuit if it was open and enough time has passed
    if (this.circuitOpen && Date.now() - this.circuitOpenedAt > this.circuitResetAfterMs) {
      this.circuitOpen = false;
      this.available = true;
    }
  }

  recordFailure(error) {
    this.failureCount++;
    this.lastError = error?.message || String(error);
    this.lastCheck = Date.now();
    // Open circuit if error rate > 50% with at least 5 calls
    if ((this.successCount + this.failureCount) >= 5 && this.errorRate > 0.5) {
      this.circuitOpen = true;
      this.circuitOpenedAt = Date.now();
      this.available = false;
    }
  }

  toJSON() {
    return {
      providerId: this.providerId,
      available: this.available,
      circuitOpen: this.circuitOpen,
      successCount: this.successCount,
      failureCount: this.failureCount,
      errorRate: Math.round(this.errorRate * 100) / 100,
      avgLatencyMs: this.avgLatencyMs,
      lastError: this.lastError
    };
  }
}

// ── Provider Agility Engine ───────────────────────────────────────────────────

class ProviderAgilityEngine {
  /**
   * @param {object} contract — The `providers` block from fai-manifest.json
   * @param {string} playId   — Current play identifier
   */
  constructor(contract = {}, playId = 'unknown') {
    this.playId = playId;
    this.contract = this._normalizeContract(contract);
    this._health = new Map();
    this._roundRobinIndex = 0;
    this._routingLog = [];
    this._stats = { routed: 0, fallbacks: 0, blocked: 0, circuitBreaks: 0 };

    // Initialize health trackers for all providers in chain
    for (const providerSpec of [this.contract.primary, ...this.contract.fallback]) {
      const id = this._providerId(providerSpec);
      if (id && !this._health.has(id)) {
        this._health.set(id, new ProviderHealth(id));
      }
    }
  }

  _normalizeContract(c) {
    return {
      primary:       c.primary || 'azure-openai/gpt-4o',
      fallback:      Array.isArray(c.fallback) ? c.fallback : [],
      routing:       ROUTING_STRATEGIES.includes(c.routing) ? c.routing : 'cost-optimized',
      dataResidency: DATA_RESIDENCY.includes(c.dataResidency) ? c.dataResidency : 'global',
      blocked:       Array.isArray(c.blocked) ? c.blocked : [],
      overrides:     typeof c.overrides === 'object' ? c.overrides : {}
    };
  }

  static validateContract(contract) {
    const errors = [];
    if (!contract.primary) errors.push('providers.primary is required');
    if (contract.routing && !ROUTING_STRATEGIES.includes(contract.routing))
      errors.push(`Invalid routing strategy "${contract.routing}". Must be: ${ROUTING_STRATEGIES.join(' | ')}`);
    if (contract.dataResidency && !DATA_RESIDENCY.includes(contract.dataResidency))
      errors.push(`Invalid dataResidency "${contract.dataResidency}". Must be: ${DATA_RESIDENCY.join(' | ')}`);
    return errors;
  }

  _providerId(spec) {
    if (!spec) return null;
    return spec.split('/')[0]; // "azure-openai/gpt-4o" → "azure-openai"
  }

  _modelId(spec) {
    if (!spec) return null;
    const parts = spec.split('/');
    return parts.length > 1 ? parts.slice(1).join('/') : parts[0];
  }

  // ── Data Residency Check ─────────────────────────────────────────────────

  _checkDataResidency(providerSpec) {
    if (this.contract.dataResidency === 'global') return true;
    const providerId = this._providerId(providerSpec);
    const catalog = PROVIDER_CATALOG[providerId];
    if (!catalog) return true; // Unknown provider — assume OK
    return catalog.dataResidency.includes(this.contract.dataResidency);
  }

  // ── Route Selection ───────────────────────────────────────────────────────

  /**
   * Select the best available provider for a request.
   * Returns the provider spec + model to use.
   */
  route(opts = {}) {
    const modality = opts.modality || 'text';
    const overrideSpec = this.contract.overrides[modality];
    const chain = overrideSpec ? [overrideSpec] : [this.contract.primary, ...this.contract.fallback];

    // Filter: available, not blocked, data residency compliant
    const candidates = chain
      .map(spec => ({ spec, providerId: this._providerId(spec), model: this._modelId(spec) }))
      .filter(c => {
        if (this.contract.blocked.includes(c.providerId)) { this._stats.blocked++; return false; }
        if (!this._checkDataResidency(c.spec)) return false;
        const health = this._health.get(c.providerId);
        if (health && health.circuitOpen) { this._stats.circuitBreaks++; return false; }
        return true;
      });

    if (candidates.length === 0) {
      return { ok: false, error: 'No available providers — all blocked, circuit-open, or data-residency restricted' };
    }

    // Apply routing strategy
    let selected;
    if (this.contract.routing === 'primary-only') {
      selected = candidates[0];
    } else if (this.contract.routing === 'round-robin') {
      selected = candidates[this._roundRobinIndex % candidates.length];
      this._roundRobinIndex++;
    } else if (this.contract.routing === 'latency-optimized') {
      selected = candidates.reduce((best, c) => {
        const health = this._health.get(c.providerId);
        const latency = health ? health.avgLatencyMs : 1000;
        const bestLatency = this._health.get(best.providerId)?.avgLatencyMs || 1000;
        return latency < bestLatency ? c : best;
      });
    } else if (this.contract.routing === 'cost-optimized') {
      selected = candidates.reduce((best, c) => {
        const ci = PROVIDER_CATALOG[c.providerId]?.costIndex ?? 1.0;
        const bci = PROVIDER_CATALOG[best.providerId]?.costIndex ?? 1.0;
        return ci < bci ? c : best;
      });
    } else {
      selected = candidates[0]; // Default: first available
    }

    const isFallback = selected !== candidates[0] || selected.spec !== this.contract.primary;
    if (isFallback) this._stats.fallbacks++;
    this._stats.routed++;

    this._routingLog.push({ timestamp: Date.now(), selected: selected.spec, routing: this.contract.routing });

    return {
      ok: true,
      provider: selected.providerId,
      model: selected.model,
      spec: selected.spec,
      isFallback,
      routing: this.contract.routing,
      dataResidency: this.contract.dataResidency
    };
  }

  // ── Health Reporting ──────────────────────────────────────────────────────

  recordSuccess(providerSpec, latencyMs) {
    const id = this._providerId(providerSpec);
    const health = this._health.get(id);
    if (health) health.recordSuccess(latencyMs);
  }

  recordFailure(providerSpec, error) {
    const id = this._providerId(providerSpec);
    const health = this._health.get(id);
    if (health) health.recordFailure(error);
  }

  healthReport() {
    const report = {};
    for (const [id, health] of this._health) report[id] = health.toJSON();
    return report;
  }

  stats() {
    return {
      playId: this.playId,
      contract: { primary: this.contract.primary, fallbackCount: this.contract.fallback.length,
        routing: this.contract.routing, dataResidency: this.contract.dataResidency },
      operations: this._stats,
      healthSummary: this.healthReport()
    };
  }
}

function createProviderEngine(manifest, playId) {
  const contract = manifest?.providers || {};
  const errors = ProviderAgilityEngine.validateContract(contract);
  if (errors.length > 0) throw new Error(`Invalid providers contract: ${errors.join('; ')}`);
  return new ProviderAgilityEngine(contract, playId || manifest?.play || 'unknown');
}

module.exports = { ProviderAgilityEngine, ProviderHealth, createProviderEngine, PROVIDER_CATALOG, ROUTING_STRATEGIES };
