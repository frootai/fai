'use strict';
/**
 * FAI Moonshot M-4 — Agent Identity & Trust
 * ==========================================
 * The first production standard for AI agent identity verification.
 *
 * Problem: Completely unsolved. When Agent A calls Agent B:
 *   - How does Agent B know Agent A is who it claims to be?
 *   - How do you prevent agent impersonation in multi-agent systems?
 *   - How do you revoke a compromised agent's credentials?
 *   - How do you scope agent capabilities to what's declared in the manifest?
 *
 * FAI Solution: DID-style agent identity with capability tokens,
 * digital signatures, and revocation lists.
 *
 * fai-manifest.json v2.0 contract:
 * {
 *   "identity": {
 *     "issuer": "frootai.dev",
 *     "capabilities": ["search", "generate", "deploy", "evaluate"],
 *     "maxCallDepth": 3,
 *     "revocable": true,
 *     "tokenTtl": "1h",
 *     "requireSignedRequests": true
 *   }
 * }
 */

const crypto = require('crypto');

// ── Constants ─────────────────────────────────────────────────────────────────

const KNOWN_CAPABILITIES = [
  'search',      // Can search knowledge bases
  'generate',    // Can call LLM for generation
  'deploy',      // Can deploy infrastructure
  'evaluate',    // Can run evaluations
  'read',        // Can read data stores
  'write',       // Can write to data stores
  'orchestrate', // Can spawn sub-agents
  'configure',   // Can change system configuration
  'audit',       // Can read audit logs
  'admin'        // Full access (includes all others)
];

const CAPABILITY_HIERARCHY = {
  admin: KNOWN_CAPABILITIES.filter(c => c !== 'admin')
};

// ── Agent DID ─────────────────────────────────────────────────────────────────

class AgentDID {
  /**
   * Decentralized Identifier for an AI agent.
   * Format: did:fai:<playId>:<agentId>
   */
  constructor(opts = {}) {
    this.method = 'fai';
    this.playId = opts.playId || 'unknown';
    this.agentId = opts.agentId || opts.name || 'agent';
    this.did = `did:fai:${this.playId}:${this.agentId}`;
    this.issuer = opts.issuer || 'frootai.dev';
    this.capabilities = this._expandCapabilities(opts.capabilities || []);
    this.publicKey = opts.publicKey || null;
    this._privateKey = opts.privateKey || null;
    this.createdAt = Date.now();
    this.revokedAt = null;
    this.metadata = opts.metadata || {};
  }

  _expandCapabilities(caps) {
    const expanded = new Set(caps);
    if (expanded.has('admin')) {
      for (const c of KNOWN_CAPABILITIES) expanded.add(c);
    }
    return Array.from(expanded);
  }

  get isRevoked() { return this.revokedAt !== null; }

  hasCapability(capability) {
    if (this.isRevoked) return false;
    return this.capabilities.includes('admin') || this.capabilities.includes(capability);
  }

  revoke() {
    this.revokedAt = Date.now();
    return { did: this.did, revokedAt: this.revokedAt };
  }

  /** Generate a signed capability assertion */
  assert(capability, resource = null) {
    if (!this.hasCapability(capability)) {
      return { ok: false, error: `Agent "${this.did}" does not have capability "${capability}"` };
    }
    const assertion = {
      iss: this.did,
      sub: resource || '*',
      cap: capability,
      iat: Date.now(),
      exp: Date.now() + 3_600_000 // 1 hour
    };
    if (this._privateKey) {
      assertion.sig = this._sign(JSON.stringify(assertion));
    }
    return { ok: true, assertion };
  }

  _sign(payload) {
    if (!this._privateKey) return null;
    return crypto.createHmac('sha256', this._privateKey).update(payload).digest('hex');
  }

  toDocument() {
    return {
      '@context': ['https://www.w3.org/ns/did/v1', 'https://frootai.dev/ns/agent/v1'],
      id: this.did,
      issuer: this.issuer,
      capabilities: this.capabilities,
      verificationMethod: this.publicKey ? [{
        id: `${this.did}#key-1`,
        type: 'Ed25519VerificationKey2020',
        controller: this.did,
        publicKeyMultibase: this.publicKey
      }] : [],
      service: [{
        id: `${this.did}#manifest`,
        type: 'FAIManifest',
        serviceEndpoint: `https://frootai.dev/plays/${this.playId}`
      }],
      created: new Date(this.createdAt).toISOString(),
      revoked: this.revokedAt ? new Date(this.revokedAt).toISOString() : null
    };
  }
}

// ── Capability Token ──────────────────────────────────────────────────────────

class CapabilityToken {
  /**
   * A scoped, time-limited token granting specific capabilities.
   * Similar to OAuth 2.0 JWT but for agent-to-agent authorization.
   */
  constructor(opts = {}) {
    this.tokenId = opts.tokenId || crypto.randomBytes(16).toString('hex');
    this.issuerDid = opts.issuerDid;
    this.subjectDid = opts.subjectDid;
    this.capabilities = opts.capabilities || [];
    this.resource = opts.resource || '*';      // Which resource this grants access to
    this.callDepth = opts.callDepth || 0;      // Current depth in call chain
    this.maxDepth = opts.maxDepth || 3;        // Max recursion depth
    this.issuedAt = opts.issuedAt || Date.now();
    this.expiresAt = opts.expiresAt || (Date.now() + 3_600_000);
    this.parentTokenId = opts.parentTokenId || null;
    this.nonce = crypto.randomBytes(8).toString('hex');
  }

