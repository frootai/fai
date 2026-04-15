/**
 * FrootAI Agentic Loop — Autonomous task execution with disk-based shared state.
 *
 * Implements the Ralph Loop pattern adapted for the FAI ecosystem:
 * - Plan on disk (implementation plan as shared state)
 * - Fresh context per iteration (prevents hallucination accumulation)
 * - Evaluation as backpressure (must pass quality gates before next task)
 * - Multi-agent dispatch (route tasks to specialized agents)
 *
 * Usage:
 *   import { AgenticLoop, Task } from 'frootai';
 *
 *   const loop = new AgenticLoop({ planFile: 'spec/plan.json' });
 *   loop.addTask(new Task('Create RAG pipeline', 'builder'));
 *   loop.addTask(new Task('Write integration tests', 'tester'));
 *
 *   const result = await loop.run({
 *     validationCmd: 'npm run validate:primitives',
 *     onTaskComplete: (t) => console.log(`Done: ${t.title}`),
 *   });
 */

import { exec } from 'child_process';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { CopilotSession, CopilotError, RetryConfig } from './copilot.js';

// ── Task Status ──────────────────────────────────────────────────────────────

export const TaskStatus = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  SKIPPED: 'skipped',
});

// ── Task ─────────────────────────────────────────────────────────────────────

export class Task {
  /**
   * @param {string} title
   * @param {string} [agent='builder'] - builder, reviewer, tuner, tester, or custom
   * @param {string} [description='']
   */
  constructor(title, agent = 'builder', description = '') {
    this.title = title;
    this.agent = agent;
    this.description = description;
    this.status = TaskStatus.PENDING;
    this.result = '';
    this.startedAt = null;
    this.completedAt = null;
    this.attempt = 0;
    this.maxAttempts = 3;
  }

  get durationS() {
    if (this.startedAt && this.completedAt) {
      return Math.round((this.completedAt - this.startedAt) / 1000 * 100) / 100;
    }
    return 0;
  }
}

// ── Loop Config ──────────────────────────────────────────────────────────────

export class LoopConfig {
  constructor({
    maxIterations = 50,
    validationCmd = null,
    requireValidation = true,
    timeoutPerTask = 120,
    knowledgeModules = [],
    wafPillars = [],
    retry = null,
  } = {}) {
    this.maxIterations = maxIterations;
    this.validationCmd = validationCmd;
    this.requireValidation = requireValidation;
    this.timeoutPerTask = timeoutPerTask;
    this.knowledgeModules = knowledgeModules;
    this.wafPillars = wafPillars;
    this.retry = retry || new RetryConfig();
  }
}

// ── Agentic Loop ─────────────────────────────────────────────────────────────

export class AgenticLoop {
  /**
   * @param {object} [opts]
   * @param {string} [opts.planFile='spec/plan.json']
   * @param {LoopConfig} [opts.config]
   */
  constructor({ planFile = 'spec/plan.json', config = null } = {}) {
    this.planFile = planFile;
    this.config = config || new LoopConfig();
    this.tasks = [];
    this.iteration = 0;
    this.log = [];

    if (existsSync(this.planFile)) {
      this._loadPlan();
    }
  }

  /** Add a task. Returns self for chaining. */
  addTask(task) {
    this.tasks.push(task);
    return this;
  }

  /** Add multiple tasks. Returns self for chaining. */
  addTasks(tasks) {
    this.tasks.push(...tasks);
    return this;
  }

  get pendingTasks() { return this.tasks.filter(t => t.status === TaskStatus.PENDING); }
  get completedTasks() { return this.tasks.filter(t => t.status === TaskStatus.COMPLETED); }
  get failedTasks() { return this.tasks.filter(t => t.status === TaskStatus.FAILED); }
  get progress() { return this.tasks.length ? this.completedTasks.length / this.tasks.length : 0; }

  /**
   * Execute the loop until all tasks done or max iterations reached.
   * @param {object} [opts]
   * @param {string} [opts.validationCmd]
   * @param {function} [opts.onTaskComplete] - (task) => void
   * @param {function} [opts.onTaskFailed] - (task, error) => void
   * @param {function} [opts.onIteration] - (iteration, task) => void
   * @returns {Promise<object>} Summary
   */
  async run({ validationCmd, onTaskComplete, onTaskFailed, onIteration } = {}) {
    const effectiveValidation = validationCmd || this.config.validationCmd;
    const startTime = Date.now();

    for (let i = 0; i < this.config.maxIterations; i++) {
      this.iteration = i + 1;

      const task = this._nextTask();
      if (!task) break;

      if (onIteration) onIteration(this.iteration, task);

      task.status = TaskStatus.IN_PROGRESS;
      task.startedAt = Date.now();
      task.attempt++;

      try {
        const result = await this._executeTask(task);
        task.result = result;

        // Validation backpressure
        if (effectiveValidation && this.config.requireValidation) {
          const passed = await this._runValidation(effectiveValidation);
          if (!passed) {
            task.status = TaskStatus.FAILED;
            task.result += '\n[VALIDATION FAILED]';
            if (onTaskFailed) onTaskFailed(task, 'Validation failed');
            this._logIteration(task, 'validation_failed');
            this._savePlan();
            continue;
          }
        }

        task.status = TaskStatus.COMPLETED;
        task.completedAt = Date.now();
        if (onTaskComplete) onTaskComplete(task);
        this._logIteration(task, 'completed');

      } catch (err) {
        task.status = task.attempt >= task.maxAttempts ? TaskStatus.FAILED : TaskStatus.PENDING;
        task.result = err.message || String(err);
        if (onTaskFailed) onTaskFailed(task, err);
        this._logIteration(task, 'failed');
      }

      this._savePlan();
    }

    const durationS = Math.round((Date.now() - startTime) / 1000 * 100) / 100;
    return {
      totalTasks: this.tasks.length,
      completed: this.completedTasks.length,
      failed: this.failedTasks.length,
      pending: this.pendingTasks.length,
      iterations: this.iteration,
      durationS,
      progress: `${Math.round(this.progress * 100)}%`,
    };
  }

