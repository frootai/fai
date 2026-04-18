'use strict';
/**
 * FAI Moonshot M-2 — Cross-Agent Observability
 * ==============================================
 * The first universal standard for distributed tracing across AI agent boundaries.
 *
 * Problem: Single-agent tracing works (Langfuse, AppInsights, LangSmith).
 * But when Agent A calls Agent B calls Agent C, there is NO standard for:
 *   - Correlating traces across agent boundaries
 *   - Propagating context (trace ID, span ID, baggage) through LLM calls
 *   - Aggregating metrics (latency, tokens, cost, groundedness) per agent
 *   - Emitting to OpenTelemetry-compatible collectors
 *
 * FAI Solution: The `observability` contract in fai-manifest.json declares
 * the trace topology. This engine enforces it at runtime.
 *
 * fai-manifest.json v2.0 contract:
 * {
 *   "observability": {
 *     "traceProvider": "opentelemetry" | "langfuse" | "appinsights" | "console",
 *     "correlationHeader": "x-fai-trace-id",
 *     "requiredMetrics": ["latency", "tokens", "cost", "groundedness", "safety"],
 *     "samplingRate": 1.0,
 *     "redactPii": true,
 *     "exportInterval": "10s",
 *     "endpoint": "https://otel-collector.yourdomain.com/v1/traces"
 *   }
 * }
 */

const crypto = require('crypto');

// ── Constants ────────────────────────────────────────────────────────────────

const TRACE_PROVIDERS = ['opentelemetry', 'langfuse', 'appinsights', 'datadog', 'console', 'none'];

const METRIC_TYPES = {
  latency:      { unit: 'ms',    type: 'histogram', description: 'Time from first token to last token' },
  ttft:         { unit: 'ms',    type: 'histogram', description: 'Time to first token' },
  tokens:       { unit: 'count', type: 'counter',   description: 'Total tokens (prompt + completion)' },
  cost:         { unit: 'usd',   type: 'counter',   description: 'USD cost of the operation' },
  groundedness: { unit: 'score', type: 'gauge',     description: 'Groundedness score (0-1)' },
  safety:       { unit: 'score', type: 'gauge',     description: 'Content safety score (0=safe)' },
  coherence:    { unit: 'score', type: 'gauge',     description: 'Response coherence score (0-1)' },
  retrieval:    { unit: 'count', type: 'counter',   description: 'Documents retrieved from RAG' },
  toolCalls:    { unit: 'count', type: 'counter',   description: 'Total tool/function calls made' },
  retries:      { unit: 'count', type: 'counter',   description: 'Retry attempts made' }
};

// ── Span ─────────────────────────────────────────────────────────────────────

class Span {
  constructor(opts = {}) {
    this.traceId = opts.traceId || crypto.randomBytes(16).toString('hex');
    this.spanId = crypto.randomBytes(8).toString('hex');
    this.parentSpanId = opts.parentSpanId || null;
    this.name = opts.name || 'unknown';
    this.kind = opts.kind || 'internal'; // 'server' | 'client' | 'producer' | 'consumer' | 'internal'
    this.startTime = opts.startTime || Date.now();
    this.endTime = null;
    this.status = 'ok'; // 'ok' | 'error' | 'unset'
    this.attributes = opts.attributes || {};
    this.events = [];
    this.links = [];
    this.metrics = {};
    this.agentId = opts.agentId || null;
    this.playId = opts.playId || null;
    this.primitiveType = opts.primitiveType || null; // 'agent' | 'skill' | 'hook' | 'tool'
  }

  setAttribute(key, value) {
    this.attributes[key] = value;
    return this;
  }

  setAttributes(attrs) {
    Object.assign(this.attributes, attrs);
    return this;
  }

  addEvent(name, attrs = {}) {
    this.events.push({ name, timestamp: Date.now(), attributes: attrs });
    return this;
  }

  recordMetric(name, value) {
    if (!METRIC_TYPES[name]) {
      this.metrics[name] = value;
      return this;
    }
    this.metrics[name] = { value, unit: METRIC_TYPES[name].unit, type: METRIC_TYPES[name].type };
    return this;
  }

  setError(error) {
    this.status = 'error';
    this.attributes['error.type'] = error.constructor?.name || 'Error';
    this.attributes['error.message'] = error.message;
    this.attributes['error.stack'] = error.stack?.split('\n').slice(0, 5).join('\n');
    this.addEvent('exception', { 'exception.message': error.message });
    return this;
  }