  get isExpired() { return Date.now() > this.expiresAt; }
  get isAtMaxDepth() { return this.callDepth >= this.maxDepth; }

  /**
   * Derive a child token for sub-agent delegation.
   * The child gets a subset of capabilities and increased depth.
   */
  derive(childDid, childCapabilities) {
    if (this.isAtMaxDepth) {
      return { ok: false, error: `Max call depth ${this.maxDepth} reached — cannot delegate further` };
    }
    if (this.isExpired) {
      return { ok: false, error: 'Cannot derive from expired token' };
    }

    // Child can only get a subset of parent's capabilities
    const allowed = childCapabilities.filter(c => this.capabilities.includes(c) || this.capabilities.includes('admin'));
    if (allowed.length === 0) {
      return { ok: false, error: 'Parent token does not grant any of the requested capabilities' };
    }

    const child = new CapabilityToken({
      issuerDid: this.subjectDid,
      subjectDid: childDid,
      capabilities: allowed,
      resource: this.resource,
      callDepth: this.callDepth + 1,
      maxDepth: this.maxDepth,
      expiresAt: this.expiresAt, // Child inherits parent's expiry
      parentTokenId: this.tokenId
    });

    return { ok: true, token: child };
  }

  verify(capability) {
    if (this.isExpired) return { ok: false, error: 'Token expired' };
    if (!this.capabilities.includes(capability) && !this.capabilities.includes('admin'))
      return { ok: false, error: `Token does not grant capability "${capability}"` };
    return { ok: true };
  }

  toJWT() {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT+FAI' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
      jti: this.tokenId,
      iss: this.issuerDid,
      sub: this.subjectDid,
      iat: Math.floor(this.issuedAt / 1000),
      exp: Math.floor(this.expiresAt / 1000),
      fai: {
        capabilities: this.capabilities,
        resource: this.resource,
        callDepth: this.callDepth,
        maxDepth: this.maxDepth,
        parentToken: this.parentTokenId,
        nonce: this.nonce
      }
    })).toString('base64url');
    return `${header}.${payload}.unsigned`;
  }
}

// ── Identity & Trust Engine ──────────────────────────────────────────────────

class IdentityEngine {
  /**
   * @param {object} contract — The `identity` block from fai-manifest.json
   * @param {string} playId   — Current play identifier
   */
  constructor(contract = {}, playId = 'unknown') {
    this.playId = playId;
    this.contract = this._normalizeContract(contract);
    this._identities = new Map();       // did → AgentDID
    this._tokens = new Map();           // tokenId → CapabilityToken
    this._revocationList = new Set();   // Set of revoked DIDs
    this._accessLog = [];               // Audit trail
    this._stats = { issued: 0, verified: 0, denied: 0, revoked: 0 };
  }

  _normalizeContract(c) {
    return {
      issuer:                c.issuer || 'frootai.dev',
      capabilities:          Array.isArray(c.capabilities) ? c.capabilities : ['generate'],
      maxCallDepth:          typeof c.maxCallDepth === 'number' ? c.maxCallDepth : 3,
      revocable:             c.revocable !== false,
      tokenTtl:              c.tokenTtl || '1h',
      requireSignedRequests: c.requireSignedRequests === true
    };
  }

  static validateContract(contract) {
    const errors = [];
    if (contract.capabilities) {
      for (const cap of contract.capabilities) {
        if (!KNOWN_CAPABILITIES.includes(cap))
          errors.push(`Unknown capability "${cap}". Known: ${KNOWN_CAPABILITIES.join(', ')}`);
      }
    }
    if (contract.maxCallDepth !== undefined && typeof contract.maxCallDepth !== 'number')
      errors.push('maxCallDepth must be a number');
    return errors;
  }

  // ── Identity Management ──────────────────────────────────────────────────

  /**
   * Register an agent and issue its DID.
   */
  register(agentId, opts = {}) {
    const did = new AgentDID({
      playId: this.playId,
      agentId,
      issuer: this.contract.issuer,
      capabilities: opts.capabilities || this.contract.capabilities,
      metadata: opts.metadata || {}
    });

    this._identities.set(did.did, did);
    this._logAccess('register', did.did, null, true);
    this._stats.issued++;

    return { ok: true, did: did.did, capabilities: did.capabilities, document: did.toDocument() };
  }

  resolve(did) {
    const identity = this._identities.get(did);
    if (!identity) return { ok: false, error: `DID "${did}" not found` };
    return { ok: true, identity, document: identity.toDocument(), revoked: identity.isRevoked };
  }

