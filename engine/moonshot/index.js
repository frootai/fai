'use strict';
/**
 * FAI Moonshot Engine — Index
 * ===========================
 * The FAI Protocol v2.0 moonshot contracts.
 * 10 unsolved infrastructure problems solved with declarative manifests.
 *
 * Usage:
 *   const moonshot = require('./engine/moonshot');
 *   const suite = moonshot.createMoonshotSuite(manifest);
 *   suite.memory.write('key', 'value', { agentId: 'my-agent' });
 *   suite.cost.record({ model: 'gpt-4o', promptTokens: 500, completionTokens: 200 });
 *
 * Or individual modules:
 *   const { createMemoryFederation } = require('./engine/moonshot/m1-memory-federation');
 */

const { MemoryFederation, createMemoryFederation }             = require('./m1-memory-federation');
const { ObservabilityEngine, createObservabilityEngine }       = require('./m2-observability');
const { CostAttributionEngine, createCostEngine }              = require('./m3-cost-attribution');
const { IdentityEngine, createIdentityEngine }                 = require('./m4-identity-trust');
const { ComplianceEngine, createComplianceEngine }             = require('./m5-compliance');
const { ProviderAgilityEngine, createProviderEngine }          = require('./m6-provider-agility');
const { MultiModalEngine, createMultiModalEngine }             = require('./m7-multimodal');
const { PromptRegistry, createPromptRegistry }                 = require('./m8-prompt-artifacts');
const { EvaluationEngine, createEvaluationEngine }             = require('./m9-evaluation-benchmark');
const { PrivacyConsentEngine, createPrivacyEngine }            = require('./m10-privacy-consent');

// ── Moonshot Suite ────────────────────────────────────────────────────────────

/**
 * Creates a complete FAI v2.0 moonshot suite from a fai-manifest.json.
 * Only initializes modules that have contracts declared in the manifest.
 *
 * @param {object} manifest  — Parsed fai-manifest.json (v2.0)
 * @param {object} opts      — Options: { playId, strict }
 * @returns {MoonshotSuite}
 */
function createMoonshotSuite(manifest, opts = {}) {
  const playId = opts.playId || manifest?.play || 'unknown';
  const strict = opts.strict === true;
  const suite = {};
  const errors = [];
  const initialized = [];

  const modules = [
    { key: 'memory',       contract: 'memory',       factory: createMemoryFederation,    label: 'M-1 Memory Federation' },
    { key: 'observability',contract: 'observability', factory: createObservabilityEngine, label: 'M-2 Observability' },
    { key: 'cost',         contract: 'cost',          factory: createCostEngine,          label: 'M-3 Cost Attribution' },
    { key: 'identity',     contract: 'identity',      factory: createIdentityEngine,      label: 'M-4 Identity & Trust' },
    { key: 'compliance',   contract: 'compliance',    factory: createComplianceEngine,    label: 'M-5 Compliance' },
    { key: 'providers',    contract: 'providers',     factory: createProviderEngine,      label: 'M-6 Provider Agility' },
    { key: 'modalities',   contract: 'modalities',    factory: createMultiModalEngine,    label: 'M-7 Multi-Modal' },
    { key: 'prompts',      contract: 'prompts',       factory: createPromptRegistry,      label: 'M-8 Prompt Artifacts' },
    { key: 'evaluation',   contract: 'evaluation',    factory: createEvaluationEngine,    label: 'M-9 Evaluation' },
    { key: 'privacy',      contract: 'privacy',       factory: createPrivacyEngine,       label: 'M-10 Privacy Consent' }
  ];

  for (const { key, contract, factory, label } of modules) {
    if (!manifest?.[contract] && !opts.initAll) continue; // Skip modules without contracts unless initAll

    try {
      suite[key] = factory(manifest, playId);
      initialized.push(label);
    } catch (err) {
      const error = `${label}: ${err.message}`;
      errors.push(error);
      if (strict) throw new Error(`Moonshot suite initialization failed — ${error}`);
    }
  }

  return new MoonshotSuite(suite, { playId, initialized, errors, manifest });
}

// ── Moonshot Suite Class ──────────────────────────────────────────────────────

class MoonshotSuite {
  constructor(modules, meta = {}) {
    this.memory = modules.memory || null;
    this.observability = modules.observability || null;
    this.cost = modules.cost || null;
    this.identity = modules.identity || null;
    this.compliance = modules.compliance || null;
    this.providers = modules.providers || null;
    this.modalities = modules.modalities || null;
    this.prompts = modules.prompts || null;
    this.evaluation = modules.evaluation || null;
    this.privacy = modules.privacy || null;

    this._playId = meta.playId || 'unknown';
    this._initialized = meta.initialized || [];
    this._errors = meta.errors || [];
    this._manifest = meta.manifest || null;
    this._createdAt = Date.now();
  }

