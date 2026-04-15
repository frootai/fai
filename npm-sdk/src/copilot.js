/**
 * FrootAI Copilot SDK — Session management, error handling, event system.
 *
 * Provides wrappers for building agentic applications within the FAI ecosystem.
 * Each pattern is a reusable class that integrates with FrootAI evaluation,
 * knowledge, and hooks.
 *
 * Usage:
 *   import { CopilotSession, RetryConfig } from 'frootai';
 *
 *   const session = new CopilotSession({ systemPrompt: 'You are a RAG expert' });
 *   await session.start();
 *   const response = await session.send('Explain hybrid search');
 *   await session.stop();
 *
 *   // Parallel sessions
 *   const pool = CopilotSession.createPool(3, { systemPrompt: 'Analyze code' });
 *   const results = await CopilotSession.runParallel(pool, prompts);
 */

import { randomUUID } from 'crypto';
import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// ── Error Types ──────────────────────────────────────────────────────────────

export class CopilotError extends Error {
  constructor(message) { super(message); this.name = 'CopilotError'; }
}

export class CopilotTimeoutError extends CopilotError {
  constructor(timeout, operation = 'send') {
    super(`${operation} timed out after ${timeout}s`);
    this.name = 'CopilotTimeoutError';
    this.timeout = timeout;
    this.operation = operation;
  }
}

export class CopilotRateLimitError extends CopilotError {
  constructor(retryAfter = 1.0) {
    super(`Rate limited, retry after ${retryAfter}s`);
    this.name = 'CopilotRateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class CopilotContentFilterError extends CopilotError {
  constructor(message = 'Content blocked by safety filters') {
    super(message);
    this.name = 'CopilotContentFilterError';
  }
}

export class CopilotConnectionError extends CopilotError {
  constructor(message = 'Connection to Copilot failed') {
    super(message);
    this.name = 'CopilotConnectionError';
  }
}

// ── Retry Configuration ─────────────────────────────────────────────────────

export class RetryConfig {
  /**
   * @param {object} [opts]
   * @param {number} [opts.maxAttempts=3]
   * @param {number} [opts.baseDelay=1.0] - seconds
   * @param {number} [opts.maxDelay=30.0] - seconds
   */
  constructor({ maxAttempts = 3, baseDelay = 1.0, maxDelay = 30.0 } = {}) {
    this.maxAttempts = maxAttempts;
    this.baseDelay = baseDelay;
    this.maxDelay = maxDelay;
    this.retryableErrors = [CopilotTimeoutError, CopilotRateLimitError, CopilotConnectionError];
  }

  /** Calculate delay with exponential backoff + jitter */
  delayForAttempt(attempt) {
    const delay = Math.min(this.baseDelay * (2 ** attempt), this.maxDelay);
    const jitter = Math.random() * delay * 0.1;
    return delay + jitter;
  }

  /** Check if an error is retryable */
  isRetryable(error) {
    return this.retryableErrors.some(E => error instanceof E);
  }
}

// ── Event System ─────────────────────────────────────────────────────────────

export class CopilotEvent {
  constructor(type, data = null, sessionId = '') {
    this.type = type;
    this.data = data;
    this.timestamp = Date.now();
    this.sessionId = sessionId;
  }
}

export class EventEmitter {
  constructor() { this._handlers = {}; }

  /** Register an event handler. Returns self for chaining. */
  on(eventType, handler) {
    if (!this._handlers[eventType]) this._handlers[eventType] = [];
    this._handlers[eventType].push(handler);
    return this;
  }

  /** Remove an event handler. */
  off(eventType, handler) {
    if (this._handlers[eventType]) {
      this._handlers[eventType] = this._handlers[eventType].filter(h => h !== handler);
    }
  }

  /** Emit an event to all registered handlers. */
  async emit(event) {
    for (const handler of this._handlers[event.type] || []) {
      await handler(event);
    }
    // Wildcard handlers
    for (const handler of this._handlers['*'] || []) {
      await handler(event);
    }
  }
}

// ── Session Message ──────────────────────────────────────────────────────────

export class SessionMessage {
  constructor(role, content) {
    this.role = role;
    this.content = content;
    this.timestamp = Date.now();
    this.toolCalls = [];
  }
}

// ── Copilot Session ──────────────────────────────────────────────────────────

export class CopilotSession {
  /**
   * @param {object} [opts]
   * @param {string} [opts.sessionId]
   * @param {string} [opts.systemPrompt]
   * @param {string[]} [opts.knowledgeModules] - FROOT module IDs to inject
   * @param {string[]} [opts.wafPillars] - WAF pillars to enforce
   * @param {RetryConfig} [opts.retry]
   * @param {number} [opts.timeout=60] - Default timeout in seconds
   */
  constructor({
    sessionId = null,
    systemPrompt = null,
    knowledgeModules = [],
    wafPillars = [],
    retry = null,
    timeout = 60,
  } = {}) {
    this.sessionId = sessionId || `fai-${randomUUID().slice(0, 8)}`;
    this.systemPrompt = systemPrompt;
    this.knowledgeModules = knowledgeModules;
    this.wafPillars = wafPillars;
    this.retry = retry || new RetryConfig();
    this.timeout = timeout;
    this.events = new EventEmitter();
    this.messages = [];
    this._started = false;
    this._startTime = null;
  }