  end(endTime) {
    this.endTime = endTime || Date.now();
    return this;
  }

  get duration() {
    if (!this.endTime) return Date.now() - this.startTime;
    return this.endTime - this.startTime;
  }

  /** Generate W3C traceparent header for propagation to child agents */
  traceparent() {
    return `00-${this.traceId}-${this.spanId}-01`;
  }

  /** FAI-specific correlation header */
  correlationHeader(headerName = 'x-fai-trace-id') {
    return {
      [headerName]: this.traceId,
      'x-fai-span-id': this.spanId,
      'x-fai-play-id': this.playId || '',
      'x-fai-agent-id': this.agentId || '',
      'traceparent': this.traceparent()
    };
  }

  toJSON() {
    return {
      traceId: this.traceId,
      spanId: this.spanId,
      parentSpanId: this.parentSpanId,
      name: this.name,
      kind: this.kind,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.duration,
      status: this.status,
      attributes: this.attributes,
      events: this.events,
      metrics: this.metrics,
      agentId: this.agentId,
      playId: this.playId,
      primitiveType: this.primitiveType
    };
  }
}

// ── Trace ────────────────────────────────────────────────────────────────────

class Trace {
  constructor(traceId, opts = {}) {
    this.traceId = traceId || crypto.randomBytes(16).toString('hex');
    this.playId = opts.playId || null;
    this.sessionId = opts.sessionId || null;
    this.userId = opts.userId || null;
    this.spans = new Map();
    this.rootSpanId = null;
    this.startTime = Date.now();
    this.endTime = null;
    this.metadata = opts.metadata || {};
  }

  addSpan(span) {
    this.spans.set(span.spanId, span);
    if (!span.parentSpanId) this.rootSpanId = span.spanId;
    return span;
  }

  getSpan(spanId) {
    return this.spans.get(spanId);
  }

  end() {
    this.endTime = Date.now();
    return this;
  }

  /** Aggregate metrics across all spans */
  aggregatedMetrics() {
    const agg = {
      totalLatency: 0, maxLatency: 0,
      totalTokens: 0, totalCost: 0, totalToolCalls: 0, totalRetries: 0,
      avgGroundedness: null, avgSafety: null,
      spanCount: this.spans.size, agentCount: new Set(), primitiveTypes: {}
    };

    const groundednessScores = [], safetyScores = [];

    for (const span of this.spans.values()) {
      agg.totalLatency += span.duration;
      agg.maxLatency = Math.max(agg.maxLatency, span.duration);
      if (span.agentId) agg.agentCount.add(span.agentId);
      if (span.primitiveType) {
        agg.primitiveTypes[span.primitiveType] = (agg.primitiveTypes[span.primitiveType] || 0) + 1;
      }
      const m = span.metrics;
      if (m.tokens) agg.totalTokens += (typeof m.tokens === 'object' ? m.tokens.value : m.tokens);
      if (m.cost) agg.totalCost += (typeof m.cost === 'object' ? m.cost.value : m.cost);
      if (m.toolCalls) agg.totalToolCalls += (typeof m.toolCalls === 'object' ? m.toolCalls.value : m.toolCalls);
      if (m.retries) agg.totalRetries += (typeof m.retries === 'object' ? m.retries.value : m.retries);
      if (m.groundedness) groundednessScores.push(typeof m.groundedness === 'object' ? m.groundedness.value : m.groundedness);
      if (m.safety) safetyScores.push(typeof m.safety === 'object' ? m.safety.value : m.safety);
    }

    if (groundednessScores.length) agg.avgGroundedness = groundednessScores.reduce((a, b) => a + b, 0) / groundednessScores.length;
    if (safetyScores.length) agg.avgSafety = safetyScores.reduce((a, b) => a + b, 0) / safetyScores.length;
    agg.agentCount = agg.agentCount.size;
    agg.totalCost = Math.round(agg.totalCost * 100000) / 100000;

    return agg;
  }

  toJSON() {
    return {
      traceId: this.traceId,
      playId: this.playId,
      sessionId: this.sessionId,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.endTime ? this.endTime - this.startTime : Date.now() - this.startTime,
      spans: Array.from(this.spans.values()).map(s => s.toJSON()),
      aggregatedMetrics: this.aggregatedMetrics(),
      metadata: this.metadata
    };
  }
}

// ── Observability Engine ─────────────────────────────────────────────────────