  /**
   * Run pre-deployment checks across all active moonshot modules.
   * Returns a comprehensive readiness report.
   */
  preDeploymentCheck() {
    const report = {
      playId: this._playId,
      timestamp: new Date().toISOString(),
      initialized: this._initialized,
      initializationErrors: this._errors,
      checks: {}
    };

    // Compliance pre-deployment check
    if (this.compliance && this._manifest) {
      report.checks.compliance = this.compliance.preDeploymentCheck(this._manifest);
    }

    // Identity — ensure agents are registered
    if (this.identity) {
      report.checks.identity = {
        ok: true,
        registeredAgents: this.identity.stats().registeredAgents,
        message: 'Identity engine initialized'
      };
    }

    // Privacy — check data residency
    if (this.privacy) {
      report.checks.privacy = {
        ok: true,
        consentRequired: this.privacy.contract?.consentRequired,
        frameworks: this.privacy.contract?.frameworks,
        message: 'Privacy engine initialized'
      };
    }

    // Providers — check at least one provider is available
    if (this.providers) {
      const route = this.providers.route();
      report.checks.providers = { ok: route.ok, provider: route.provider, model: route.model, error: route.error };
    }

    const allPassed = Object.values(report.checks).every(c => c.ok !== false);
    report.ok = allPassed && this._errors.length === 0;
    report.summary = `${this._initialized.length} modules active | ${this._errors.length} errors | ${Object.keys(report.checks).length} checks run`;

    return report;
  }

  /**
   * Aggregate stats from all active modules.
   */
  stats() {
    const stats = {
      playId: this._playId,
      activeModules: this._initialized.length,
      initializationErrors: this._errors,
      createdAt: this._createdAt
    };

    if (this.memory) stats.memory = this.memory.stats();
    if (this.observability) stats.observability = this.observability.stats();
    if (this.cost) stats.cost = this.cost.stats();
    if (this.identity) stats.identity = this.identity.stats();
    if (this.compliance) stats.compliance = this.compliance.report();
    if (this.providers) stats.providers = this.providers.stats();
    if (this.modalities) stats.modalities = this.modalities.stats();
    if (this.prompts) stats.prompts = this.prompts.stats();
    if (this.evaluation) stats.evaluation = this.evaluation.stats();
    if (this.privacy) stats.privacy = this.privacy.stats();

    return stats;
  }

  /**
   * Validate a fai-manifest.json v2.0 against all moonshot contract schemas.
   */
  static validateManifest(manifest) {
    const errors = [];

    const validators = {
      memory:        m => MemoryFederation.validateContract(m?.memory || {}),
      observability: m => ObservabilityEngine.validateContract(m?.observability || {}),
      cost:          m => CostAttributionEngine.validateContract(m?.cost || {}),
      identity:      m => IdentityEngine.validateContract(m?.identity || {}),
      compliance:    m => ComplianceEngine.validateContract(m?.compliance || {}),
      providers:     m => ProviderAgilityEngine.validateContract(m?.providers || {}),
      modalities:    m => MultiModalEngine.validateContract(m?.modalities || {}),
      prompts:       m => PromptRegistry.validateContract(m?.prompts || {}),
      evaluation:    m => EvaluationEngine.validateContract(m?.evaluation || {}),
      privacy:       m => PrivacyConsentEngine.validateContract(m?.privacy || {})
    };

    for (const [contract, validate] of Object.entries(validators)) {
      if (!manifest?.[contract]) continue; // Skip absent contracts
      const contractErrors = validate(manifest);
      for (const err of contractErrors) {
        errors.push(`[${contract}] ${err}`);
      }
    }

    return { ok: errors.length === 0, errors };
  }

  shutdown() {
    if (this.observability) this.observability.shutdown();
  }
}

// ── V2 Manifest Schema Additions ──────────────────────────────────────────────

/**
 * The 10 new top-level fields for fai-manifest.json v2.0.
 * Add these to schemas/fai-manifest.schema.json.
 */
