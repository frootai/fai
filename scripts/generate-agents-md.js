#!/usr/bin/env node
/**
 * FrootAI — Auto-Generate agents/AGENTS.md
 *
 * Scans `agents/*.agent.md`, parses YAML frontmatter, and writes a flat
 * machine-generated catalog to `agents/AGENTS.md`.
 *
 * The root `AGENTS.md` (curated discovery doc with category groupings) is
 * NOT touched — it is a hand-edited marketing surface.
 *
 * Usage:
 *   node scripts/generate-agents-md.js              # Write catalog
 *   node scripts/generate-agents-md.js --dry-run    # Preview only
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const AGENTS_DIR = path.join(ROOT, 'agents');
const OUT_PATH = path.join(AGENTS_DIR, 'AGENTS.md');
const DRY_RUN = process.argv.includes('--dry-run');

function parseFrontmatter(raw) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return {};
    const body = match[1];
    const meta = {};
    let currentKey = null;
    let currentList = null;
    for (const line of body.split(/\r?\n/)) {
        if (!line.trim()) continue;
        // List item under last key
        const listMatch = line.match(/^\s+-\s+["']?(.+?)["']?\s*$/);
        if (listMatch && currentList) {
            currentList.push(listMatch[1]);
            continue;
        }
        // key: value or key:
        const kv = line.match(/^([a-zA-Z][a-zA-Z0-9_-]*)\s*:\s*(.*)$/);
        if (!kv) continue;
        const key = kv[1];
        let val = kv[2].trim();
        currentKey = key;
        currentList = null;
        if (val === '') {
            meta[key] = [];
            currentList = meta[key];
            continue;
        }
        // Inline JSON-ish array: ["a", "b"]
        if (val.startsWith('[') && val.endsWith(']')) {
            try {
                meta[key] = JSON.parse(val.replace(/'/g, '"'));
                continue;
            } catch {
                meta[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
                continue;
            }
        }
        // Quoted string
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            meta[key] = val.slice(1, -1);
            continue;
        }
        meta[key] = val;
    }
    return meta;
}

function loadAgents() {
    const files = fs.readdirSync(AGENTS_DIR)
        .filter(f => f.endsWith('.agent.md'))
        .sort();
    return files.map(file => {
        const raw = fs.readFileSync(path.join(AGENTS_DIR, file), 'utf8');
        const meta = parseFrontmatter(raw);
        return {
            slug: file.replace(/\.agent\.md$/, ''),
            file,
            name: meta.name || '',
            description: meta.description || '',
            model: Array.isArray(meta.model) ? meta.model : (meta.model ? [meta.model] : []),
            tools: Array.isArray(meta.tools) ? meta.tools : (meta.tools ? [meta.tools] : []),
            waf: Array.isArray(meta.waf) ? meta.waf : (meta.waf ? [meta.waf] : []),
            plays: Array.isArray(meta.plays) ? meta.plays : (meta.plays ? [meta.plays] : [])
        };
    });
}

function escapeMd(s) {
    return String(s || '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
}

function generate() {
    const agents = loadAgents();
    const total = agents.length;
    const playAgents = agents.filter(a => /^fai-play-\d+/.test(a.slug)).length;
    const standalone = total - playAgents;

    const lines = [];
    lines.push('# AGENTS.md — FrootAI Standalone Agents (Auto-Generated Catalog)');
    lines.push('');
    lines.push('> **GENERATED FILE — DO NOT EDIT BY HAND.** Re-run `node scripts/generate-agents-md.js` to refresh.');
    lines.push('> For the curated discovery surface (categories, related plays, marketing copy), see the [root AGENTS.md](../AGENTS.md).');
    lines.push('');
    lines.push(`**Total agents:** ${total} (${standalone} standalone domain experts + ${playAgents} solution-play agents)`);
    lines.push('');
    lines.push('## Index');
    lines.push('');
    lines.push('| # | Agent | Name | Description |');
    lines.push('|---|-------|------|-------------|');
    agents.forEach((a, i) => {
        const desc = escapeMd(a.description);
        const truncated = desc.length > 140 ? desc.slice(0, 137) + '…' : desc;
        lines.push(`| ${i + 1} | [\`${a.slug}\`](./${a.file}) | ${escapeMd(a.name)} | ${truncated} |`);
    });
    lines.push('');
    lines.push('## Detail');
    lines.push('');
    for (const a of agents) {
        lines.push(`### \`${a.slug}\``);
        lines.push('');
        if (a.name) lines.push(`**Name:** ${a.name}  `);
        if (a.description) lines.push(`**Description:** ${a.description}  `);
        if (a.model.length) lines.push(`**Model:** ${a.model.join(', ')}  `);
        if (a.tools.length) lines.push(`**Tools:** ${a.tools.join(', ')}  `);
        if (a.waf.length) lines.push(`**WAF:** ${a.waf.join(', ')}  `);
        if (a.plays.length) lines.push(`**Plays:** ${a.plays.join(', ')}  `);
        lines.push(`**File:** [\`${a.file}\`](./${a.file})`);
        lines.push('');
    }
    lines.push('---');
    lines.push(`*Generated ${new Date().toISOString().slice(0, 10)} from \`agents/\` via \`scripts/generate-agents-md.js\`.*`);

    return lines.join('\n') + '\n';
}

function main() {
    const content = generate();
    if (DRY_RUN) {
        console.log(`[dry-run] Would write ${content.length} bytes to ${path.relative(ROOT, OUT_PATH)}`);
        console.log(content.slice(0, 600) + '\n...');
        return;
    }
    fs.writeFileSync(OUT_PATH, content);
    const agentCount = (content.match(/^### `/gm) || []).length;
    console.log(`✅ Wrote ${path.relative(ROOT, OUT_PATH)} (${agentCount} agents, ${content.length} bytes)`);
}

main();