class ObservabilityEngine {
  /**
   * @param {object} contract — The `observability` block from fai-manifest.json
   * @param {string} playId   — Current play identifier
   */
  constructor(contract = {}, playId = 'unknown') {
    this.playId = playId;
    this.contract = this._normalizeContract(contract);
    this._traces = new Map();           // traceId → Trace
    this._exportQueue = [];
    this._exportTimer = null;
    this._stats = { tracesCreated: 0, spansCreated: 0, exported: 0, exportErrors: 0 };
    this._requiredMetricSet = new Set(this.contract.requiredMetrics);

    if (this.contract.traceProvider !== 'none') {
      this._startExportTimer();
    }
  }

  _normalizeContract(c) {
    return {
      traceProvider:   TRACE_PROVIDERS.includes(c.traceProvider) ? c.traceProvider : 'console',
      correlationHeader: c.correlationHeader || 'x-fai-trace-id',
      requiredMetrics: Array.isArray(c.requiredMetrics) ? c.requiredMetrics : ['latency', 'tokens', 'cost'],
      samplingRate:    typeof c.samplingRate === 'number' ? Math.min(1, Math.max(0, c.samplingRate)) : 1.0,
      redactPii:       c.redactPii !== false,
      exportInterval:  c.exportInterval || '30s',
      endpoint:        c.endpoint || null
    };
  }

  static validateContract(contract) {
    const errors = [];
    if (contract.traceProvider && !TRACE_PROVIDERS.includes(contract.traceProvider))
      errors.push(`Invalid traceProvider "${contract.traceProvider}". Must be one of: ${TRACE_PROVIDERS.join(', ')}`);
    if (contract.samplingRate !== undefined && (typeof contract.samplingRate !== 'number' || contract.samplingRate < 0 || contract.samplingRate > 1))
      errors.push('samplingRate must be a number between 0 and 1');
    if (contract.requiredMetrics) {
      for (const m of contract.requiredMetrics) {
        if (!METRIC_TYPES[m]) errors.push(`Unknown required metric "${m}". Known: ${Object.keys(METRIC_TYPES).join(', ')}`);
      }
    }
    return errors;
  }

  // ── Sampling ─────────────────────────────────────────────────────────────

  _shouldSample() {
    if (this.contract.samplingRate >= 1.0) return true;
    return Math.random() < this.contract.samplingRate;
  }

  // ── Trace lifecycle ──────────────────────────────────────────────────────

  /**
   * Start a new trace for a play execution.
   */
  startTrace(opts = {}) {
    if (!this._shouldSample()) {
      return { sampled: false, trace: null, span: null };
    }

    const trace = new Trace(opts.traceId, {
      playId: opts.playId || this.playId,
      sessionId: opts.sessionId,
      userId: opts.userId,
      metadata: opts.metadata || {}
    });

    this._traces.set(trace.traceId, trace);
    this._stats.tracesCreated++;

    // Create root span
    const rootSpan = this.startSpan(`play:${this.playId}`, {
      traceId: trace.traceId,
      kind: 'server',
      agentId: opts.agentId,
      playId: this.playId,
      attributes: { 'fai.play': this.playId, 'fai.version': '2.0', ...opts.attributes }
    });

    return { sampled: true, trace, span: rootSpan };
  }

  /**
   * Start a span (for an agent, skill, hook, or tool call).
   */
  startSpan(name, opts = {}) {
    const span = new Span({
      traceId: opts.traceId,
      parentSpanId: opts.parentSpanId,
      name,
      kind: opts.kind || 'internal',
      agentId: opts.agentId,
      playId: opts.playId || this.playId,
      primitiveType: opts.primitiveType,
      attributes: opts.attributes || {}
    });

    span.setAttribute('fai.play.id', this.playId);
    if (opts.agentId) span.setAttribute('fai.agent.id', opts.agentId);

    const trace = this._traces.get(opts.traceId);
    if (trace) trace.addSpan(span);

    this._stats.spansCreated++;
    return span;
  }

  /**
   * End a span and validate required metrics.
   */
  endSpan(span, result = {}) {
    span.end();

    // Record result metrics
    if (result.latency !== undefined) span.recordMetric('latency', result.latency);
    if (result.tokens !== undefined) span.recordMetric('tokens', result.tokens);
    if (result.cost !== undefined) span.recordMetric('cost', result.cost);
    if (result.groundedness !== undefined) span.recordMetric('groundedness', result.groundedness);
    if (result.safety !== undefined) span.recordMetric('safety', result.safety);
    if (result.error) span.setError(result.error);

    // Check required metrics
    const missingMetrics = [];
    for (const metric of this._requiredMetricSet) {
      if (!(metric in span.metrics)) missingMetrics.push(metric);
    }
    if (missingMetrics.length > 0) {
      span.addEvent('warning:missing-metrics', { metrics: missingMetrics.join(',') });
    }

    return span;
  }

