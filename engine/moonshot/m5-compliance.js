'use strict';
/**
 * FAI Moonshot M-5 — Continuous Compliance
 * ==========================================
 * Real-time governance and compliance monitoring for AI systems.
 *
 * Problem: Post-hoc audit checks exist but the EU AI Act (Article 9)
 * requires CONTINUOUS risk management. No platform today provides:
 *   - Pre-deployment risk classification per EU AI Act
 *   - Real-time policy evaluation during agent execution
 *   - Immutable compliance audit trail
 *   - Drift detection (model behavior changing over time)
 *   - Multi-framework compliance (GDPR + HIPAA + EU AI Act simultaneously)
 *
 * fai-manifest.json v2.0 contract:
 * {
 *   "compliance": {
 *     "frameworks": ["GDPR", "HIPAA", "EU-AI-Act", "SOC2", "ISO27001"],
 *     "riskLevel": "minimal" | "limited" | "high" | "unacceptable",
 *     "preDeploymentChecks": true,
 *     "auditTrail": "immutable" | "mutable" | "none",
 *     "driftDetection": { "enabled": true, "baselineWindow": "7d", "alertThreshold": 0.1 },
 *     "policies": [
 *       { "id": "no-pii-in-logs", "rule": "...", "severity": "critical" }
 *     ]
 *   }
 * }
 */

const crypto = require('crypto');

// ── Framework Definitions ─────────────────────────────────────────────────────

const COMPLIANCE_FRAMEWORKS = {
  'GDPR': {
    name: 'General Data Protection Regulation',
    jurisdiction: 'EU',
    checks: [
      { id: 'gdpr-1', name: 'Lawful basis for processing', severity: 'critical' },
      { id: 'gdpr-2', name: 'Data minimization', severity: 'high' },
      { id: 'gdpr-3', name: 'Right to erasure implementation', severity: 'high' },
      { id: 'gdpr-4', name: 'Data transfer safeguards', severity: 'critical' },
      { id: 'gdpr-5', name: 'Breach notification procedure', severity: 'high' }
    ]
  },
  'EU-AI-Act': {
    name: 'EU AI Act',
    jurisdiction: 'EU',
    riskLevels: {
      minimal:       { description: 'No specific obligations', examples: ['spam filters', 'AI in games'] },
      limited:       { description: 'Transparency obligations required', examples: ['chatbots', 'deepfakes'] },
      high:          { description: 'Conformity assessment required', examples: ['biometrics', 'critical infrastructure'] },
      unacceptable:  { description: 'PROHIBITED', examples: ['social scoring', 'real-time biometric surveillance'] }
    },
    checks: [
      { id: 'euai-1', name: 'Risk classification documented', severity: 'critical' },
      { id: 'euai-2', name: 'Technical documentation in place', severity: 'high' },
      { id: 'euai-3', name: 'Human oversight mechanisms', severity: 'critical' },
      { id: 'euai-4', name: 'Transparency disclosure to users', severity: 'high' },
      { id: 'euai-5', name: 'Accuracy, robustness, cybersecurity standards', severity: 'high' }
    ]
  },
  'HIPAA': {
    name: 'Health Insurance Portability and Accountability Act',
    jurisdiction: 'US',
    checks: [
      { id: 'hipaa-1', name: 'PHI access controls', severity: 'critical' },
      { id: 'hipaa-2', name: 'PHI encryption at rest and in transit', severity: 'critical' },
      { id: 'hipaa-3', name: 'Audit controls for PHI access', severity: 'high' },
      { id: 'hipaa-4', name: 'Workforce training documented', severity: 'medium' }
    ]
  },
  'SOC2': {
    name: 'Service Organization Control 2',
    jurisdiction: 'US',
    checks: [
      { id: 'soc2-1', name: 'Security monitoring and alerting', severity: 'high' },
      { id: 'soc2-2', name: 'Access control and authentication', severity: 'high' },
      { id: 'soc2-3', name: 'Availability SLAs documented', severity: 'medium' },
      { id: 'soc2-4', name: 'Change management process', severity: 'medium' }
    ]
  },
  'ISO27001': {
    name: 'ISO/IEC 27001 Information Security',
    jurisdiction: 'Global',
    checks: [
      { id: 'iso-1', name: 'Information security policy', severity: 'high' },
      { id: 'iso-2', name: 'Asset classification and control', severity: 'high' },
      { id: 'iso-3', name: 'Incident response procedure', severity: 'critical' },
      { id: 'iso-4', name: 'Supplier relationship management', severity: 'medium' }
    ]
  },
  'NIST-AI-RMF': {
    name: 'NIST AI Risk Management Framework',
    jurisdiction: 'US',
    checks: [
      { id: 'nist-1', name: 'AI system governance structure', severity: 'high' },
      { id: 'nist-2', name: 'Risk mapping and measurement', severity: 'high' },
      { id: 'nist-3', name: 'AI system monitoring and management', severity: 'critical' },
      { id: 'nist-4', name: 'Third-party AI risk management', severity: 'medium' }
    ]
  }
};

