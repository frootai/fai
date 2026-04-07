/**
 * FAI Engine — Hook Runner
 * Executes hooks at the correct session lifecycle events.
 *
 * Events: sessionStart, sessionEnd, userPromptSubmitted, preToolUse
 * Hooks run as bash scripts with configurable timeout and environment.
 */

const { readFileSync, existsSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

/**
 * Load hooks.json from a hook directory.
 * @param {string} hookDir - Absolute path to the hook folder
 * @returns {{ config: object|null, error: string|null }}
 */
function loadHookConfig(hookDir) {
  const configPath = join(hookDir, 'hooks.json');
  if (!existsSync(configPath)) {
    return { config: null, error: `hooks.json not found in ${hookDir}` };
  }
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    return { config, error: null };
  } catch (err) {
    return { config: null, error: `Invalid JSON in ${configPath}: ${err.message}` };
  }
}

/**
 * Run a single hook command.
 * @param {object} command - Hook command definition { type, bash, cwd, env, timeoutSec }
 * @param {string} hookDir - Base directory of the hook
 * @param {string} [stdin] - Optional stdin content (for userPromptSubmitted, preToolUse)
 * @returns {{ success: boolean, output: string, exitCode: number, duration: number }}
 */
function runCommand(command, hookDir, stdin = '') {
  const scriptPath = join(hookDir, command.bash);
  if (!existsSync(scriptPath)) {
    return { success: false, output: `Script not found: ${scriptPath}`, exitCode: -1, duration: 0 };
  }

  const cwd = command.cwd === '.' ? hookDir : join(hookDir, command.cwd || '.');
  const timeout = (command.timeoutSec || 30) * 1000;
  const env = { ...process.env, ...(command.env || {}) };

  const start = Date.now();
  try {
    const output = execSync(`bash "${scriptPath}"`, {
      cwd,
      env,
      input: stdin,
      timeout,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return { success: true, output: output.trim(), exitCode: 0, duration: Date.now() - start };
  } catch (err) {
    const exitCode = err.status || 1;
    const output = (err.stdout || '') + (err.stderr || '');
    return { success: exitCode === 0, output: output.trim(), exitCode, duration: Date.now() - start };
  }
}

/**
 * Run all hooks for a given event across all loaded hook directories.
 * @param {string} event - Event name (sessionStart, sessionEnd, etc.)
 * @param {object[]} hookPaths - Array of { absolute } paths to hook directories
 * @param {string} [stdin] - Optional stdin for the event
 * @returns {{ results: object[], blocked: boolean, errors: string[] }}
 */
function runHooksForEvent(event, hookPaths, stdin = '') {
  const results = [];
  const errors = [];
  let blocked = false;

  for (const hookPath of hookPaths) {
    const dir = hookPath.absolute || hookPath;
    const { config, error } = loadHookConfig(dir);

    if (error) {
      errors.push(error);
      continue;
    }

    if (!config.hooks || !config.hooks[event]) continue;

    for (const command of config.hooks[event]) {
      const result = runCommand(command, dir, stdin);
      results.push({
        hook: dir,
        event,
        script: command.bash,
        ...result
      });

      if (result.exitCode !== 0) {
        blocked = true;
        errors.push(`Hook ${command.bash} blocked with exit code ${result.exitCode}`);
      }
    }
  }

  return { results, blocked, errors };
}

module.exports = { loadHookConfig, runCommand, runHooksForEvent };
