'use strict';
/**
 * FAI Moonshot M-1 — Agent Memory Federation
 * ============================================
 * The first universal standard for cross-agent memory sharing.
 *
 * Problem: Every agent has its own memory (Redis, Cosmos, in-process).
 * There is NO standard for:
 *   - Declaring what memory an agent can read/write
 *   - Sharing memory across agent boundaries
 *   - Federating memory across plays and organizations
 *   - PII-safe memory with consent awareness
 *
 * FAI Solution: The `memory` contract in fai-manifest.json declares
 * the full memory topology. This engine enforces it at runtime.
 *
 * fai-manifest.json v2.0 contract:
 * {
 *   "memory": {
 *     "scope": "play-local" | "session" | "shared" | "federated" | "global",
 *     "backend": "in-memory" | "redis" | "cosmos-db" | "postgres" | "custom",
 *     "retention": "1h" | "1d" | "90d" | "permanent",
 *     "pii": "allow" | "redact-before-store" | "block",
 *     "encryption": boolean,
 *     "maxSizeKB": number,
 *     "acl": [{ "agent": "string", "access": "read" | "write" | "admin" }],
 *     "federation": {
 *       "enabled": boolean,
 *       "peers": ["play-id-1", "play-id-2"],
 *       "syncInterval": "30s" | "5m" | "realtime"
 *     },
 *     "eviction": "lru" | "ttl" | "priority" | "none"
 *   }
 * }
 */

const crypto = require('crypto');

// ── Constants ───────────────────────────────────────────────────────────────

const SCOPES = ['play-local', 'session', 'shared', 'federated', 'global'];
const BACKENDS = ['in-memory', 'redis', 'cosmos-db', 'postgres', 'custom'];
const PII_POLICIES = ['allow', 'redact-before-store', 'block'];
const EVICTION_POLICIES = ['lru', 'ttl', 'priority', 'none'];

const RETENTION_MS = {
  '1h': 3600_000,
  '6h': 21_600_000,
  '1d': 86_400_000,
  '7d': 604_800_000,
  '30d': 2_592_000_000,
  '90d': 7_776_000_000,
  permanent: Infinity
};

// ── PII Patterns ─────────────────────────────────────────────────────────────

