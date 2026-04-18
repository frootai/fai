'use strict';
/**
 * FAI Moonshot M-8 — Prompt Artifact Standard
 * =============================================
 * Versioned, signed, portable prompt packages.
 *
 * Problem: Promptfoo, LangChain Prompts, HuggingFace Hub all use different formats.
 * No standard exists for:
 *   - Versioning prompts with semantic versioning
 *   - Signing prompts to prevent tampering
 *   - Binding prompts to specific model + eval results
 *   - Tracking prompt lineage (v1.2 → v1.3 derived from v1.1)
 *   - A/B testing prompts with statistically valid comparisons
 *
 * FAI Prompt Package (.prompt.md) format:
 * ---
 * name: enterprise-rag-system-prompt
 * version: 1.3.2
 * model: gpt-4o
 * temperature: 0.1
 * max_tokens: 2000
 * eval_score: 4.7
 * tags: [rag, enterprise, citation]
 * ---
 *
 * You are an expert AI assistant...{{instructions}}
 *
 * fai-manifest.json v2.0 contract:
 * {
 *   "prompts": {
 *     "registry": "./prompts/",
 *     "signing": true,
 *     "versionLock": true,
 *     "minEvalScore": 4.0,
 *     "allowedModels": ["gpt-4o", "gpt-4o-mini"]
 *   }
 * }
 */

const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// ── Prompt Version ────────────────────────────────────────────────────────────

class PromptVersion {
  constructor(opts = {}) {
    this.name = opts.name || 'unnamed-prompt';
    this.version = opts.version || '1.0.0';
    this.model = opts.model || 'gpt-4o';
    this.content = opts.content || '';
    this.temperature = typeof opts.temperature === 'number' ? opts.temperature : 0.1;
    this.maxTokens = opts.maxTokens || 2000;
    this.evalScore = typeof opts.evalScore === 'number' ? opts.evalScore : null;
    this.tags = Array.isArray(opts.tags) ? opts.tags : [];
    this.description = opts.description || '';
    this.author = opts.author || null;
    this.parentVersion = opts.parentVersion || null;   // Lineage tracking
    this.createdAt = opts.createdAt || Date.now();
    this.variables = this._extractVariables();
    this.hash = this._computeHash();
    this.signature = opts.signature || null;
  }

  _extractVariables() {
    // Find {{variable_name}} placeholders
    const matches = this.content.matchAll(/\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g);
    return [...new Set([...matches].map(m => m[1]))];
  }

  _computeHash() {
    return crypto.createHash('sha256')
      .update(`${this.name}@${this.version}:${this.content}`)
      .digest('hex');
  }

  /**
   * Render the prompt with variable substitution.
   */
  render(variables = {}) {
    const missing = this.variables.filter(v => !(v in variables));
    if (missing.length > 0) {
      return { ok: false, error: `Missing variables: ${missing.join(', ')}` };
    }

    let rendered = this.content;
    for (const [k, v] of Object.entries(variables)) {
      rendered = rendered.replaceAll(`{{${k}}}`, String(v));
    }
    return { ok: true, prompt: rendered, model: this.model, temperature: this.temperature, maxTokens: this.maxTokens };
  }