  /** Execute a single task with a fresh CopilotSession. */
  async _executeTask(task) {
    const agentPrompts = {
      builder: 'You are a FrootAI builder agent. Implement the task with production-quality code.',
      reviewer: 'You are a FrootAI reviewer agent. Check WAF compliance, security, and code quality.',
      tuner: 'You are a FrootAI tuner agent. Optimize configuration, thresholds, and performance.',
      tester: 'You are a FrootAI test agent. Generate comprehensive tests with edge cases.',
    };

    const systemPrompt = agentPrompts[task.agent] || `You are a FrootAI ${task.agent} agent.`;
    const session = new CopilotSession({
      systemPrompt,
      knowledgeModules: this.config.knowledgeModules,
      wafPillars: this.config.wafPillars,
      timeout: this.config.timeoutPerTask,
      retry: this.config.retry,
    });

    await session.start();
    try {
      return await session.send(this._buildTaskPrompt(task));
    } finally {
      await session.stop();
    }
  }

  /** Build prompt for a task including plan context. */
  _buildTaskPrompt(task) {
    const parts = [`## Task: ${task.title}`];
    if (task.description) parts.push(`\n${task.description}`);

    const completed = this.completedTasks.map(t => t.title);
    if (completed.length > 0) {
      parts.push(`\n### Already Completed:\n` + completed.map(t => `- ✅ ${t}`).join('\n'));
    }

    const remaining = this.pendingTasks.filter(t => t !== task).slice(0, 5).map(t => t.title);
    if (remaining.length > 0) {
      parts.push(`\n### Still Pending:\n` + remaining.map(t => `- ⬜ ${t}`).join('\n'));
    }

    parts.push('\n### Rules:\n1. Focus ONLY on this specific task\n2. Output production-quality code\n3. Follow WAF pillars if specified\n4. Be concise — no explanations unless asked');
    return parts.join('\n');
  }

  /** Run a shell command as validation backpressure. */
  _runValidation(cmd) {
    return new Promise(resolve => {
      const proc = exec(cmd, { timeout: 60000 }, (error) => {
        resolve(!error);
      });
      proc.on('error', () => resolve(false));
    });
  }

  _nextTask() {
    return this.tasks.find(t => t.status === TaskStatus.PENDING) || null;
  }

  _logIteration(task, status) {
    this.log.push({
      iteration: this.iteration,
      task: task.title,
      agent: task.agent,
      status,
      attempt: task.attempt,
      timestamp: Date.now(),
    });
  }

  _savePlan() {
    const dir = dirname(this.planFile);
    mkdirSync(dir, { recursive: true });
    const state = {
      iteration: this.iteration,
      tasks: this.tasks.map(t => ({
        title: t.title, agent: t.agent, description: t.description,
        status: t.status, result: t.result, attempt: t.attempt,
        startedAt: t.startedAt, completedAt: t.completedAt,
      })),
      log: this.log,
      savedAt: Date.now(),
    };
    writeFileSync(this.planFile, JSON.stringify(state, null, 2));
  }

  _loadPlan() {
    try {
      const state = JSON.parse(readFileSync(this.planFile, 'utf-8'));
      this.iteration = state.iteration || 0;
      this.log = state.log || [];
      this.tasks = (state.tasks || []).map(t => {
        const task = new Task(t.title, t.agent || 'builder', t.description || '');
        task.status = t.status || TaskStatus.PENDING;
        task.result = t.result || '';
        task.attempt = t.attempt || 0;
        task.startedAt = t.startedAt;
        task.completedAt = t.completedAt;
        return task;
      });
    } catch {
      // Start fresh if corrupted
    }
  }
}

// ── Convenience function ─────────────────────────────────────────────────────

/**
 * Quick way to run an agentic loop from a list of task dicts.
 *
 * @param {object} opts
 * @param {Array<{title: string, agent?: string, description?: string}>} opts.tasks
 * @param {string} [opts.planFile='spec/plan.json']
 * @param {string} [opts.validationCmd]
 * @param {string[]} [opts.knowledge]
 * @param {string[]} [opts.waf]
 * @returns {Promise<object>}
 */
export async function runPlan({ tasks, planFile = 'spec/plan.json', validationCmd, knowledge = [], waf = [] }) {
  const config = new LoopConfig({
    knowledgeModules: knowledge,
    wafPillars: waf,
    validationCmd,
  });

  const loop = new AgenticLoop({ planFile, config });
  for (const t of tasks) {
    loop.addTask(new Task(t.title, t.agent || 'builder', t.description || ''));
  }
  return loop.run();
}
