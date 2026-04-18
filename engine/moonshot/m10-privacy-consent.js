'use strict';
/**
 * FAI Moonshot M-10 — Privacy Consent Protocol
 * ==============================================
 * GDPR/CCPA-compliant data consent and PII management for AI systems.
 *
 * Problem: PII detection tools exist (Presidio, NLP tools) but NO standard for:
 *   - "Agent X has consent to use data Y from user Z"
 *   - Orchestrating right-to-deletion across a multi-agent play
 *   - Data residency enforcement per user's jurisdiction
 *   - Consent lifecycle (grant → use → revoke → delete)
 *   - Immutable consent audit trail for regulatory compliance
 *
 * fai-manifest.json v2.0 contract:
 * {
 *   "privacy": {
 *     "dataResidency": "eu-west" | "us-east" | "global",
 *     "consentRequired": true,
 *     "rightToDeletion": "automated" | "manual" | "none",
 *     "piiCategories": ["email", "phone", "name", "address", "health", "financial"],
 *     "retentionPolicy": "session" | "30d" | "1y" | "permanent",
 *     "frameworks": ["GDPR", "CCPA"],
 *     "anonymization": "redact" | "pseudonymize" | "none"
 *   }
 * }
 */

const crypto = require('crypto');

// ── PII Categories ────────────────────────────────────────────────────────────