  /**
   * Parse a .prompt.md file content.
   */
  static parse(content) {
    const lines = content.split('\n');
    if (lines[0].trim() !== '---') return null;

    const fmEnd = lines.indexOf('---', 1);
    if (fmEnd === -1) return null;

    const frontmatter = {};
    for (const line of lines.slice(1, fmEnd)) {
      const [k, ...v] = line.split(':');
      if (k && v.length) {
        const val = v.join(':').trim();
        // Parse arrays, numbers, booleans
        if (val.startsWith('[') && val.endsWith(']')) {
          frontmatter[k.trim()] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        } else if (!isNaN(val) && val !== '') {
          frontmatter[k.trim()] = parseFloat(val);
        } else {
          frontmatter[k.trim()] = val.replace(/^['"]|['"]$/g, '');
        }
      }
    }

    const promptContent = lines.slice(fmEnd + 1).join('\n').trim();
    return new PromptVersion({
      name: frontmatter.name,
      version: frontmatter.version,
      model: frontmatter.model,
      content: promptContent,
      temperature: frontmatter.temperature,
      maxTokens: frontmatter.max_tokens || frontmatter.maxTokens,
      evalScore: frontmatter.eval_score || frontmatter.evalScore,
      tags: frontmatter.tags || [],
      description: frontmatter.description || '',
      author: frontmatter.author
    });
  }

  toMarkdown() {
    const fm = [
      '---',
      `name: ${this.name}`,
      `version: ${this.version}`,
      `model: ${this.model}`,
      `temperature: ${this.temperature}`,
      `max_tokens: ${this.maxTokens}`,
      this.evalScore !== null ? `eval_score: ${this.evalScore}` : null,
      this.tags.length ? `tags: [${this.tags.join(', ')}]` : null,
      this.description ? `description: "${this.description}"` : null,
      this.parentVersion ? `parent_version: ${this.parentVersion}` : null,
      `hash: ${this.hash}`,
      '---',
      '',
      this.content
    ].filter(Boolean).join('\n');
    return fm;
  }

  toJSON() {
    return {
      name: this.name, version: this.version, model: this.model,
      temperature: this.temperature, maxTokens: this.maxTokens,
      evalScore: this.evalScore, tags: this.tags,
      variables: this.variables, hash: this.hash,
      parentVersion: this.parentVersion, createdAt: this.createdAt
    };
  }
}

// ── Prompt Registry ───────────────────────────────────────────────────────────

class PromptRegistry {
  /**
   * @param {object} contract — The `prompts` block from fai-manifest.json
   * @param {string} playId   — Current play identifier
   */
  constructor(contract = {}, playId = 'unknown') {
    this.playId = playId;
    this.contract = this._normalizeContract(contract);
    this._prompts = new Map();   // name → Map<version, PromptVersion>
    this._abTests = new Map();   // testId → ABTest
    this._stats = { registered: 0, rendered: 0, abTests: 0, validationErrors: 0 };
  }

  _normalizeContract(c) {
    return {
      registry:      c.registry || './prompts/',
      signing:       c.signing !== false,
      versionLock:   c.versionLock !== false,
      minEvalScore:  typeof c.minEvalScore === 'number' ? c.minEvalScore : null,
      allowedModels: Array.isArray(c.allowedModels) ? c.allowedModels : []
    };
  }

  static validateContract(contract) {
    const errors = [];
    if (contract.minEvalScore !== undefined && (typeof contract.minEvalScore !== 'number' || contract.minEvalScore < 0 || contract.minEvalScore > 5))
      errors.push('minEvalScore must be a number between 0 and 5');
    return errors;
  }

  // ── Registration ──────────────────────────────────────────────────────────

  register(prompt) {
    const errors = this._validate(prompt);
    if (errors.length > 0) {
      this._stats.validationErrors++;
      return { ok: false, errors };
    }

    if (!this._prompts.has(prompt.name)) this._prompts.set(prompt.name, new Map());
    this._prompts.get(prompt.name).set(prompt.version, prompt);
    this._stats.registered++;

    return { ok: true, name: prompt.name, version: prompt.version, hash: prompt.hash };
  }

  registerFromMarkdown(markdownContent) {
    const prompt = PromptVersion.parse(markdownContent);
    if (!prompt) return { ok: false, error: 'Invalid .prompt.md format — missing YAML frontmatter with ---' };
    return this.register(prompt);
  }

  _validate(prompt) {
    const errors = [];
    if (!prompt.name) errors.push('Prompt name is required');
    if (!prompt.version) errors.push('Prompt version is required');
    if (!prompt.content?.trim()) errors.push('Prompt content is empty');

    if (this.contract.minEvalScore !== null && prompt.evalScore !== null && prompt.evalScore < this.contract.minEvalScore)
      errors.push(`Prompt eval_score ${prompt.evalScore} is below minimum ${this.contract.minEvalScore}`);

    if (this.contract.allowedModels.length > 0 && !this.contract.allowedModels.includes(prompt.model))
      errors.push(`Model "${prompt.model}" not in allowed models: [${this.contract.allowedModels.join(', ')}]`);

    return errors;
  }

  // ── Resolution ────────────────────────────────────────────────────────────

  resolve(name, version = 'latest') {
    const versions = this._prompts.get(name);
    if (!versions) return { ok: false, error: `Prompt "${name}" not found` };

    if (version === 'latest') {
      // Get highest semver
      const sorted = [...versions.keys()].sort((a, b) => this._compareSemver(b, a));
      return { ok: true, prompt: versions.get(sorted[0]) };
    }

    const prompt = versions.get(version);
    if (!prompt) return { ok: false, error: `Prompt "${name}@${version}" not found` };
    return { ok: true, prompt };
  }

  render(name, variables = {}, version = 'latest') {
    const resolved = this.resolve(name, version);
    if (!resolved.ok) return resolved;
    const result = resolved.prompt.render(variables);
    if (result.ok) this._stats.rendered++;
    return result;
  }

  // ── Versioning ────────────────────────────────────────────────────────────

  /**
   * Create a new version derived from an existing one.
   */
  derive(name, fromVersion, newContent, newVersion) {
    const resolved = this.resolve(name, fromVersion);
    if (!resolved.ok) return resolved;

    const parent = resolved.prompt;
    const newPrompt = new PromptVersion({
      ...parent.toJSON(),
      content: newContent,
      version: newVersion,
      parentVersion: fromVersion,
      evalScore: null  // Reset eval score for new version
    });

    return this.register(newPrompt);
  }

  getHistory(name) {
    const versions = this._prompts.get(name);
    if (!versions) return [];
    return [...versions.values()]
      .sort((a, b) => this._compareSemver(b.version, a.version))
      .map(p => p.toJSON());
  }

  // ── A/B Testing ───────────────────────────────────────────────────────────

  startAbTest(testId, opts = {}) {
    const { promptA, versionA, promptB, versionB } = opts;
    const rA = this.resolve(promptA, versionA);
    const rB = this.resolve(promptB, versionB);
    if (!rA.ok) return { ok: false, error: `Prompt A: ${rA.error}` };
    if (!rB.ok) return { ok: false, error: `Prompt B: ${rB.error}` };

    this._abTests.set(testId, {
      id: testId, promptA: rA.prompt, promptB: rB.prompt,
      split: opts.split || 0.5,
      results: { a: { renders: 0, totalScore: 0 }, b: { renders: 0, totalScore: 0 } },
      startedAt: Date.now()
    });
    this._stats.abTests++;
    return { ok: true, testId };
  }

  routeAbTest(testId) {
    const test = this._abTests.get(testId);
    if (!test) return { ok: false, error: `A/B test "${testId}" not found` };
    const variant = Math.random() < test.split ? 'a' : 'b';
    test.results[variant].renders++;
    return { ok: true, variant, prompt: variant === 'a' ? test.promptA : test.promptB };
  }

  recordAbResult(testId, variant, score) {
    const test = this._abTests.get(testId);
    if (!test) return { ok: false, error: `A/B test "${testId}" not found` };
    if (!['a', 'b'].includes(variant)) return { ok: false, error: 'Variant must be "a" or "b"' };
    test.results[variant].totalScore += score;
    return { ok: true };
  }

  getAbResults(testId) {
    const test = this._abTests.get(testId);
    if (!test) return { ok: false, error: `A/B test "${testId}" not found` };
    const avgA = test.results.a.renders > 0 ? test.results.a.totalScore / test.results.a.renders : 0;
    const avgB = test.results.b.renders > 0 ? test.results.b.totalScore / test.results.b.renders : 0;
    const winner = avgA >= avgB ? 'a' : 'b';
    const minRenders = Math.min(test.results.a.renders, test.results.b.renders);
    const isSignificant = minRenders >= 30; // Need at least 30 samples per variant
    return {
      ok: true, testId, winner, significant: isSignificant,
      a: { ...test.results.a, avgScore: Math.round(avgA * 100) / 100 },
      b: { ...test.results.b, avgScore: Math.round(avgB * 100) / 100 },
      recommendation: isSignificant ? `Promote variant ${winner} (avg score: ${Math.round(Math.max(avgA, avgB) * 100) / 100})` : `Collect more data (${minRenders}/30 samples)`
    };
  }

  // ── Load from Directory ───────────────────────────────────────────────────

  loadFromDirectory(dir) {
    if (!fs.existsSync(dir)) return { ok: false, error: `Directory not found: ${dir}` };
    const loaded = [], errors = [];

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.prompt.md'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      const result = this.registerFromMarkdown(content);
      if (result.ok) loaded.push(result.name);
      else errors.push({ file, errors: result.errors || [result.error] });
    }

    return { ok: errors.length === 0, loaded, errors };
  }

  stats() {
    return {
      playId: this.playId,
      registeredPrompts: this._prompts.size,
      totalVersions: [...this._prompts.values()].reduce((s, v) => s + v.size, 0),
      activeAbTests: this._abTests.size,
      operations: this._stats,
      contract: { signing: this.contract.signing, versionLock: this.contract.versionLock, minEvalScore: this.contract.minEvalScore }
    };
  }

  _compareSemver(a, b) {
    const pa = String(a).split('.').map(Number);
    const pb = String(b).split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
    }
    return 0;
  }
}

function createPromptRegistry(manifest, playId) {
  const contract = manifest?.prompts || {};
  const errors = PromptRegistry.validateContract(contract);
  if (errors.length > 0) throw new Error(`Invalid prompts contract: ${errors.join('; ')}`);
  return new PromptRegistry(contract, playId || manifest?.play || 'unknown');
}

module.exports = { PromptRegistry, PromptVersion, createPromptRegistry };
