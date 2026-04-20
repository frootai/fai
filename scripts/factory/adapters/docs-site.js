#!/usr/bin/env node
/**
 * FAI Factory — Docusaurus Auto-Docs Generator
 * =============================================
 * Reads fai-catalog.json and auto-generates Docusaurus-compatible
 * markdown pages for all primitives in docs-site/docs/generated/.
 *
 * This is the self-service pipeline: push a new primitive → docs page
 * appears automatically. Hand-written docs are NEVER overwritten.
 *
 * Usage:
 *   node scripts/factory/adapters/docs-site.js              # Full generation
 *   node scripts/factory/adapters/docs-site.js --type agents # Single type
 *   node scripts/factory/adapters/docs-site.js --stats       # Stats only
 *   node scripts/factory/adapters/docs-site.js --dry-run     # Preview without writing
 *
 * @module scripts/factory/adapters/docs-site
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const CATALOG_PATH = path.join(ROOT, '.factory', 'fai-catalog.json');
const OUTPUT_DIR = path.join(ROOT, 'docs-site', 'docs', 'generated');
const SIDEBAR_PATH = path.join(ROOT, 'docs-site', 'sidebars-generated.ts');

// ─── Helpers ──────────────────────────────────────────

/**
 * Escape text for MDX compatibility.
 * Replaces < > { } with HTML entities or backticks to prevent JSX parsing.
 */