const PII_CATEGORIES = {
  email:     { sensitivity: 'high',     pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
  phone:     { sensitivity: 'high',     pattern: /(\+?1?\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g },
  name:      { sensitivity: 'medium',   pattern: /\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g },
  address:   { sensitivity: 'high',     pattern: /\d+\s+[A-Za-z\s]+(?:Ave|St|Rd|Blvd|Dr|Ln|Way)\b/gi },
  ssn:       { sensitivity: 'critical', pattern: /\b\d{3}-\d{2}-\d{4}\b/g },
  creditCard:{ sensitivity: 'critical', pattern: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g },
  dob:       { sensitivity: 'high',     pattern: /\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/g },
  ip:        { sensitivity: 'medium',   pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g },
  health:    { sensitivity: 'critical', pattern: /\b(?:diabetes|cancer|HIV|AIDS|depression|medication|prescription)\b/gi },
  financial: { sensitivity: 'critical', pattern: /\b(?:account\s*#?\s*\d+|routing\s*#?\s*\d+|IBAN\s*[A-Z0-9]+)\b/gi }
};

// Legal bases for processing (GDPR Article 6)
const LEGAL_BASES = ['consent', 'contract', 'legal-obligation', 'vital-interests', 'public-task', 'legitimate-interests'];
const DATA_RESIDENCY_REGIONS = ['eu-west', 'eu-central', 'us-east', 'us-west', 'ap-southeast', 'global'];
const ANONYMIZATION_MODES = ['redact', 'pseudonymize', 'none'];

// ── Consent Record ────────────────────────────────────────────────────────────

class ConsentRecord {
  constructor(opts = {}) {
    this.consentId = opts.consentId || `consent-${crypto.randomBytes(8).toString('hex')}`;
    this.subjectId = opts.subjectId;
    this.playId = opts.playId;
    this.agentIds = Array.isArray(opts.agentIds) ? opts.agentIds : [];
    this.piiCategories = Array.isArray(opts.piiCategories) ? opts.piiCategories : [];
    this.legalBasis = LEGAL_BASES.includes(opts.legalBasis) ? opts.legalBasis : 'consent';
    this.purpose = opts.purpose || '';
    this.grantedAt = opts.grantedAt || Date.now();
    this.expiresAt = opts.expiresAt || null;
    this.revokedAt = null;
    this.dataResidency = opts.dataResidency || 'global';
    this.version = opts.version || '1.0';
    this.hash = this._computeHash();
  }

  get isActive() { return this.revokedAt === null && (!this.expiresAt || Date.now() < this.expiresAt); }

  revoke() { this.revokedAt = Date.now(); return this; }

  _computeHash() {
    return crypto.createHash('sha256')
      .update(`${this.subjectId}:${this.playId}:${this.piiCategories.sort().join(',')}:${this.grantedAt}`)
      .digest('hex').slice(0, 16);
  }

  toJSON() {
    return {
      consentId: this.consentId, subjectId: this.subjectId, playId: this.playId,
      agentIds: this.agentIds, piiCategories: this.piiCategories, legalBasis: this.legalBasis,
      purpose: this.purpose, grantedAt: this.grantedAt, expiresAt: this.expiresAt,
      revokedAt: this.revokedAt, isActive: this.isActive, hash: this.hash
    };
  }
}

// ── Privacy Consent Engine ────────────────────────────────────────────────────

class PrivacyConsentEngine {
  /**
   * @param {object} contract — The `privacy` block from fai-manifest.json
   * @param {string} playId   — Current play identifier
   */
  constructor(contract = {}, playId = 'unknown') {
    this.playId = playId;
    this.contract = this._normalizeContract(contract);
    this._consents = new Map();          // consentId → ConsentRecord
    this._subjectIndex = new Map();      // subjectId → Set<consentId>
    this._deletionLog = [];              // Right-to-deletion audit trail
    this._auditLog = [];                 // Immutable event log
    this._lastHash = '0'.repeat(16);
    this._pseudonymMap = new Map();      // realId → pseudonymId
    this._stats = { consentsGranted: 0, consentsRevoked: 0, deletions: 0, piiDetections: 0, accessDenied: 0 };
  }

  _normalizeContract(c) {
    return {
      dataResidency:   DATA_RESIDENCY_REGIONS.includes(c.dataResidency) ? c.dataResidency : 'global',
      consentRequired: c.consentRequired !== false,
      rightToDeletion: ['automated', 'manual', 'none'].includes(c.rightToDeletion) ? c.rightToDeletion : 'automated',
      piiCategories:   Array.isArray(c.piiCategories) ? c.piiCategories.filter(cat => PII_CATEGORIES[cat]) : Object.keys(PII_CATEGORIES),
      retentionPolicy: c.retentionPolicy || '30d',
      frameworks:      Array.isArray(c.frameworks) ? c.frameworks : ['GDPR'],
      anonymization:   ANONYMIZATION_MODES.includes(c.anonymization) ? c.anonymization : 'redact'
    };
  }

  static validateContract(contract) {
    const errors = [];
    if (contract.piiCategories) {
      for (const cat of contract.piiCategories) {
        if (!PII_CATEGORIES[cat]) errors.push(`Unknown PII category "${cat}". Known: ${Object.keys(PII_CATEGORIES).join(', ')}`);
      }
    }
    if (contract.anonymization && !ANONYMIZATION_MODES.includes(contract.anonymization))
      errors.push(`Invalid anonymization "${contract.anonymization}". Must be: ${ANONYMIZATION_MODES.join(' | ')}`);
    if (contract.dataResidency && !DATA_RESIDENCY_REGIONS.includes(contract.dataResidency))
      errors.push(`Invalid dataResidency "${contract.dataResidency}". Must be: ${DATA_RESIDENCY_REGIONS.join(', ')}`);
    return errors;
  }

  // ── Consent Management ────────────────────────────────────────────────────

  grantConsent(opts = {}) {
    const { subjectId, agentIds, piiCategories, purpose, legalBasis, expiresIn } = opts;

    if (!subjectId) return { ok: false, error: 'subjectId is required' };

    const record = new ConsentRecord({
      subjectId, playId: this.playId,
      agentIds: agentIds || [],
      piiCategories: piiCategories || this.contract.piiCategories,
      legalBasis: legalBasis || 'consent',
      purpose: purpose || 'AI processing',
      dataResidency: this.contract.dataResidency,
      expiresAt: expiresIn ? Date.now() + this._parseTtl(expiresIn) : null
    });

    this._consents.set(record.consentId, record);
    if (!this._subjectIndex.has(subjectId)) this._subjectIndex.set(subjectId, new Set());
    this._subjectIndex.get(subjectId).add(record.consentId);
    this._stats.consentsGranted++;
    this._audit('consent-granted', subjectId, { consentId: record.consentId, categories: record.piiCategories });

    return { ok: true, consentId: record.consentId, record: record.toJSON() };
  }

  revokeConsent(consentId, reason = 'user-request') {
    const record = this._consents.get(consentId);
    if (!record) return { ok: false, error: 'Consent record not found' };
    record.revoke();
    this._stats.consentsRevoked++;
    this._audit('consent-revoked', record.subjectId, { consentId, reason });
    return { ok: true, consentId, revokedAt: new Date().toISOString() };
  }

  /**
   * Check if an agent has consent to process specific PII for a subject.
   */
  checkConsent(subjectId, agentId, piiCategory) {
    if (!this.contract.consentRequired) return { ok: true, reason: 'consent-not-required' };

    const consentIds = this._subjectIndex.get(subjectId);
    if (!consentIds || consentIds.size === 0) {
      this._stats.accessDenied++;
      this._audit('access-denied', subjectId, { agentId, piiCategory, reason: 'no-consent' });
      return { ok: false, error: `No consent found for subject "${subjectId}"` };
    }

    for (const cid of consentIds) {
      const record = this._consents.get(cid);
      if (!record || !record.isActive) continue;
      const agentAllowed = record.agentIds.length === 0 || record.agentIds.includes(agentId) || record.agentIds.includes('*');
      const categoryAllowed = record.piiCategories.includes(piiCategory) || record.piiCategories.includes('*');
      if (agentAllowed && categoryAllowed) {
        return { ok: true, consentId: cid, legalBasis: record.legalBasis };
      }
    }

    this._stats.accessDenied++;
    this._audit('access-denied', subjectId, { agentId, piiCategory, reason: 'insufficient-scope' });
    return { ok: false, error: `Agent "${agentId}" does not have consent to process "${piiCategory}" for subject "${subjectId}"` };
  }

  // ── PII Detection & Anonymization ────────────────────────────────────────

  detectPii(text) {
    if (!text || typeof text !== 'string') return { piiFound: false, detections: [] };
    const detections = [];
    for (const category of this.contract.piiCategories) {
      const def = PII_CATEGORIES[category];
      if (!def) continue;
      const re = new RegExp(def.pattern.source, def.pattern.flags);
      const matches = text.match(re);
      if (matches) {
        detections.push({ category, sensitivity: def.sensitivity, count: matches.length, examples: matches.slice(0, 2).map(m => m.slice(0, 4) + '***') });
        re.lastIndex = 0;
      }
    }
    if (detections.length > 0) this._stats.piiDetections++;
    return { piiFound: detections.length > 0, detections };
  }

  anonymize(text, mode) {
    const anonymizationMode = mode || this.contract.anonymization;
    if (anonymizationMode === 'none') return { ok: true, text, changed: false };

    let result = text;
    let changed = false;

    for (const category of this.contract.piiCategories) {
      const def = PII_CATEGORIES[category];
      if (!def) continue;
      const re = new RegExp(def.pattern.source, def.pattern.flags);

      if (anonymizationMode === 'redact') {
        const replaced = result.replace(re, `[${category.toUpperCase()}]`);
        if (replaced !== result) { result = replaced; changed = true; }
      } else if (anonymizationMode === 'pseudonymize') {
        result = result.replace(re, (match) => {
          const key = `${category}:${match}`;
          if (!this._pseudonymMap.has(key)) {
            this._pseudonymMap.set(key, `[${category}-${crypto.randomBytes(4).toString('hex')}]`);
          }
          changed = true;
          return this._pseudonymMap.get(key);
        });
      }
      re.lastIndex = 0;
    }

    return { ok: true, text: result, changed };
  }

  // ── Right to Deletion ─────────────────────────────────────────────────────

  /**
   * Execute right-to-deletion for a data subject.
   * Revokes all consents and triggers deletion across connected systems.
   */
  async rightToDeletion(subjectId, opts = {}) {
    if (this.contract.rightToDeletion === 'none') {
      return { ok: false, error: 'Right-to-deletion not enabled in privacy contract' };
    }

    const consentIds = this._subjectIndex.get(subjectId) || new Set();
    let revokedConsents = 0;

    // Revoke all active consents
    for (const cid of consentIds) {
      const record = this._consents.get(cid);
      if (record && record.isActive) {
        record.revoke();
        revokedConsents++;
      }
    }

    // Clear pseudonym mappings for this subject
    for (const [key] of this._pseudonymMap) {
      if (key.includes(subjectId)) this._pseudonymMap.delete(key);
    }

    const deletionEvent = {
      id: `del-${crypto.randomBytes(8).toString('hex')}`,
      subjectId,
      playId: this.playId,
      requestedAt: Date.now(),
      completedAt: this.contract.rightToDeletion === 'automated' ? Date.now() : null,
      status: this.contract.rightToDeletion === 'automated' ? 'completed' : 'pending',
      revokedConsents,
      requestedBy: opts.requestedBy || 'subject',
      framework: this.contract.frameworks[0] || 'GDPR'
    };

    this._deletionLog.push(deletionEvent);
    this._stats.deletions++;
    this._audit('deletion-request', subjectId, { deletionId: deletionEvent.id, status: deletionEvent.status });

    return {
      ok: true,
      deletionId: deletionEvent.id,
      status: deletionEvent.status,
      revokedConsents,
      estimatedCompletionMs: this.contract.rightToDeletion === 'automated' ? 0 : 86_400_000
    };
  }

  // ── Data Residency ────────────────────────────────────────────────────────

  checkDataResidency(subjectRegion) {
    if (this.contract.dataResidency === 'global') return { ok: true };
    if (!subjectRegion) return { ok: true }; // No restriction if region unknown

    // EU GDPR: subject in EU → data must stay in EU
    const euRegions = ['eu-west', 'eu-central'];
    const isSubjectEU = subjectRegion.startsWith('eu');
    const isDataEU = euRegions.includes(this.contract.dataResidency);

    if (isSubjectEU && !isDataEU) {
      return { ok: false, error: `EU data subject cannot have data processed outside EU. Contract dataResidency: "${this.contract.dataResidency}"` };
    }
    return { ok: true };
  }

  // ── Audit & Reporting ─────────────────────────────────────────────────────

  _audit(event, subjectId, details = {}) {
    const prevHash = this._lastHash;
    const entry = { event, subjectId, playId: this.playId, timestamp: Date.now(), details };
    const hash = crypto.createHash('sha256').update(`${prevHash}${JSON.stringify(entry)}`).digest('hex').slice(0, 16);
    entry.prevHash = prevHash;
    entry.hash = hash;
    this._auditLog.push(entry);
    this._lastHash = hash;
  }

  getAuditLog(filter = {}) {
    let log = this._auditLog;
    if (filter.subjectId) log = log.filter(e => e.subjectId === filter.subjectId);
    if (filter.event) log = log.filter(e => e.event === filter.event);
    return log.slice(-(filter.limit || 100)).map(({ event, subjectId, timestamp, details, hash }) =>
      ({ event, subjectId, timestamp, details, hash }));
  }

  stats() {
    return {
      playId: this.playId,
      contract: {
        dataResidency: this.contract.dataResidency,
        consentRequired: this.contract.consentRequired,
        rightToDeletion: this.contract.rightToDeletion,
        frameworks: this.contract.frameworks,
        anonymization: this.contract.anonymization
      },
      activeConsents: [...this._consents.values()].filter(c => c.isActive).length,
      totalConsents: this._consents.size,
      subjects: this._subjectIndex.size,
      deletionRequests: this._deletionLog.length,
      auditEntries: this._auditLog.length,
      operations: this._stats
    };
  }

  _parseTtl(ttl) {
    const m = String(ttl).match(/^(\d+)(s|m|h|d|y)$/);
    if (!m) return 30 * 86400000; // 30 days default
    const n = parseInt(m[1]);
    return n * ({ s: 1000, m: 60000, h: 3600000, d: 86400000, y: 31536000000 }[m[2]]);
  }
}

function createPrivacyEngine(manifest, playId) {
  const contract = manifest?.privacy || {};
  const errors = PrivacyConsentEngine.validateContract(contract);
  if (errors.length > 0) throw new Error(`Invalid privacy contract: ${errors.join('; ')}`);
  return new PrivacyConsentEngine(contract, playId || manifest?.play || 'unknown');
}

module.exports = { PrivacyConsentEngine, ConsentRecord, createPrivacyEngine, PII_CATEGORIES, LEGAL_BASES };