const PII_PATTERNS = [
  { name: 'email',   re: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
  { name: 'phone',   re: /(\+?1?\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g },
  { name: 'ssn',     re: /\b\d{3}-\d{2}-\d{4}\b/g },
  { name: 'credit_card', re: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g },
  { name: 'ip',      re: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g },
  { name: 'name',    re: /\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g }
];

// ── Memory Entry ─────────────────────────────────────────────────────────────

class MemoryEntry {
  constructor(key, value, opts = {}) {
    this.key = key;
    this.value = value;
    this.createdAt = Date.now();
    this.accessedAt = Date.now();
    this.accessCount = 0;
    this.priority = opts.priority || 5;
    this.ttl = opts.ttl || null;
    this.agentId = opts.agentId || 'system';
    this.playId = opts.playId || null;
    this.tags = opts.tags || [];
    this.encrypted = opts.encrypted || false;
    this.piiRedacted = opts.piiRedacted || false;
    this.checksum = this._checksum();
  }

  isExpired() {
    if (!this.ttl) return false;
    return Date.now() > this.createdAt + this.ttl;
  }

  touch() {
    this.accessedAt = Date.now();
    this.accessCount++;
  }

  _checksum() {
    const val = typeof this.value === 'string' ? this.value : JSON.stringify(this.value);
    return crypto.createHash('sha256').update(val).digest('hex').slice(0, 16);
  }
}

// ── Memory Federation Engine ─────────────────────────────────────────────────

class MemoryFederation {
  /**
   * @param {object} contract — The `memory` block from fai-manifest.json
   * @param {string} playId   — Current play identifier
   */
  constructor(contract = {}, playId = 'unknown') {
    this.playId = playId;
    this.contract = this._normalizeContract(contract);
    this._store = new Map();       // key → MemoryEntry
    this._peers = new Map();       // playId → MemoryFederation (federated peers)
    this._acl = this._buildAcl();
    this._retentionMs = RETENTION_MS[this.contract.retention] || RETENTION_MS['1d'];
    this._stats = {
      reads: 0, writes: 0, evictions: 0,
      piiBlocked: 0, piiRedacted: 0,
      federationSyncs: 0, accessDenied: 0
    };
    this._maxBytes = (this.contract.maxSizeKB || 512) * 1024;
    this._currentBytes = 0;
  }

  // ── Contract validation ──────────────────────────────────────────────────

  _normalizeContract(c) {
    const contract = {
      scope:      SCOPES.includes(c.scope) ? c.scope : 'play-local',
      backend:    BACKENDS.includes(c.backend) ? c.backend : 'in-memory',
      retention:  RETENTION_MS[c.retention] ? c.retention : '1d',
      pii:        PII_POLICIES.includes(c.pii) ? c.pii : 'redact-before-store',
      encryption: c.encryption !== false,
      maxSizeKB:  typeof c.maxSizeKB === 'number' ? c.maxSizeKB : 512,
      eviction:   EVICTION_POLICIES.includes(c.eviction) ? c.eviction : 'lru',
      acl:        Array.isArray(c.acl) ? c.acl : [],
      federation: {
        enabled:      c.federation?.enabled === true,
        peers:        Array.isArray(c.federation?.peers) ? c.federation.peers : [],
        syncInterval: c.federation?.syncInterval || '5m'
      }
    };

    return contract;
  }

  static validateContract(contract) {
    const errors = [];
    if (contract.scope && !SCOPES.includes(contract.scope))
      errors.push(`Invalid scope "${contract.scope}". Must be one of: ${SCOPES.join(', ')}`);
    if (contract.backend && !BACKENDS.includes(contract.backend))
      errors.push(`Invalid backend "${contract.backend}". Must be one of: ${BACKENDS.join(', ')}`);
    if (contract.pii && !PII_POLICIES.includes(contract.pii))
      errors.push(`Invalid pii policy "${contract.pii}". Must be one of: ${PII_POLICIES.join(', ')}`);
    if (contract.eviction && !EVICTION_POLICIES.includes(contract.eviction))
      errors.push(`Invalid eviction policy "${contract.eviction}". Must be one of: ${EVICTION_POLICIES.join(', ')}`);
    if (contract.maxSizeKB && typeof contract.maxSizeKB !== 'number')
      errors.push('maxSizeKB must be a number');
    if (contract.retention && !RETENTION_MS[contract.retention])
      errors.push(`Invalid retention "${contract.retention}". Must be one of: ${Object.keys(RETENTION_MS).join(', ')}`);
    return errors;
  }

  // ── ACL ─────────────────────────────────────────────────────────────────

  _buildAcl() {
    const acl = new Map();
    for (const rule of this.contract.acl) {
      if (rule.agent) acl.set(rule.agent, rule.access || 'read');
    }
    return acl;
  }

  _checkAccess(agentId, operation) {
    if (this.contract.acl.length === 0) return true; // No ACL = open
    const access = this._acl.get(agentId) || this._acl.get('*');
    if (!access) return false;
    if (access === 'admin') return true;
    if (access === 'write') return true; // write implies read
    if (access === 'read') return operation === 'read';
    return false;
  }

  // ── PII Processing ───────────────────────────────────────────────────────

  _processPii(value) {
    if (this.contract.pii === 'allow') return { value, piiFound: false, redacted: false };

    const str = typeof value === 'string' ? value : JSON.stringify(value);
    let piiFound = false;
    let redacted = str;

    for (const { name, re } of PII_PATTERNS) {
      if (re.test(str)) {
        piiFound = true;
        re.lastIndex = 0;
        if (this.contract.pii === 'redact-before-store') {
          redacted = redacted.replace(re, `[REDACTED:${name.toUpperCase()}]`);
        } else if (this.contract.pii === 'block') {
          return { value: null, piiFound: true, blocked: true };
        }
      }
      re.lastIndex = 0;
    }

    return {
      value: typeof value === 'string' ? redacted : (() => { try { return JSON.parse(redacted); } catch { return redacted; } })(),
      piiFound,
      redacted: piiFound && this.contract.pii === 'redact-before-store'
    };
  }

  // ── Encryption ───────────────────────────────────────────────────────────

  _encrypt(value) {
    if (!this.contract.encryption) return { value, encrypted: false };
    // Production: use AES-256-GCM with KMS key. Here: deterministic encoding for demo.
    const str = typeof value === 'string' ? value : JSON.stringify(value);
    const encoded = Buffer.from(str).toString('base64');
    return { value: `enc:${encoded}`, encrypted: true };
  }

  _decrypt(value) {
    if (typeof value === 'string' && value.startsWith('enc:')) {
      const raw = Buffer.from(value.slice(4), 'base64').toString('utf8');
      try { return JSON.parse(raw); } catch { return raw; }
    }
    return value;
  }

  // ── Eviction ─────────────────────────────────────────────────────────────

  _evict() {
    if (this._store.size === 0) return;
    let target = null;

    if (this.contract.eviction === 'lru') {
      // Evict least recently accessed
      let oldest = Infinity;
      for (const [k, e] of this._store) {
        if (e.accessedAt < oldest) { oldest = e.accessedAt; target = k; }
      }
    } else if (this.contract.eviction === 'ttl') {
      // Evict first expired
      for (const [k, e] of this._store) {
        if (e.isExpired()) { target = k; break; }
      }
    } else if (this.contract.eviction === 'priority') {
      // Evict lowest priority
      let lowest = Infinity;
      for (const [k, e] of this._store) {
        if (e.priority < lowest) { lowest = e.priority; target = k; }
      }
    }

    if (target) {
      const entry = this._store.get(target);
      this._currentBytes -= this._sizeOf(entry);
      this._store.delete(target);
      this._stats.evictions++;
    }
  }

  _sizeOf(entry) {
    try {
      return JSON.stringify(entry).length * 2; // rough UTF-16 estimate
    } catch { return 256; }
  }

  // ── Core Operations ──────────────────────────────────────────────────────

  /**
   * Write a value to memory.
   * Enforces: ACL, PII policy, encryption, size limits, TTL
   */
  write(key, value, opts = {}) {
    const agentId = opts.agentId || 'system';

    // ACL check
    if (!this._checkAccess(agentId, 'write')) {
      this._stats.accessDenied++;
      return { ok: false, error: `Agent "${agentId}" does not have write access` };
    }

    // PII processing
    const piiResult = this._processPii(value);
    if (piiResult.blocked) {
      this._stats.piiBlocked++;
      return { ok: false, error: 'PII detected and policy is "block"', piiFound: true };
    }
    if (piiResult.piiFound) this._stats.piiRedacted++;

    // Encryption
    const { value: encrypted, encrypted: wasEncrypted } = this._encrypt(piiResult.value);

    // Create entry
    const ttlMs = opts.ttl ? this._parseTtl(opts.ttl) : this._retentionMs;
    const entry = new MemoryEntry(key, encrypted, {
      priority: opts.priority || 5,
      ttl: ttlMs === Infinity ? null : ttlMs,
      agentId,
      playId: this.playId,
      tags: opts.tags || [],
      encrypted: wasEncrypted,
      piiRedacted: piiResult.redacted
    });

    // Size management
    const entrySize = this._sizeOf(entry);
    while (this._currentBytes + entrySize > this._maxBytes && this._store.size > 0) {
      this._evict();
    }

    this._store.set(key, entry);
    this._currentBytes += entrySize;
    this._stats.writes++;

    return { ok: true, key, checksum: entry.checksum, encrypted: wasEncrypted, piiRedacted: piiResult.redacted };
  }

  /**
   * Read a value from memory.
   * Enforces: ACL, TTL expiry, decryption
   */
  read(key, opts = {}) {
    const agentId = opts.agentId || 'system';

    if (!this._checkAccess(agentId, 'read')) {
      this._stats.accessDenied++;
      return { ok: false, error: `Agent "${agentId}" does not have read access` };
    }

    const entry = this._store.get(key);
    if (!entry) return { ok: false, error: 'Key not found' };

    if (entry.isExpired()) {
      this._store.delete(key);
      this._currentBytes -= this._sizeOf(entry);
      return { ok: false, error: 'Memory entry expired' };
    }

    entry.touch();
    this._stats.reads++;
    const value = entry.encrypted ? this._decrypt(entry.value) : entry.value;

    return {
      ok: true, key, value,
      meta: {
        createdAt: entry.createdAt,
        accessCount: entry.accessCount,
        piiRedacted: entry.piiRedacted,
        encrypted: entry.encrypted,
        checksum: entry.checksum
      }
    };
  }

  /**
   * Delete a key from memory (right-to-deletion support).
   */
  delete(key, opts = {}) {
    const agentId = opts.agentId || 'system';
    if (!this._checkAccess(agentId, 'write')) {
      this._stats.accessDenied++;
      return { ok: false, error: `Agent "${agentId}" does not have write access` };
    }
    const entry = this._store.get(key);
    if (!entry) return { ok: false, error: 'Key not found' };
    this._currentBytes -= this._sizeOf(entry);
    this._store.delete(key);
    return { ok: true, key, deleted: true };
  }

  /** Scan keys by tag, agentId, or prefix */
  scan(filter = {}) {
    const results = [];
    for (const [k, e] of this._store) {
      if (e.isExpired()) continue;
      if (filter.tag && !e.tags.includes(filter.tag)) continue;
      if (filter.agentId && e.agentId !== filter.agentId) continue;
      if (filter.prefix && !k.startsWith(filter.prefix)) continue;
      results.push({ key: k, meta: { createdAt: e.createdAt, agentId: e.agentId, tags: e.tags } });
    }
    return results;
  }

  // ── Federation ───────────────────────────────────────────────────────────

  /**
   * Register a peer memory federation (cross-play memory sharing).
   */
  registerPeer(playId, federation) {
    if (!this.contract.federation.enabled) {
      return { ok: false, error: 'Federation not enabled in memory contract' };
    }
    if (!this.contract.federation.peers.includes(playId)) {
      return { ok: false, error: `Play "${playId}" not in allowed federation peers` };
    }
    this._peers.set(playId, federation);
    return { ok: true, peersConnected: this._peers.size };
  }

  /**
   * Read from federated memory (cross-play).
   */
  readFederated(key, opts = {}) {
    if (!this.contract.federation.enabled) {
      return { ok: false, error: 'Federation not enabled' };
    }

    // Try local first
    const local = this.read(key, opts);
    if (local.ok) return { ...local, source: 'local' };

    // Try peers
    for (const [peerId, peer] of this._peers) {
      const result = peer.read(key, { agentId: `federation:${this.playId}` });
      if (result.ok) {
        this._stats.federationSyncs++;
        return { ...result, source: `federated:${peerId}` };
      }
    }

    return { ok: false, error: 'Key not found in local or federated memory' };
  }

  /**
   * Sync memory with a peer (push local keys to peer).
   */
  syncToPeer(playId) {
    const peer = this._peers.get(playId);
    if (!peer) return { ok: false, error: `Peer "${playId}" not registered` };

    let synced = 0;
    const errors = [];
    for (const [k, e] of this._store) {
      if (e.isExpired()) continue;
      const value = e.encrypted ? this._decrypt(e.value) : e.value;
      const result = peer.write(k, value, { agentId: `sync:${this.playId}`, tags: [...e.tags, 'federated'] });
      if (result.ok) synced++;
      else errors.push({ key: k, error: result.error });
    }
    this._stats.federationSyncs++;
    return { ok: true, synced, errors };
  }

  // ── Snapshot & Restore ───────────────────────────────────────────────────

  snapshot() {
    const entries = {};
    for (const [k, e] of this._store) {
      if (!e.isExpired()) {
        entries[k] = {
          value: e.value,
          createdAt: e.createdAt,
          ttl: e.ttl,
          agentId: e.agentId,
          tags: e.tags,
          encrypted: e.encrypted,
          piiRedacted: e.piiRedacted,
          priority: e.priority
        };
      }
    }
    return {
      playId: this.playId,
      contract: this.contract,
      entries,
      stats: this._stats,
      snapshotAt: new Date().toISOString()
    };
  }

  restore(snapshot) {
    this._store.clear();
    this._currentBytes = 0;
    for (const [k, e] of Object.entries(snapshot.entries || {})) {
      const entry = new MemoryEntry(k, e.value, {
        priority: e.priority, ttl: e.ttl,
        agentId: e.agentId, tags: e.tags,
        encrypted: e.encrypted, piiRedacted: e.piiRedacted
      });
      entry.createdAt = e.createdAt;
      this._store.set(k, entry);
      this._currentBytes += this._sizeOf(entry);
    }
    return { ok: true, restored: this._store.size };
  }

  // ── Right-to-Deletion (GDPR) ─────────────────────────────────────────────

  /**
   * Delete all memory entries associated with a user/session.
   * Returns count of deleted entries for audit log.
   */
  rightToDeletion(subjectId) {
    const deleted = [];
    for (const [k, e] of this._store) {
      if (e.tags.includes(`subject:${subjectId}`) || e.agentId === subjectId) {
        deleted.push(k);
        this._currentBytes -= this._sizeOf(e);
        this._store.delete(k);
      }
    }
    // Propagate to peers
    for (const [peerId, peer] of this._peers) {
      peer.rightToDeletion(subjectId);
    }
    return {
      ok: true,
      subjectId,
      deletedCount: deleted.length,
      deletedKeys: deleted,
      propagatedToPeers: this._peers.size,
      timestamp: new Date().toISOString()
    };
  }

  // ── Stats & Health ───────────────────────────────────────────────────────

  stats() {
    // Clean expired entries before reporting
    let expired = 0;
    for (const [k, e] of this._store) {
      if (e.isExpired()) { this._store.delete(k); expired++; }
    }

    return {
      playId: this.playId,
      contract: {
        scope: this.contract.scope,
        backend: this.contract.backend,
        retention: this.contract.retention,
        pii: this.contract.pii,
        encryption: this.contract.encryption,
        eviction: this.contract.eviction,
        federationEnabled: this.contract.federation.enabled,
        federationPeers: this.contract.federation.peers.length
      },
      storage: {
        entries: this._store.size,
        expiredCleaned: expired,
        usedKB: Math.round(this._currentBytes / 1024),
        maxKB: this.contract.maxSizeKB,
        utilizationPct: Math.round(this._currentBytes / this._maxBytes * 100)
      },
      operations: this._stats,
      connectedPeers: this._peers.size
    };
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  _parseTtl(ttl) {
    if (typeof ttl === 'number') return ttl;
    if (typeof ttl === 'string') {
      const ms = RETENTION_MS[ttl];
      if (ms) return ms;
      const m = ttl.match(/^(\d+)(s|m|h|d)$/);
      if (m) {
        const n = parseInt(m[1]);
        const unit = { s: 1000, m: 60000, h: 3600000, d: 86400000 }[m[2]];
        return n * unit;
      }
    }
    return RETENTION_MS['1d'];
  }
}

// ── Factory function (used by FAI Engine) ────────────────────────────────────

function createMemoryFederation(manifest, playId) {
  const contract = manifest?.memory || {};
  const errors = MemoryFederation.validateContract(contract);
  if (errors.length > 0) {
    throw new Error(`Invalid memory contract: ${errors.join('; ')}`);
  }
  return new MemoryFederation(contract, playId || manifest?.play || 'unknown');
}

module.exports = { MemoryFederation, createMemoryFederation, SCOPES, BACKENDS, PII_POLICIES, RETENTION_MS };