function mdxSafe(text) {
  if (!text) return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

/**
 * Escape text for YAML frontmatter (double quotes).
 */
function fmSafe(text) {
  if (!text) return '';
  return text.replace(/"/g, '\\"').replace(/</g, '').replace(/>/g, '').substring(0, 160);
}

// ─── Templates ────────────────────────────────────────

function agentPage(agent, index) {
  const tools = (agent.tools || []).join(', ') || 'N/A';
  const models = (agent.model || []).join(', ') || 'N/A';
  const waf = (agent.waf || []).map(w => `\`${w}\``).join(', ') || 'N/A';
  const plays = (agent.plays || []).map(p => `\`${p}\``).join(', ') || 'N/A';

  return `---
sidebar_position: ${index + 1}
title: "${agent.name || agent.id}"
description: "${fmSafe(agent.description)}"
tags: [agent, auto-generated]
---

{/* AUTO-GENERATED — Do not edit. Edit the source .agent.md file instead. */}

# ${agent.name || agent.id}

> ${mdxSafe(agent.description) || 'No description available.'}

## Overview

| Property | Value |
|----------|-------|
| **Type** | Agent |
| **File** | \`${agent.file}\` |
| **Tools** | ${tools} |
| **Model** | ${models} |
| **WAF Alignment** | ${waf} |
| **Compatible Plays** | ${plays} |
| **Lines** | ${agent.lines || 'N/A'} |

## Usage

### In VS Code (GitHub Copilot)

\`\`\`
@${agent.id} How can you help me?
\`\`\`

### In fai-manifest.json

\`\`\`json
{
  "primitives": {
    "agents": ["../../agents/${agent.id}.agent.md"]
  }
}
\`\`\`

## Source

- **GitHub**: [\`${agent.file}\`](https://github.com/frootai/frootai/blob/main/${agent.file})
- **Edit**: [Edit on GitHub →](https://github.com/frootai/frootai/edit/main/${agent.file})

---

*Auto-generated from the [FrootAI primitive catalog](https://github.com/frootai/frootai). Last updated: ${new Date().toISOString().split('T')[0]}.*
`;
}

function skillPage(skill, index) {
  const waf = (skill.waf || []).map(w => `\`${w}\``).join(', ') || 'N/A';
  const plays = (skill.plays || []).map(p => `\`${p}\``).join(', ') || 'N/A';

  return `---
sidebar_position: ${index + 1}
title: "${skill.name || skill.id}"
description: "${fmSafe(skill.description)}"
tags: [skill, auto-generated]
---

{/* AUTO-GENERATED — Do not edit. Edit the source SKILL.md file instead. */}

# ${skill.name || skill.id}

> ${mdxSafe(skill.description) || 'No description available.'}

## Overview

| Property | Value |
|----------|-------|
| **Type** | Skill |
| **Folder** | \`${skill.file ? path.dirname(skill.file) : skill.id}\` |
| **WAF Alignment** | ${waf} |
| **Compatible Plays** | ${plays} |
| **Lines** | ${skill.lines || 'N/A'} |

## Usage

Reference this skill in your \`fai-manifest.json\`:

\`\`\`json
{
  "primitives": {
    "skills": ["../../skills/${skill.id}/SKILL.md"]
  }
}
\`\`\`

## Source

- **GitHub**: [\`${skill.file || `skills/${skill.id}/SKILL.md`}\`](https://github.com/frootai/frootai/blob/main/${skill.file || `skills/${skill.id}/SKILL.md`})

---

*Auto-generated from the [FrootAI primitive catalog](https://github.com/frootai/frootai).*
`;
}

function instructionPage(inst, index) {
  const applyTo = inst.applyTo || 'N/A';
  const waf = (inst.waf || []).map(w => `\`${w}\``).join(', ') || 'N/A';

  return `---
sidebar_position: ${index + 1}
title: "${inst.name || inst.id}"
description: "${fmSafe(inst.description)}"
tags: [instruction, auto-generated]
---

{/* AUTO-GENERATED — Do not edit. Edit the source .instructions.md file instead. */}

# ${inst.name || inst.id}

> ${mdxSafe(inst.description) || 'No description available.'}

## Overview

| Property | Value |
|----------|-------|
| **Type** | Instruction |
| **File** | \`${inst.file}\` |
| **Applies To** | \`${applyTo}\` |
| **WAF Alignment** | ${waf} |
| **Lines** | ${inst.lines || 'N/A'} |

## How It Works

Instructions are automatically applied to files matching the \`applyTo\` glob pattern. When a developer opens a matching file in VS Code with GitHub Copilot, this instruction's content is injected into the AI context.

## Source

- **GitHub**: [\`${inst.file}\`](https://github.com/frootai/frootai/blob/main/${inst.file})

---

*Auto-generated from the [FrootAI primitive catalog](https://github.com/frootai/frootai).*
`;
}

function hookPage(hook, index) {
  const events = (hook.events || []).map(e => `\`${e}\``).join(', ') || 'N/A';

  return `---
sidebar_position: ${index + 1}
title: "${hook.name || hook.id}"
description: "${fmSafe(hook.description)}"
tags: [hook, auto-generated]
---

{/* AUTO-GENERATED — Do not edit. Edit the source hooks.json file instead. */}

# ${hook.name || hook.id}

> ${mdxSafe(hook.description) || 'No description available.'}

## Overview

| Property | Value |
|----------|-------|
| **Type** | Hook |
| **Folder** | \`${hook.file ? path.dirname(hook.file) : hook.id}\` |
| **Events** | ${events} |

## Source

- **GitHub**: [\`${hook.file || `hooks/${hook.id}/hooks.json`}\`](https://github.com/frootai/frootai/blob/main/${hook.file || `hooks/${hook.id}/hooks.json`})

---

*Auto-generated from the [FrootAI primitive catalog](https://github.com/frootai/frootai).*
`;
}

function pluginPage(plugin, index) {
  return `---
sidebar_position: ${index + 1}
title: "${plugin.name || plugin.id}"
description: "${fmSafe(plugin.description)}"
tags: [plugin, auto-generated]
---

{/* AUTO-GENERATED — Do not edit. Edit the source plugin.json file instead. */}

# ${plugin.name || plugin.id}

> ${mdxSafe(plugin.description) || 'No description available.'}

## Overview

| Property | Value |
|----------|-------|
| **Type** | Plugin |
| **Version** | ${plugin.version || 'N/A'} |
| **Author** | ${plugin.author || 'N/A'} |
| **License** | ${plugin.license || 'N/A'} |

## Source

- **GitHub**: [\`${plugin.file || `plugins/${plugin.id}/plugin.json`}\`](https://github.com/frootai/frootai/blob/main/${plugin.file || `plugins/${plugin.id}/plugin.json`})

---

*Auto-generated from the [FrootAI primitive catalog](https://github.com/frootai/frootai).*
`;
}

function workflowPage(wf, index) {
  return `---
sidebar_position: ${index + 1}
title: "${wf.name || wf.id}"
description: "${fmSafe(wf.description)}"
tags: [workflow, auto-generated]
---

{/* AUTO-GENERATED — Do not edit. Edit the source .yml file instead. */}

# ${wf.name || wf.id}

> ${mdxSafe(wf.description) || 'No description available.'}

## Overview

| Property | Value |
|----------|-------|
| **Type** | Workflow |
| **File** | \`${wf.file}\` |

## Source

- **GitHub**: [\`${wf.file || `workflows/${wf.id}.yml`}\`](https://github.com/frootai/frootai/blob/main/${wf.file || `workflows/${wf.id}.yml`})

---

*Auto-generated from the [FrootAI primitive catalog](https://github.com/frootai/frootai).*
`;
}

function indexPage(type, count, items) {
  const typeLabels = {
    agents: { singular: 'Agent', emoji: '🤖', description: 'Specialized AI personas with defined tools, models, and WAF alignment.' },
    skills: { singular: 'Skill', emoji: '⚡', description: 'Step-by-step capabilities that agents can execute.' },
    instructions: { singular: 'Instruction', emoji: '📝', description: 'Always-on domain knowledge injected via glob patterns.' },
    hooks: { singular: 'Hook', emoji: '🔒', description: 'Event-driven automation triggered by Copilot lifecycle events.' },
    plugins: { singular: 'Plugin', emoji: '📦', description: 'Packaged, distributable collections of primitives.' },
    workflows: { singular: 'Workflow', emoji: '⚙️', description: 'Multi-step automated processes.' },
  };
  const meta = typeLabels[type] || { singular: type, emoji: '📄', description: '' };

  const table = items.slice(0, 50).map(item => {
    const desc = mdxSafe((item.description || '').substring(0, 80));
    return `| [${item.name || item.id}](./${item.id}) | ${desc} |`;
  }).join('\n');

  return `---
sidebar_position: 0
title: "${meta.emoji} ${type.charAt(0).toUpperCase() + type.slice(1)} (${count})"
description: "Browse all ${count} FrootAI ${type}."
tags: [${type}, catalog, auto-generated]
---

{/* AUTO-GENERATED — Regenerated on every factory sync. */}

# ${meta.emoji} ${type.charAt(0).toUpperCase() + type.slice(1)}

> ${meta.description}

**Total: ${count} ${type}** in the FrootAI ecosystem.

| Name | Description |
|------|-------------|
${table}

${count > 50 ? `\n*Showing first 50 of ${count}. Browse all on [frootai.dev/primitives/${type}](https://frootai.dev/primitives/${type}).*\n` : ''}

---

*Auto-generated from the [FrootAI primitive catalog](https://github.com/frootai/frootai). Last updated: ${new Date().toISOString().split('T')[0]}.*
`;
}

// ─── Generator ────────────────────────────────────────

const GENERATORS = {
  agents: agentPage,
  skills: skillPage,
  instructions: instructionPage,
  hooks: hookPage,
  plugins: pluginPage,
  workflows: workflowPage,
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function sanitizeFilename(id) {
  return id.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
}

function generate(options = {}) {
  const { typeFilter, dryRun, statsOnly } = options;

  // Read catalog
  if (!fs.existsSync(CATALOG_PATH)) {
    console.error('❌ fai-catalog.json not found. Run factory harvest first.');
    process.exit(1);
  }

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const types = ['agents', 'skills', 'instructions', 'hooks', 'plugins', 'workflows'];
  const stats = { total: 0, pages: 0, types: {} };

  console.log('🍊 FrootAI Docs Auto-Generator');
  console.log(`   Catalog: ${catalog.version} (${catalog.generated})`);
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log('');

  for (const type of types) {
    if (typeFilter && type !== typeFilter) continue;

    const items = catalog[type] || [];
    stats.types[type] = items.length;
    stats.total += items.length;

    if (statsOnly) {
      console.log(`  ${type}: ${items.length}`);
      continue;
    }

    if (items.length === 0) {
      console.log(`  ⏭️  ${type}: 0 items, skipping`);
      continue;
    }

    const typeDir = path.join(OUTPUT_DIR, type);
    const generator = GENERATORS[type];

    if (!dryRun) {
      ensureDir(typeDir);
    }

    // Generate index page
    const indexContent = indexPage(type, items.length, items);
    const indexFile = path.join(typeDir, 'index.md');
    if (!dryRun) {
      fs.writeFileSync(indexFile, indexContent);
    }
    stats.pages++;

    // Generate individual pages
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const filename = sanitizeFilename(item.id) + '.md';
      const filePath = path.join(typeDir, filename);
      const content = generator(item, i);

      if (!dryRun) {
        fs.writeFileSync(filePath, content);
      }
      stats.pages++;
    }

    console.log(`  ✅ ${type}: ${items.length} pages generated`);
  }

  // Generate _category_.json for each type
  if (!dryRun && !statsOnly) {
    for (const type of types) {
      if (typeFilter && type !== typeFilter) continue;
      const items = catalog[type] || [];
      if (items.length === 0) continue;

      const typeDir = path.join(OUTPUT_DIR, type);
      const categoryFile = path.join(typeDir, '_category_.json');
      const emoji = { agents: '🤖', skills: '⚡', instructions: '📝', hooks: '🔒', plugins: '📦', workflows: '⚙️' };
      fs.writeFileSync(categoryFile, JSON.stringify({
        label: `${emoji[type] || '📄'} ${type.charAt(0).toUpperCase() + type.slice(1)} (${items.length})`,
        position: { agents: 1, skills: 2, instructions: 3, hooks: 4, plugins: 5, workflows: 6 }[type] || 99,
        collapsed: true,
      }, null, 2));
    }

    // Generate top-level _category_.json
    ensureDir(OUTPUT_DIR);
    fs.writeFileSync(path.join(OUTPUT_DIR, '_category_.json'), JSON.stringify({
      label: '📋 Primitive Catalog',
      position: 99,
      collapsed: true,
    }, null, 2));
  }

  console.log('');
  console.log(`📊 Total: ${stats.total} primitives → ${stats.pages} pages`);

  if (dryRun) {
    console.log('   (dry run — no files written)');
  }

  return stats;
}

// ─── CLI ──────────────────────────────────────────────

const args = process.argv.slice(2);
const typeFilter = args.includes('--type') ? args[args.indexOf('--type') + 1] : null;
const dryRun = args.includes('--dry-run');
const statsOnly = args.includes('--stats');

generate({ typeFilter, dryRun, statsOnly });