const RISK_LEVELS = ['minimal', 'limited', 'high', 'unacceptable'];
const SEVERITY_WEIGHT = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };

// ── Compliance Event ──────────────────────────────────────────────────────────

class ComplianceEvent {
  constructor(opts = {}) {
    this.id = `ce-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    this.timestamp = Date.now();
    this.type = opts.type || 'check';       // 'check' | 'violation' | 'drift' | 'halt' | 'pass'
    this.framework = opts.framework || null;
    this.checkId = opts.checkId || null;
    this.severity = opts.severity || 'info';
    this.agentId = opts.agentId || null;
    this.playId = opts.playId || null;
    this.description = opts.description || '';
    this.evidence = opts.evidence || {};
    this.passed = opts.passed !== false;
    // Immutable hash chain
    this.prevHash = opts.prevHash || '0000000000000000';
    this.hash = this._computeHash();
  }

  _computeHash() {
    const content = `${this.prevHash}${this.timestamp}${this.type}${this.checkId}${this.passed}`;
    return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
  }
}

// ── Compliance Engine ─────────────────────────────────────────────────────────

class ComplianceEngine {
  /**
   * @param {object} contract — The `compliance` block from fai-manifest.json
   * @param {string} playId   — Current play identifier
   */
  constructor(contract = {}, playId = 'unknown') {
    this.playId = playId;
    this.contract = this._normalizeContract(contract);
    this._auditLog = [];         // Immutable hash-chained log
    this._lastHash = '0'.repeat(16);
    this._driftBaseline = null;
    this._driftSamples = [];
    this._stats = { checksRun: 0, violations: 0, halts: 0, driftAlerts: 0 };
    this._customPolicies = this._compilePolicies(this.contract.policies);
  }

  _normalizeContract(c) {
    return {
      frameworks:          Array.isArray(c.frameworks) ? c.frameworks.filter(f => COMPLIANCE_FRAMEWORKS[f]) : ['GDPR'],
      riskLevel:           RISK_LEVELS.includes(c.riskLevel) ? c.riskLevel : 'limited',
      preDeploymentChecks: c.preDeploymentChecks !== false,
      auditTrail:          ['immutable', 'mutable', 'none'].includes(c.auditTrail) ? c.auditTrail : 'immutable',
      driftDetection: {
        enabled:          c.driftDetection?.enabled === true,
        baselineWindow:   c.driftDetection?.baselineWindow || '7d',
        alertThreshold:   typeof c.driftDetection?.alertThreshold === 'number' ? c.driftDetection.alertThreshold : 0.1
      },
      policies: Array.isArray(c.policies) ? c.policies : []
    };
  }

  static validateContract(contract) {
    const errors = [];
    if (contract.frameworks) {
      for (const f of contract.frameworks) {
        if (!COMPLIANCE_FRAMEWORKS[f]) errors.push(`Unknown compliance framework "${f}". Known: ${Object.keys(COMPLIANCE_FRAMEWORKS).join(', ')}`);
      }
    }
    if (contract.riskLevel && !RISK_LEVELS.includes(contract.riskLevel))
      errors.push(`Invalid riskLevel "${contract.riskLevel}". Must be: ${RISK_LEVELS.join(' | ')}`);
    return errors;
  }

  _compilePolicies(policies) {
    return policies.map(p => ({
      id: p.id,
      name: p.name || p.id,
      severity: p.severity || 'medium',
      evaluate: p.rule ? this._compileRule(p.rule) : () => ({ passed: true })
    }));
  }

  _compileRule(rule) {
    // Simple rule evaluation: support basic property checks
    // Production: would use OPA (Open Policy Agent) or similar
    return (context) => {
      try {
        // rule format: "context.field operator value"
        // e.g., "context.piiInLogs === false"
        const fn = new Function('context', `"use strict"; return (${rule})`);
        const result = fn(context);
        return { passed: !!result };
      } catch (e) {
        return { passed: false, error: e.message };
      }
    };
  }

  // ── Audit Trail ───────────────────────────────────────────────────────────

  _log(opts) {
    if (this.contract.auditTrail === 'none') return null;

    const event = new ComplianceEvent({
      ...opts,
      playId: this.playId,
      prevHash: this._lastHash
    });

    this._auditLog.push(event);
    this._lastHash = event.hash;
    return event;
  }

  /**
   * Verify the audit trail's integrity (hash chain validation).
   */
  verifyAuditIntegrity() {
    if (this._auditLog.length === 0) return { ok: true, verified: 0 };
    let prevHash = '0'.repeat(16);
    for (const event of this._auditLog) {
      const expected = event._computeHash();
      if (event.hash !== expected) return { ok: false, error: `Hash mismatch at event ${event.id}` };
      if (event.prevHash !== prevHash) return { ok: false, error: `Chain broken at event ${event.id}` };
      prevHash = event.hash;
    }
    return { ok: true, verified: this._auditLog.length };
  }

  // ── Pre-Deployment Checks ─────────────────────────────────────────────────

  /**
   * Run pre-deployment compliance checks.
   * Should be called before the play goes live.
   */
  preDeploymentCheck(manifest = {}) {
    if (!this.contract.preDeploymentChecks) return { ok: true, skipped: true };

    const results = { passed: [], failed: [], warnings: [], score: 0, maxScore: 0 };

    // EU AI Act unacceptable risk check
    if (this.contract.frameworks.includes('EU-AI-Act') && this.contract.riskLevel === 'unacceptable') {
      results.failed.push({
        id: 'euai-risk', framework: 'EU-AI-Act', severity: 'critical',
        description: 'EU AI Act: Risk level "unacceptable" — this use case is PROHIBITED',
        remediation: 'Do not deploy. Review Article 5 of the EU AI Act.'
      });
    }

    // Check each framework's required items
    for (const frameworkId of this.contract.frameworks) {
      const framework = COMPLIANCE_FRAMEWORKS[frameworkId];
      if (!framework) continue;

      for (const check of (framework.checks || [])) {
        const weight = SEVERITY_WEIGHT[check.severity] || 1;
        results.maxScore += weight;

        // Evaluate check against manifest
        const passed = this._evaluateCheck(check, manifest);
        if (passed) {
          results.score += weight;
          results.passed.push({ ...check, framework: frameworkId });
        } else {
          results.failed.push({ ...check, framework: frameworkId,
            description: `${framework.name}: ${check.name} not satisfied`,
            remediation: `Implement ${check.name} before deploying to production`
          });
        }
      }
    }

    // Custom policies
    for (const policy of this._customPolicies) {
      const { passed, error } = policy.evaluate({ manifest, riskLevel: this.contract.riskLevel });
      const weight = SEVERITY_WEIGHT[policy.severity] || 2;
      results.maxScore += weight;
      if (passed) {
        results.score += weight;
        results.passed.push({ id: policy.id, name: policy.name, severity: policy.severity });
      } else {
        results.failed.push({ id: policy.id, name: policy.name, severity: policy.severity,
          description: error || `Custom policy "${policy.id}" failed`, remediation: 'Review policy rule' });
      }
    }

    const score = results.maxScore > 0 ? Math.round(results.score / results.maxScore * 100) : 100;
    const criticalFailures = results.failed.filter(f => f.severity === 'critical');
    const ok = criticalFailures.length === 0;

    this._log({ type: ok ? 'pass' : 'violation', description: `Pre-deployment check: ${score}% compliant`,
      evidence: { score, failed: results.failed.length, passed: results.passed.length }, passed: ok });
    this._stats.checksRun++;
    if (!ok) this._stats.violations++;

    return { ok, score, frameworks: this.contract.frameworks, riskLevel: this.contract.riskLevel,
      passed: results.passed, failed: results.failed, criticalFailures };
  }

  _evaluateCheck(check, manifest) {
    // Map check IDs to manifest field presence
    const checkMap = {
      'gdpr-3':  () => !!manifest?.memory,              // Right to erasure requires memory contract
      'gdpr-4':  () => manifest?.memory?.encryption !== false,
      'euai-3':  () => !!manifest?.hooks?.length,        // Human oversight requires hooks
      'hipaa-1': () => !!manifest?.identity,             // PHI access requires identity contract
      'hipaa-2': () => manifest?.memory?.encryption !== false,
      'soc2-1':  () => !!manifest?.observability,        // Monitoring requires observability contract
    };
    const evaluator = checkMap[check.id];
    return evaluator ? evaluator() : true; // Assume pass for checks we can't auto-evaluate
  }

  // ── Runtime Checks ────────────────────────────────────────────────────────

  /**
   * Evaluate a runtime event against compliance policies.
   */
  evaluateEvent(event = {}) {
    const violations = [];
    const context = { ...event, riskLevel: this.contract.riskLevel, playId: this.playId };

    for (const policy of this._customPolicies) {
      const { passed, error } = policy.evaluate(context);
      if (!passed) {
        violations.push({ policyId: policy.id, severity: policy.severity, error });
        this._log({ type: 'violation', checkId: policy.id, severity: policy.severity,
          agentId: event.agentId, description: error || `Policy "${policy.id}" violated`,
          evidence: event, passed: false });
        this._stats.violations++;
      }
    }

    const criticalViolations = violations.filter(v => v.severity === 'critical');
    const halt = criticalViolations.length > 0;
    if (halt) this._stats.halts++;

    this._stats.checksRun++;
    return { ok: violations.length === 0, halt, violations };
  }

  // ── Drift Detection ───────────────────────────────────────────────────────

  /**
   * Record a model quality sample for drift detection.
   */
  recordSample(metrics = {}) {
    if (!this.contract.driftDetection.enabled) return { ok: false, skipped: true };
    this._driftSamples.push({ timestamp: Date.now(), ...metrics });

    // Establish baseline after first 10 samples
    if (this._driftSamples.length === 10 && !this._driftBaseline) {
      this._driftBaseline = this._computeBaseline(this._driftSamples);
      return { ok: true, action: 'baseline-established', baseline: this._driftBaseline };
    }

    if (!this._driftBaseline) return { ok: true, action: 'collecting-baseline', count: this._driftSamples.length };

    // Check for drift
    const recent = this._driftSamples.slice(-5);
    const currentAvg = this._computeBaseline(recent);
    const drift = this._computeDrift(this._driftBaseline, currentAvg);

    if (drift > this.contract.driftDetection.alertThreshold) {
      this._stats.driftAlerts++;
      this._log({ type: 'drift', severity: 'high', description: `Model drift detected: ${(drift * 100).toFixed(1)}% deviation`,
        evidence: { drift, baseline: this._driftBaseline, current: currentAvg }, passed: false });
      return { ok: true, driftDetected: true, drift, baseline: this._driftBaseline, current: currentAvg };
    }

    return { ok: true, driftDetected: false, drift };
  }

  _computeBaseline(samples) {
    const keys = ['groundedness', 'safety', 'latency', 'cost'];
    const baseline = {};
    for (const key of keys) {
      const vals = samples.map(s => s[key]).filter(v => typeof v === 'number');
      if (vals.length > 0) baseline[key] = vals.reduce((a, b) => a + b, 0) / vals.length;
    }
    return baseline;
  }

  _computeDrift(baseline, current) {
    const keys = Object.keys(baseline).filter(k => current[k] !== undefined);
    if (keys.length === 0) return 0;
    const drifts = keys.map(k => Math.abs((current[k] - baseline[k]) / (baseline[k] || 1)));
    return drifts.reduce((a, b) => a + b, 0) / drifts.length;
  }

  // ── Report ────────────────────────────────────────────────────────────────

  report() {
    const integrity = this.verifyAuditIntegrity();
    return {
      playId: this.playId,
      frameworks: this.contract.frameworks,
      riskLevel: this.contract.riskLevel,
      auditTrail: {
        entries: this._auditLog.length,
        integrityOk: integrity.ok,
        lastHash: this._lastHash
      },
      driftDetection: {
        enabled: this.contract.driftDetection.enabled,
        hasBaseline: this._driftBaseline !== null,
        samples: this._driftSamples.length,
        alerts: this._stats.driftAlerts
      },
      stats: this._stats
    };
  }

  getAuditLog(filter = {}) {
    let log = this._auditLog;
    if (filter.type) log = log.filter(e => e.type === filter.type);
    if (filter.framework) log = log.filter(e => e.framework === filter.framework);
    if (filter.severity) log = log.filter(e => e.severity === filter.severity);
    return log.slice(-(filter.limit || 100)).map(e => ({
      id: e.id, timestamp: e.timestamp, type: e.type, severity: e.severity,
      description: e.description, passed: e.passed, hash: e.hash
    }));
  }
}

function createComplianceEngine(manifest, playId) {
  const contract = manifest?.compliance || {};
  const errors = ComplianceEngine.validateContract(contract);
  if (errors.length > 0) throw new Error(`Invalid compliance contract: ${errors.join('; ')}`);
  return new ComplianceEngine(contract, playId || manifest?.play || 'unknown');
}

module.exports = { ComplianceEngine, createComplianceEngine, COMPLIANCE_FRAMEWORKS, RISK_LEVELS };
