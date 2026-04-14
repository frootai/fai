/**
 * FAI Engine — Primitive Wirer
 * Connects agents to skills, instructions, and hooks based on the manifest.
 *
 * The wiring is what makes FrootAI unique: primitives become aware of each other
 * through the FAI Layer. An agent knows which skills it can invoke, which
 * instructions constrain it, and which hooks guard it.
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { resolve, basename, extname, join } from 'path';

/**
 * Parse YAML frontmatter from a markdown file.
 */
function parseFrontmatter(content) {
  if (!content || !content.startsWith('---')) return {};
  const end = content.indexOf('---', 3);
  if (end === -1) return {};
  const yaml = content.substring(3, end).trim();
  const result = {};
  for (const line of yaml.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;
    const key = trimmed.substring(0, colonIdx).trim();
    let val = trimmed.substring(colonIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    }
    result[key] = val;
  }
  return result;
}

/**
 * Load a single primitive file and extract metadata.
 * Handles both files and directories (resolves to key file inside).
 * @param {string} absPath - Absolute path to the primitive
 * @param {string} type - Primitive type (agent, instruction, skill, hook)
 * @returns {object} Primitive metadata
 */
function loadPrimitive(absPath, type) {
  if (!existsSync(absPath)) {
    return { path: absPath, type, loaded: false, error: 'File not found' };
  }

  const stats = statSync(absPath);

  // If it's a directory, resolve to the key file inside
  if (stats.isDirectory()) {
    let keyFile;
    if (type === 'skill') {
      keyFile = join(absPath, 'SKILL.md');
    } else if (type === 'hook') {
      keyFile = join(absPath, 'hooks.json');
    } else {
      // For other types, look for any .md or .json file
      const files = readdirSync(absPath);
      const candidate = files.find(f => f.endsWith('.md') || f.endsWith('.json'));
      keyFile = candidate ? join(absPath, candidate) : null;
    }

    if (!keyFile || !existsSync(keyFile)) {
      return { path: absPath, type, loaded: true, name: basename(absPath), isDirectory: true, data: {} };
    }
    absPath = keyFile;
  }

  const ext = extname(absPath);
  const name = basename(absPath, ext);

  if (ext === '.json') {
    try {
      const data = JSON.parse(readFileSync(absPath, 'utf8'));
      return { path: absPath, type, loaded: true, name, data };
    } catch (err) {
      return { path: absPath, type, loaded: false, error: err.message };
    }
  }

  // Markdown files (.agent.md, .instructions.md, SKILL.md)
  const content = readFileSync(absPath, 'utf8');
  const frontmatter = parseFrontmatter(content);

  return {
    path: absPath,
    type,
    loaded: true,
    name: frontmatter.name || name,
    description: frontmatter.description || '',
    waf: frontmatter.waf || [],
    content,
    frontmatter
  };
}

/**
 * Wire all primitives from resolved paths into a connected graph.
 * @param {object} resolvedPaths - Output from manifest-reader.resolvePaths()
 * @param {object} context - Output from context-resolver.buildContext()
 * @returns {{ primitives: object, stats: object, errors: string[] }}
 */
function wirePrimitives(resolvedPaths, context) {
  const errors = [];
  const primitives = {
    agents: [],
    instructions: [],
    skills: [],
    hooks: [],
    workflows: []
  };

  // Load each primitive type
  for (const type of Object.keys(primitives)) {
    const items = resolvedPaths[type] || [];
    for (const item of items) {
      if (!item.exists) {
        errors.push(`${type}: ${item.relative} not found`);
        continue;
      }
      const loaded = loadPrimitive(item.absolute, type.slice(0, -1)); // 'agents' → 'agent'
      if (loaded.loaded) {
        // Inject shared context reference
        loaded.sharedContext = {
          scope: context.scope,
          knowledgeModules: context.knowledge.map(m => m.id),
          wafPillars: context.waf.map(w => w.pillar)
        };
        primitives[type].push(loaded);
      } else {
        errors.push(`${type}: failed to load ${item.relative} — ${loaded.error}`);
      }
    }
  }

  const stats = {
    agents: primitives.agents.length,
    instructions: primitives.instructions.length,
    skills: primitives.skills.length,
    hooks: primitives.hooks.length,
    workflows: primitives.workflows.length,
    total: Object.values(primitives).reduce((sum, arr) => sum + arr.length, 0)
  };

  return { primitives, stats, errors };
}

export { wirePrimitives, loadPrimitive, parseFrontmatter };