const MANIFEST_V2_SCHEMA = {
  memory: {
    type: 'object',
    description: 'M-1: Cross-agent memory federation contract',
    properties: {
      scope: { type: 'string', enum: ['play-local', 'session', 'shared', 'federated', 'global'] },
      backend: { type: 'string', enum: ['in-memory', 'redis', 'cosmos-db', 'postgres', 'custom'] },
      retention: { type: 'string', examples: ['1h', '1d', '90d', 'permanent'] },
      pii: { type: 'string', enum: ['allow', 'redact-before-store', 'block'] },
      encryption: { type: 'boolean' },
      maxSizeKB: { type: 'number' },
      eviction: { type: 'string', enum: ['lru', 'ttl', 'priority', 'none'] }
    }
  },
  observability: {
    type: 'object',
    description: 'M-2: Cross-agent distributed tracing contract',
    properties: {
      traceProvider: { type: 'string', enum: ['opentelemetry', 'langfuse', 'appinsights', 'datadog', 'console', 'none'] },
      correlationHeader: { type: 'string', default: 'x-fai-trace-id' },
      requiredMetrics: { type: 'array', items: { type: 'string' } },
      samplingRate: { type: 'number', minimum: 0, maximum: 1 }
    }
  },
  cost: {
    type: 'object',
    description: 'M-3: Recursive cost attribution contract',
    properties: {
      maxPerQuery: { type: 'number' },
      maxPerSession: { type: 'number' },
      maxPerDay: { type: 'number' },
      attribution: { type: 'string', enum: ['flat', 'recursive', 'proportional'] },
      alertAt: { type: 'number', minimum: 0, maximum: 1 },
      currency: { type: 'string', default: 'USD' }
    }
  },
  identity: {
    type: 'object',
    description: 'M-4: Agent DID identity and capability tokens',
    properties: {
      issuer: { type: 'string' },
      capabilities: { type: 'array', items: { type: 'string' } },
      maxCallDepth: { type: 'integer', minimum: 1, maximum: 10 },
      revocable: { type: 'boolean' },
      tokenTtl: { type: 'string' }
    }
  },
  compliance: {
    type: 'object',
    description: 'M-5: Continuous compliance monitoring contract',
    properties: {
      frameworks: { type: 'array', items: { type: 'string', enum: ['GDPR', 'HIPAA', 'EU-AI-Act', 'SOC2', 'ISO27001', 'NIST-AI-RMF'] } },
      riskLevel: { type: 'string', enum: ['minimal', 'limited', 'high', 'unacceptable'] },
      preDeploymentChecks: { type: 'boolean' },
      auditTrail: { type: 'string', enum: ['immutable', 'mutable', 'none'] }
    }
  },
  providers: {
    type: 'object',
    description: 'M-6: Provider agility and fallback chains',
    required: ['primary'],
    properties: {
      primary: { type: 'string', examples: ['azure-openai/gpt-4o', 'openai/gpt-4o-mini'] },
      fallback: { type: 'array', items: { type: 'string' } },
      routing: { type: 'string', enum: ['cost-optimized', 'latency-optimized', 'quality-optimized', 'round-robin', 'primary-only'] },
      dataResidency: { type: 'string', enum: ['eu', 'us', 'global', 'local'] }
    }
  },
  modalities: {
    type: 'object',
    description: 'M-7: Multi-modal agent chain contract',
    properties: {
      input: { type: 'array', items: { type: 'string', enum: ['text', 'image', 'audio', 'video', 'document', 'structured', 'json'] } },
      output: { type: 'array', items: { type: 'string', enum: ['text', 'json', 'image', 'audio', 'structured'] } },
      transforms: { type: 'object', additionalProperties: { type: 'string' } },
      maxFileSize: { type: 'string', examples: ['10MB', '100MB'] }
    }
  },
  prompts: {
    type: 'object',
    description: 'M-8: Prompt artifact versioning contract',
    properties: {
      registry: { type: 'string' },
      signing: { type: 'boolean' },
      versionLock: { type: 'boolean' },
      minEvalScore: { type: 'number', minimum: 0, maximum: 5 },
      allowedModels: { type: 'array', items: { type: 'string' } }
    }
  },
  evaluation: {
    type: 'object',
    description: 'M-9: Reproducible evaluation benchmark contract',
    properties: {
      goldenSet: { type: 'string' },
      metrics: { type: 'array', items: { type: 'string' } },
      weights: { type: 'object', additionalProperties: { type: 'number' } },
      thresholds: { type: 'object', additionalProperties: { type: 'number' } },
      regressionGate: { type: 'boolean' }
    }
  },
  privacy: {
    type: 'object',
    description: 'M-10: Privacy consent protocol',
    properties: {
      dataResidency: { type: 'string', enum: ['eu-west', 'eu-central', 'us-east', 'us-west', 'ap-southeast', 'global'] },
      consentRequired: { type: 'boolean' },
      rightToDeletion: { type: 'string', enum: ['automated', 'manual', 'none'] },
      piiCategories: { type: 'array', items: { type: 'string' } },
      frameworks: { type: 'array', items: { type: 'string', enum: ['GDPR', 'CCPA', 'HIPAA'] } },
      anonymization: { type: 'string', enum: ['redact', 'pseudonymize', 'none'] }
    }
  }
};

module.exports = {
  // Individual module factories
  createMemoryFederation,
  createObservabilityEngine,
  createCostEngine,
  createIdentityEngine,
  createComplianceEngine,
  createProviderEngine,
  createMultiModalEngine,
  createPromptRegistry,
  createEvaluationEngine,
  createPrivacyEngine,

  // Classes (for instanceof checks and extension)
  MemoryFederation,
  ObservabilityEngine,
  CostAttributionEngine,
  IdentityEngine,
  ComplianceEngine,
  ProviderAgilityEngine,
  MultiModalEngine,
  PromptRegistry,
  EvaluationEngine,
  PrivacyConsentEngine,

  // Suite
  createMoonshotSuite,
  MoonshotSuite,

  // Schema additions for fai-manifest.json v2.0
  MANIFEST_V2_SCHEMA
};