  /** Start the session. */
  async start() {
    this._started = true;
    this._startTime = Date.now();

    if (this.systemPrompt) {
      this.messages.push(new SessionMessage('system', this._buildSystemMessage()));
    }

    await this.events.emit(new CopilotEvent('session.start', {
      knowledge: this.knowledgeModules, waf: this.wafPillars,
    }, this.sessionId));
  }

  /** Stop the session. */
  async stop() {
    const durationS = this._startTime ? Math.round((Date.now() - this._startTime) / 1000 * 100) / 100 : 0;
    await this.events.emit(new CopilotEvent('session.end', {
      messages: this.messages.length, durationS,
    }, this.sessionId));
    this._started = false;
  }

  /**
   * Send a message and wait for response with retry logic.
   * @param {string} prompt
   * @param {number} [timeout] - Override default timeout
   * @returns {Promise<string>}
   */
  async send(prompt, timeout = null) {
    const effectiveTimeout = timeout || this.timeout;
    this.messages.push(new SessionMessage('user', prompt));

    let lastError = null;
    for (let attempt = 0; attempt < this.retry.maxAttempts; attempt++) {
      try {
        await this.events.emit(new CopilotEvent('send.start', {
          attempt: attempt + 1, promptLength: prompt.length,
        }, this.sessionId));

        const response = await this._withTimeout(
          this._executeSend(prompt),
          effectiveTimeout * 1000,
        );

        this.messages.push(new SessionMessage('assistant', response));
        await this.events.emit(new CopilotEvent('message', {
          role: 'assistant', length: response.length,
        }, this.sessionId));
        return response;

      } catch (err) {
        if (err instanceof CopilotContentFilterError) throw err;

        lastError = err.name === 'TimeoutError' || err.message?.includes('timed out')
          ? new CopilotTimeoutError(effectiveTimeout)
          : err;

        await this.events.emit(new CopilotEvent('error', {
          error: lastError.message, attempt: attempt + 1,
        }, this.sessionId));

        if (!(lastError instanceof CopilotError) || !this.retry.isRetryable(lastError)) throw lastError;

        if (attempt < this.retry.maxAttempts - 1) {
          const delay = this.retry.delayForAttempt(attempt);
          await new Promise(resolve => setTimeout(resolve, delay * 1000));
        }
      }
    }

    throw lastError || new CopilotError('All retry attempts failed');
  }

  /**
   * Execute the actual send. Override this to integrate with real Copilot SDK.
   * Default returns a placeholder for testing.
   */
  async _executeSend(prompt) {
    await new Promise(resolve => setTimeout(resolve, 10));
    return `[FAI Response to: ${prompt.slice(0, 50)}...]`;
  }

  /** Build system prompt with FAI context injection. */
  _buildSystemMessage() {
    const parts = [this.systemPrompt];
    if (this.knowledgeModules.length > 0) {
      parts.push(`\nFROOT Knowledge Modules: ${this.knowledgeModules.join(', ')}`);
    }
    if (this.wafPillars.length > 0) {
      parts.push(`WAF Pillars: ${this.wafPillars.join(', ')}`);
      parts.push('Apply these WAF pillars to all code suggestions and architecture recommendations.');
    }
    parts.push('\nYou are operating within the FrootAI FAI ecosystem. '
      + 'Primitives are connected via fai-manifest.json. '
      + 'Every response should be Frootful — connected, evaluated, deterministic.');
    return parts.join('\n');
  }

  /** Promise with timeout wrapper. */
  async _withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new CopilotTimeoutError(ms / 1000)), ms)),
    ]);
  }

  // ── Persistence ──────────────────────────────────────────────────────

  /** Save session state to disk. */
  save(path) {
    const state = {
      sessionId: this.sessionId,
      systemPrompt: this.systemPrompt,
      knowledgeModules: this.knowledgeModules,
      wafPillars: this.wafPillars,
      messages: this.messages.map(m => ({
        role: m.role, content: m.content, timestamp: m.timestamp,
      })),
      created: this._startTime,
      saved: Date.now(),
    };
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(state, null, 2));
  }

  /** Load a persisted session from disk. */
  static load(path, opts = {}) {
    const state = JSON.parse(readFileSync(path, 'utf-8'));
    const session = new CopilotSession({
      sessionId: state.sessionId,
      systemPrompt: state.systemPrompt,
      knowledgeModules: state.knowledgeModules || [],
      wafPillars: state.wafPillars || [],
      ...opts,
    });
    session.messages = (state.messages || []).map(m =>
      Object.assign(new SessionMessage(m.role, m.content), { timestamp: m.timestamp })
    );
    session._startTime = state.created;
    session._started = true;
    return session;
  }

  // ── Parallel Sessions ────────────────────────────────────────────────

  /** Create a pool of parallel sessions with isolated contexts. */
  static createPool(count, opts = {}) {
    return Array.from({ length: count }, (_, i) =>
      new CopilotSession({
        ...opts,
        sessionId: `fai-pool-${i + 1}-${randomUUID().slice(0, 4)}`,
      })
    );
  }

  /** Run prompts across parallel sessions concurrently. */
  static async runParallel(sessions, prompts) {
    const tasks = prompts.map(async (prompt, i) => {
      const session = sessions[i % sessions.length];
      await session.start();
      try {
        return await session.send(prompt);
      } finally {
        await session.stop();
      }
    });
    return Promise.all(tasks);
  }
}