  /**
   * Extract trace context from incoming headers (cross-agent correlation).
   */
  extractContext(headers) {
    const h = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));

    // W3C traceparent: 00-traceId-spanId-flags
    if (h['traceparent']) {
      const parts = h['traceparent'].split('-');
      if (parts.length === 4) {
        return { traceId: parts[1], parentSpanId: parts[2] };
      }
    }

    // FAI correlation header
    const corrHeader = this.contract.correlationHeader.toLowerCase();
    if (h[corrHeader]) {
      return { traceId: h[corrHeader], parentSpanId: h['x-fai-span-id'] || null };
    }

    return null;
  }

  /**
   * Inject trace context into outgoing headers (for sub-agent calls).
   */
  injectContext(span) {
    return span.correlationHeader(this.contract.correlationHeader);
  }

  // ── Export ───────────────────────────────────────────────────────────────

  _startExportTimer() {
    const intervalMs = this._parseInterval(this.contract.exportInterval);
    this._exportTimer = setInterval(() => this._flush(), intervalMs);
    if (this._exportTimer.unref) this._exportTimer.unref(); // Don't keep Node.js alive
  }

  _flush() {
    if (this._exportQueue.length === 0) return;
    const batch = this._exportQueue.splice(0);

    if (this.contract.traceProvider === 'console') {
      for (const trace of batch) {
        const agg = trace.aggregatedMetrics();
        console.log(`[FAI Trace] ${trace.traceId.slice(0, 8)} | play=${this.playId} | spans=${agg.spanCount} | agents=${agg.agentCount} | latency=${agg.totalLatency}ms | tokens=${agg.totalTokens} | cost=$${agg.totalCost}`);
      }
    }
    // For opentelemetry/langfuse/appinsights: would POST to endpoint
    this._stats.exported += batch.length;
  }

  /**
   * Manually flush a completed trace to export queue.
   */
  flushTrace(traceId) {
    const trace = this._traces.get(traceId);
    if (!trace) return { ok: false, error: 'Trace not found' };
    trace.end();
    this._exportQueue.push(trace);
    this._flush();
    return { ok: true, traceId, spans: trace.spans.size };
  }

  // ── Query ────────────────────────────────────────────────────────────────

  getTrace(traceId) { return this._traces.get(traceId) || null; }

  listTraces(filter = {}) {
    const results = [];
    for (const trace of this._traces.values()) {
      if (filter.playId && trace.playId !== filter.playId) continue;
      results.push({ traceId: trace.traceId, playId: trace.playId, spanCount: trace.spans.size, startTime: trace.startTime });
    }
    return results;
  }

  stats() {
    return {
      playId: this.playId,
      contract: {
        traceProvider: this.contract.traceProvider,
        correlationHeader: this.contract.correlationHeader,
        requiredMetrics: this.contract.requiredMetrics,
        samplingRate: this.contract.samplingRate,
        redactPii: this.contract.redactPii
      },
      traces: this._stats.tracesCreated,
      spans: this._stats.spansCreated,
      exported: this._stats.exported,
      queued: this._exportQueue.length,
      activeTraces: this._traces.size
    };
  }

  shutdown() {
    if (this._exportTimer) clearInterval(this._exportTimer);
    this._flush();
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  _parseInterval(interval) {
    const m = String(interval).match(/^(\d+)(s|m|h)$/);
    if (!m) return 30000;
    const n = parseInt(m[1]);
    return n * ({ s: 1000, m: 60000, h: 3600000 }[m[2]]);
  }
}

// ── Factory ──────────────────────────────────────────────────────────────────

function createObservabilityEngine(manifest, playId) {
  const contract = manifest?.observability || {};
  const errors = ObservabilityEngine.validateContract(contract);
  if (errors.length > 0) {
    throw new Error(`Invalid observability contract: ${errors.join('; ')}`);
  }
  return new ObservabilityEngine(contract, playId || manifest?.play || 'unknown');
}

module.exports = { ObservabilityEngine, Span, Trace, createObservabilityEngine, METRIC_TYPES, TRACE_PROVIDERS };