  revoke(did, reason = 'manual') {
    if (!this.contract.revocable) return { ok: false, error: 'Revocation not enabled in identity contract' };

    const identity = this._identities.get(did);
    if (!identity) return { ok: false, error: `DID "${did}" not found` };

    identity.revoke();
    this._revocationList.add(did);
    this._logAccess('revoke', did, reason, true);
    this._stats.revoked++;

    // Invalidate all tokens issued to this DID
    let tokensRevoked = 0;
    for (const [tokenId, token] of this._tokens) {
      if (token.subjectDid === did) {
        this._tokens.delete(tokenId);
        tokensRevoked++;
      }
    }

    return { ok: true, did, reason, tokensRevoked, revokedAt: new Date().toISOString() };
  }

  // ── Token Management ─────────────────────────────────────────────────────

  /**
   * Issue a capability token for an agent.
   */
  issueToken(subjectDid, opts = {}) {
    const identity = this._identities.get(subjectDid);
    if (!identity) return { ok: false, error: `DID "${subjectDid}" not registered` };
    if (identity.isRevoked) return { ok: false, error: `DID "${subjectDid}" has been revoked` };

    const requestedCaps = opts.capabilities || identity.capabilities;
    const grantedCaps = requestedCaps.filter(c => identity.hasCapability(c));

    const ttlMs = this._parseTtl(opts.ttl || this.contract.tokenTtl);
    const token = new CapabilityToken({
      issuerDid: `did:fai:${this.playId}:system`,
      subjectDid,
      capabilities: grantedCaps,
      resource: opts.resource || '*',
      callDepth: opts.callDepth || 0,
      maxDepth: this.contract.maxCallDepth,
      expiresAt: Date.now() + ttlMs,
      parentTokenId: opts.parentTokenId || null
    });

    this._tokens.set(token.tokenId, token);
    this._stats.issued++;

    return { ok: true, token, jwt: token.toJWT(), expiresIn: ttlMs };
  }

  /**
   * Verify a token for a specific capability.
   */
  verifyToken(tokenId, capability) {
    const token = this._tokens.get(tokenId);
    if (!token) {
      this._stats.denied++;
      return { ok: false, error: 'Token not found or expired' };
    }

    // Check if subject DID was revoked
    if (this._revocationList.has(token.subjectDid)) {
      this._stats.denied++;
      return { ok: false, error: `Subject DID "${token.subjectDid}" has been revoked` };
    }

    const result = token.verify(capability);
    if (result.ok) this._stats.verified++;
    else this._stats.denied++;

    this._logAccess('verify', token.subjectDid, capability, result.ok);
    return result;
  }

  /**
   * Delegate capabilities to a child agent (for orchestrator→sub-agent calls).
   */
  delegate(parentTokenId, childDid, childCapabilities) {
    const parentToken = this._tokens.get(parentTokenId);
    if (!parentToken) return { ok: false, error: 'Parent token not found' };

    const result = parentToken.derive(childDid, childCapabilities);
    if (!result.ok) return result;

    this._tokens.set(result.token.tokenId, result.token);
    this._logAccess('delegate', childDid, childCapabilities.join(','), true);

    return { ok: true, token: result.token, jwt: result.token.toJWT() };
  }

  // ── Audit Log ─────────────────────────────────────────────────────────────

  _logAccess(action, subject, resource, granted) {
    this._accessLog.push({
      timestamp: Date.now(),
      action, subject, resource, granted,
      playId: this.playId
    });
    // Keep last 10,000 entries
    if (this._accessLog.length > 10_000) this._accessLog.shift();
  }

  getAuditLog(filter = {}) {
    let log = this._accessLog;
    if (filter.subject) log = log.filter(e => e.subject === filter.subject);
    if (filter.action) log = log.filter(e => e.action === filter.action);
    if (filter.denied) log = log.filter(e => !e.granted);
    return log.slice(-(filter.limit || 100));
  }

  // ── Stats ─────────────────────────────────────────────────────────────────

  stats() {
    return {
      playId: this.playId,
      contract: {
        issuer: this.contract.issuer,
        capabilities: this.contract.capabilities,
        maxCallDepth: this.contract.maxCallDepth,
        revocable: this.contract.revocable,
        tokenTtl: this.contract.tokenTtl
      },
      registeredAgents: this._identities.size,
      activeTokens: this._tokens.size,
      revokedDids: this._revocationList.size,
      operations: this._stats
    };
  }

  _parseTtl(ttl) {
    const m = String(ttl).match(/^(\d+)(s|m|h|d)$/);
    if (!m) return 3_600_000;
    const n = parseInt(m[1]);
    return n * ({ s: 1000, m: 60000, h: 3600000, d: 86400000 }[m[2]]);
  }
}

// ── Factory ──────────────────────────────────────────────────────────────────

function createIdentityEngine(manifest, playId) {
  const contract = manifest?.identity || {};
  const errors = IdentityEngine.validateContract(contract);
  if (errors.length > 0) throw new Error(`Invalid identity contract: ${errors.join('; ')}`);
  return new IdentityEngine(contract, playId || manifest?.play || 'unknown');
}

module.exports = { IdentityEngine, AgentDID, CapabilityToken, createIdentityEngine, KNOWN_CAPABILITIES };
