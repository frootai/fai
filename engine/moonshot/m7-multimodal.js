'use strict';
/**
 * FAI Moonshot M-7 — Multi-Modal Agent Chains
 * ============================================
 * Standard for composing agents that operate across modalities.
 *
 * Problem: GPT-4o handles text+image for ONE agent, but NO standard exists for:
 *   - Declaring which modalities an agent accepts/produces
 *   - Routing an image from Agent A to Agent B that expects text
 *   - Negotiating format transforms between agents (image→caption→summary)
 *   - Building chains where modalities change at each step
 *
 * fai-manifest.json v2.0 contract:
 * {
 *   "modalities": {
 *     "input": ["text", "image", "audio", "video", "document", "structured"],
 *     "output": ["text", "json", "image", "audio", "structured"],
 *     "transforms": {
 *       "image→text": "gpt-4o-vision",
 *       "audio→text": "whisper",
 *       "text→audio": "tts-hd",
 *       "document→text": "document-intelligence"
 *     },
 *     "maxFileSize": "10MB",
 *     "supportedFormats": { "image": ["jpg", "png", "webp"], "audio": ["mp3", "wav"] }
 *   }
 * }
 */

// ── Modality Definitions ──────────────────────────────────────────────────────

const MODALITIES = {
  text:       { mimeTypes: ['text/plain', 'text/markdown', 'text/html'], maxSizeBytes: 1_000_000 },
  image:      { mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], maxSizeBytes: 20_000_000 },
  audio:      { mimeTypes: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'], maxSizeBytes: 25_000_000 },
  video:      { mimeTypes: ['video/mp4', 'video/webm'], maxSizeBytes: 100_000_000 },
  document:   { mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], maxSizeBytes: 50_000_000 },
  structured: { mimeTypes: ['application/json', 'text/csv', 'application/xml'], maxSizeBytes: 10_000_000 },
  json:       { mimeTypes: ['application/json'], maxSizeBytes: 10_000_000 }
};

// Built-in transform providers
const TRANSFORM_PROVIDERS = {
  'image→text':      { provider: 'gpt-4o-vision', latencyMs: 2000 },
  'image→json':      { provider: 'gpt-4o-vision', latencyMs: 2000 },
  'audio→text':      { provider: 'azure-whisper', latencyMs: 3000 },
  'text→audio':      { provider: 'azure-tts-hd', latencyMs: 1500 },
  'document→text':   { provider: 'azure-document-intelligence', latencyMs: 5000 },
  'document→json':   { provider: 'azure-document-intelligence', latencyMs: 5000 },
  'video→text':      { provider: 'azure-video-indexer', latencyMs: 30000 },
  'structured→text': { provider: 'inline-serializer', latencyMs: 10 },
  'text→json':       { provider: 'gpt-4o-mini-json', latencyMs: 1000 },
  'json→text':       { provider: 'inline-serializer', latencyMs: 10 }
};

// ── Modal Artifact ────────────────────────────────────────────────────────────

