#!/usr/bin/env node
/**
 * FrootAI — Generate Website Data
 * 
 * Extracts metadata from all primitives and generates JSON feeds
 * for the frootai.dev website. Outputs to `website-data/` folder.
 * 
 * Generated files:
 *   - agents.json      — All 201+ agents with metadata
 *   - instructions.json — All 176+ instructions with metadata
 *   - skills.json       — All 282+ skills with metadata
 *   - hooks.json        — All 10 hooks with metadata
 *   - plugins.json      — All 77+ plugins with item counts
 *   - workflows.json    — All 12 workflows with metadata
 *   - cookbook.json      — All 16 recipes with metadata
 *   - stats.json        — Aggregate statistics
 * 
 * Usage:
 *   node scripts/generate-website-data.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'website-data');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      let val = rest.join(':').trim();
      // Strip quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      fm[key.trim()] = val;
    }
  }
  return fm;
}

function getFileSize(filePath) {
  try { return fs.statSync(filePath).size; } catch { return 0; }
}

// ─── Agents ───────────────────────────────────────────────────────────────────

function extractAgents() {
  const dir = path.join(ROOT, 'agents');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.agent.md'))
    .map(f => {
      const content = fs.readFileSync(path.join(dir, f), 'utf8');
      const fm = parseFrontmatter(content);
      const name = f.replace('.agent.md', '');
      return {
        id: name,
        name: fm.name || name.replace(/^frootai-/, '').replace(/-/g, ' '),
        description: fm.description || '',
        waf: fm.waf || [],
        file: `agents/${f}`,
        size: getFileSize(path.join(dir, f))
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

// ─── Instructions ─────────────────────────────────────────────────────────────

function extractInstructions() {
  const dir = path.join(ROOT, 'instructions');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.instructions.md'))
    .map(f => {
      const content = fs.readFileSync(path.join(dir, f), 'utf8');
      const fm = parseFrontmatter(content);
      const name = f.replace('.instructions.md', '');
      return {
        id: name,
        description: fm.description || '',
        applyTo: fm.applyTo || '',
        file: `instructions/${f}`,
        size: getFileSize(path.join(dir, f))
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

// ─── Skills ───────────────────────────────────────────────────────────────────

function extractSkills() {
  const dir = path.join(ROOT, 'skills');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => fs.statSync(path.join(dir, f)).isDirectory())
    .map(f => {
      const skillFile = path.join(dir, f, 'SKILL.md');
      const fm = fs.existsSync(skillFile)
        ? parseFrontmatter(fs.readFileSync(skillFile, 'utf8'))
        : {};
      return {
        id: f,
        name: fm.name || f,
        description: fm.description || '',
        folder: `skills/${f}/`,
        size: getFileSize(skillFile)
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function extractHooks() {
  const dir = path.join(ROOT, 'hooks');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => fs.statSync(path.join(dir, f)).isDirectory())
    .map(f => {
      const hooksFile = path.join(dir, f, 'hooks.json');
      let events = [];
      if (fs.existsSync(hooksFile)) {
        try {
          const data = JSON.parse(fs.readFileSync(hooksFile, 'utf8'));
          events = Object.keys(data.hooks || {});
        } catch {}
      }
      const readmeFile = path.join(dir, f, 'README.md');
      const readme = fs.existsSync(readmeFile)
        ? fs.readFileSync(readmeFile, 'utf8').split('\n')[0].replace(/^#\s*/, '')
        : f;
      return {
        id: f,
        name: readme,
        events,
        folder: `hooks/${f}/`
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

// ─── Plugins ──────────────────────────────────────────────────────────────────

function extractPlugins() {
  const dir = path.join(ROOT, 'plugins');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => {
      const pj = path.join(dir, f, 'plugin.json');
      return fs.statSync(path.join(dir, f)).isDirectory() && fs.existsSync(pj);
    })
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(dir, f, 'plugin.json'), 'utf8'));
      const items = (data.agents || []).length + (data.instructions || []).length +
                    (data.skills || []).length + (data.hooks || []).length;
      return {
        id: data.name,
        description: data.description || '',
        version: data.version || '1.0.0',
        keywords: data.keywords || [],
        plays: data.plays || [],
        items,
        folder: `plugins/${f}/`
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

// ─── Workflows ────────────────────────────────────────────────────────────────

function extractWorkflows() {
  const dir = path.join(ROOT, 'workflows');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && f !== 'README.md')
    .map(f => {
      const content = fs.readFileSync(path.join(dir, f), 'utf8');
      const fm = parseFrontmatter(content);
      const steps = (content.match(/^## Step \d/gm) || []).length;
      return {
        id: f.replace('.md', ''),
        name: fm.name || f.replace('.md', ''),
        description: fm.description || '',
        steps,
        file: `workflows/${f}`
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

// ─── Cookbook ──────────────────────────────────────────────────────────────────

function extractCookbook() {
  const dir = path.join(ROOT, 'cookbook');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && f !== 'README.md')
    .map(f => {
      const content = fs.readFileSync(path.join(dir, f), 'utf8');
      const title = content.split('\n')[0].replace(/^#\s*/, '');
      const steps = (content.match(/^### \d/gm) || []).length;
      return {
        id: f.replace('.md', ''),
        title,
        steps,
        file: `cookbook/${f}`,
        size: getFileSize(path.join(dir, f))
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

// ═══════════════════════════════════════════════════════════════════════════════
// Generate all data
// ═══════════════════════════════════════════════════════════════════════════════

console.log('🍊 FrootAI Website Data Generator');

const agents = extractAgents();
const instructions = extractInstructions();
const skills = extractSkills();
const hooks = extractHooks();
const plugins = extractPlugins();
const workflows = extractWorkflows();
const cookbook = extractCookbook();

// Write individual feeds
const feeds = { agents, instructions, skills, hooks, plugins, workflows, cookbook };
for (const [name, data] of Object.entries(feeds)) {
  const outPath = path.join(OUTPUT_DIR, `${name}.json`);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n');
  console.log(`   ✅ ${name}.json — ${data.length} items`);
}

// Generate aggregate stats
const totalItems = plugins.reduce((sum, p) => sum + p.items, 0);
const stats = {
  generated: new Date().toISOString(),
  counts: {
    agents: agents.length,
    instructions: instructions.length,
    skills: skills.length,
    hooks: hooks.length,
    plugins: plugins.length,
    workflows: workflows.length,
    cookbook: cookbook.length,
    solutionPlays: fs.readdirSync(path.join(ROOT, 'solution-plays'))
      .filter(f => fs.statSync(path.join(ROOT, 'solution-plays', f)).isDirectory()).length,
    schemas: fs.readdirSync(path.join(ROOT, 'schemas'))
      .filter(f => f.endsWith('.schema.json')).length,
    engineModules: fs.readdirSync(path.join(ROOT, 'engine'))
      .filter(f => f.endsWith('.js')).length,
    cicdWorkflows: fs.readdirSync(path.join(ROOT, '.github', 'workflows'))
      .filter(f => f.endsWith('.yml')).length,
    mcpTools: 22
  },
  marketplace: {
    plugins: plugins.length,
    totalItems,
    avgItemsPerPlugin: plugins.length > 0 ? Math.round(totalItems / plugins.length * 10) / 10 : 0
  },
  competitor: {
    agents: 187, instructions: 175, skills: 271, hooks: 6,
    plugins: 65, workflows: 7, cookbook: 7
  }
};

fs.writeFileSync(path.join(OUTPUT_DIR, 'stats.json'), JSON.stringify(stats, null, 2) + '\n');
console.log(`   ✅ stats.json — aggregate statistics`);

console.log(`\n   📊 Total: ${Object.values(stats.counts).reduce((a, b) => a + b, 0)} items across ${Object.keys(stats.counts).length} categories`);
console.log(`   Generated: ${OUTPUT_DIR}\n`);