class ModalArtifact {
  constructor(opts = {}) {
    this.id = opts.id || `artifact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.modality = opts.modality || 'text';
    this.content = opts.content;             // The actual content (Buffer, string, object)
    this.mimeType = opts.mimeType || MODALITIES[this.modality]?.mimeTypes[0] || 'text/plain';
    this.sizeBytes = opts.sizeBytes || (typeof opts.content === 'string' ? Buffer.byteLength(opts.content) : 0);
    this.format = opts.format || null;       // E.g., "jpg" for image
    this.metadata = opts.metadata || {};
    this.transformedFrom = opts.transformedFrom || null;  // Which artifact was this transformed from
    this.transformProvider = opts.transformProvider || null;
    this.createdAt = Date.now();
  }

  validate(allowedModalities = []) {
    const errors = [];
    if (!MODALITIES[this.modality]) errors.push(`Unknown modality "${this.modality}"`);
    if (allowedModalities.length > 0 && !allowedModalities.includes(this.modality))
      errors.push(`Modality "${this.modality}" not in allowed set: [${allowedModalities.join(', ')}]`);
    const maxSize = MODALITIES[this.modality]?.maxSizeBytes;
    if (maxSize && this.sizeBytes > maxSize)
      errors.push(`Artifact size ${this.sizeBytes} exceeds max ${maxSize} for modality "${this.modality}"`);
    return errors;
  }

  toJSON() {
    return {
      id: this.id, modality: this.modality, mimeType: this.mimeType,
      sizeBytes: this.sizeBytes, format: this.format,
      transformedFrom: this.transformedFrom, transformProvider: this.transformProvider,
      createdAt: this.createdAt
    };
  }
}

// ── Multi-Modal Engine ────────────────────────────────────────────────────────

class MultiModalEngine {
  /**
   * @param {object} contract — The `modalities` block from fai-manifest.json
   * @param {string} playId   — Current play identifier
   */
  constructor(contract = {}, playId = 'unknown') {
    this.playId = playId;
    this.contract = this._normalizeContract(contract);
    this._transforms = new Map();   // "from→to" → transform function
    this._stats = { artifacts: 0, transforms: 0, rejected: 0, chainSteps: 0 };
    this._registerTransforms();
  }

  _normalizeContract(c) {
    return {
      input:            Array.isArray(c.input) ? c.input.filter(m => MODALITIES[m]) : ['text'],
      output:           Array.isArray(c.output) ? c.output.filter(m => MODALITIES[m]) : ['text', 'json'],
      transforms:       typeof c.transforms === 'object' ? c.transforms : {},
      maxFileSizeBytes: this._parseSize(c.maxFileSize || '10MB'),
      supportedFormats: typeof c.supportedFormats === 'object' ? c.supportedFormats : {}
    };
  }

  static validateContract(contract) {
    const errors = [];
    for (const m of [...(contract.input || []), ...(contract.output || [])]) {
      if (!MODALITIES[m]) errors.push(`Unknown modality "${m}"`);
    }
    return errors;
  }

  _registerTransforms() {
    // Register built-in transforms
    for (const [key, meta] of Object.entries(TRANSFORM_PROVIDERS)) {
      this._transforms.set(key, { provider: meta.provider, latencyMs: meta.latencyMs, builtin: true });
    }

    // Override/extend with contract-defined transforms
    for (const [key, provider] of Object.entries(this.contract.transforms)) {
      this._transforms.set(key, { provider, latencyMs: 1000, builtin: false, custom: true });
    }
  }

  // ── Validation ────────────────────────────────────────────────────────────

  canAccept(modality) { return this.contract.input.includes(modality); }
  canProduce(modality) { return this.contract.output.includes(modality); }

  canTransform(fromModality, toModality) {
    const key = `${fromModality}→${toModality}`;
    return this._transforms.has(key) || fromModality === toModality;
  }

  /**
   * Validate an incoming artifact against this agent's input contract.
   */
  validateInput(artifact) {
    const errors = artifact.validate(this.contract.input);
    if (artifact.sizeBytes > this.contract.maxFileSizeBytes)
      errors.push(`File size ${artifact.sizeBytes} exceeds max ${this.contract.maxFileSizeBytes}`);
    return { ok: errors.length === 0, errors };
  }

  // ── Transform ─────────────────────────────────────────────────────────────

  /**
   * Plan a transformation chain from source modality to target modality.
   * Returns the sequence of transforms needed.
   */
  planTransform(fromModality, toModality) {
    if (fromModality === toModality) return { ok: true, steps: [], direct: true };

    const directKey = `${fromModality}→${toModality}`;
    if (this._transforms.has(directKey)) {
      return { ok: true, steps: [{ from: fromModality, to: toModality, provider: this._transforms.get(directKey).provider }] };
    }

    // Try 2-hop through 'text' as universal intermediate
    if (fromModality !== 'text' && toModality !== 'text') {
      const toText = `${fromModality}→text`;
      const fromText = `text→${toModality}`;
      if (this._transforms.has(toText) && this._transforms.has(fromText)) {
        return {
          ok: true,
          steps: [
            { from: fromModality, to: 'text', provider: this._transforms.get(toText).provider },
            { from: 'text', to: toModality, provider: this._transforms.get(fromText).provider }
          ]
        };
      }
    }

    return { ok: false, error: `No transform path from "${fromModality}" to "${toModality}"` };
  }

  /**
   * Apply a transform to an artifact.
   * In production this would call the actual provider (Whisper, GPT-4V, etc).
   * Here: produces a transformed artifact with correct metadata.
   */
  async transform(artifact, toModality, opts = {}) {
    const plan = this.planTransform(artifact.modality, toModality);
    if (!plan.ok) {
      this._stats.rejected++;
      return { ok: false, error: plan.error };
    }

    if (plan.direct) {
      return { ok: true, artifact, transformed: false };
    }

    let current = artifact;
    for (const step of plan.steps) {
      const transformed = new ModalArtifact({
        modality: step.to,
        content: opts.mockContent || `[transformed from ${step.from} to ${step.to} via ${step.provider}]`,
        sizeBytes: typeof opts.mockContent === 'string' ? Buffer.byteLength(opts.mockContent) : 100,
        transformedFrom: current.id,
        transformProvider: step.provider,
        metadata: { ...current.metadata, transformStep: `${step.from}→${step.to}` }
      });
      current = transformed;
      this._stats.transforms++;
    }

    return { ok: true, artifact: current, transformed: true, steps: plan.steps };
  }

  // ── Multi-Agent Chain Composition ────────────────────────────────────────

  /**
   * Validate a chain of agents' modality contracts are compatible.
   * E.g., Agent 1 outputs "image", Agent 2 inputs "text" — is there a transform?
   */
  validateChain(agents) {
    const issues = [];
    for (let i = 0; i < agents.length - 1; i++) {
      const current = agents[i];
      const next = agents[i + 1];

      for (const outputModality of (current.output || ['text'])) {
        if (!(next.input || ['text']).includes(outputModality)) {
          // Can we transform?
          const canTransform = this.canTransform(outputModality, (next.input || ['text'])[0]);
          if (!canTransform) {
            issues.push({
              from: current.agentId || `agent-${i}`,
              to: next.agentId || `agent-${i + 1}`,
              outputModality,
              requiredInput: (next.input || ['text'])[0],
              error: `No transform path from "${outputModality}" to "${(next.input || ['text'])[0]}"`
            });
          }
        }
      }
    }
    return { ok: issues.length === 0, issues };
  }

  stats() {
    return {
      playId: this.playId,
      contract: {
        inputModalities: this.contract.input,
        outputModalities: this.contract.output,
        customTransforms: Object.keys(this.contract.transforms).length,
        maxFileSizeMB: Math.round(this.contract.maxFileSizeBytes / 1_000_000)
      },
      availableTransforms: Array.from(this._transforms.keys()),
      operations: this._stats
    };
  }

  _parseSize(size) {
    const m = String(size).match(/^(\d+(?:\.\d+)?)(KB|MB|GB)$/i);
    if (!m) return 10_000_000;
    const n = parseFloat(m[1]);
    return Math.round(n * { kb: 1024, mb: 1_048_576, gb: 1_073_741_824 }[m[2].toLowerCase()]);
  }
}

function createMultiModalEngine(manifest, playId) {
  const contract = manifest?.modalities || {};
  const errors = MultiModalEngine.validateContract(contract);
  if (errors.length > 0) throw new Error(`Invalid modalities contract: ${errors.join('; ')}`);
  return new MultiModalEngine(contract, playId || manifest?.play || 'unknown');
}

module.exports = { MultiModalEngine, ModalArtifact, createMultiModalEngine, MODALITIES, TRANSFORM_PROVIDERS };
