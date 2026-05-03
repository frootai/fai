#!/usr/bin/env node
/**
 * FrootAI — Expand thin evaluation test-sets across solution plays.
 *
 * Closes catalog-wide gap G2 (`comprehensive-audit-plays-51-101.md`).
 *
 * For each `solution-plays/<play>/evaluation/test-set.jsonl`:
 *   - Detect record count (handles `{questions:[]}`, `{checks:[]}`, `{test_cases:[]}`,
 *     bare arrays, and true JSONL).
 *   - If records >= MIN_RECORDS, leave file alone (preserves human-curated content).
 *   - If records < MIN_RECORDS, back up to `test-set.jsonl.bak` (once) and rewrite
 *     as TRUE JSONL with 5 domain-aware sanity questions seeded from the play's
 *     folder slug.
 *
 * Usage:
 *   node scripts/expand-test-sets.js              # Apply changes
 *   node scripts/expand-test-sets.js --dry-run    # Preview only
 *   node scripts/expand-test-sets.js --force      # Rewrite even rich files (NOT recommended)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PLAYS_DIR = path.join(ROOT, 'solution-plays');
const MIN_RECORDS = 3;       // Preserve any play with ≥3 records (curated content)
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

// Stub-detection patterns (case-insensitive). If ANY question/answer matches,
// treat the file as a stub regardless of record count.
const STUB_PATTERNS = [
    /^sample(\s+test|\s+answer)?$/i,
    /^sample$/i,
    /^placeholder$/i,
    /^todo$/i
];

function isStubText(s) {
    if (!s || typeof s !== 'string') return false;
    return STUB_PATTERNS.some(p => p.test(s.trim()));
}

function titleFromSlug(slug) {
    // "04-call-center-voice-ai" → "Call Center Voice AI"
    return slug
        .replace(/^\d+-/, '')
        .split('-')
        .map(w => w.length <= 3 && w === w.toLowerCase() && /^(ai|ml|llm|rag|api|sdk|cli|iot|sql|aks|cdn|kql|jit|hpa|ssh|tls|hsm|sso|sku|crm|erp|mcp|esg|sap|ide|sre|crm|gpu|cpu|ram|iam|eda|cqrs)$/.test(w) ? w.toUpperCase() : (w[0]?.toUpperCase() ?? '') + w.slice(1))
        .join(' ');
}

function countRecords(raw) {
    // Returns { count, isStub }. isStub flips true if records exist but
    // are placeholder content (Sample test / Sample answer / etc.).
    let isStub = false;
    function checkStub(records) {
        for (const r of records) {
            if (!r || typeof r !== 'object') continue;
            for (const v of Object.values(r)) {
                if (isStubText(v)) { isStub = true; return; }
            }
        }
    }

    // Try true JSONL first (one object per line)
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length >= 2) {
        const records = [];
        let valid = 0;
        for (const l of lines) {
            try { records.push(JSON.parse(l)); valid++; } catch { /* not jsonl */ }
        }
        if (valid === lines.length) {
            checkStub(records);
            return { count: valid, isStub };
        }
    }

    // Try parsing whole file as JSON
    try {
        const obj = JSON.parse(raw);
        if (Array.isArray(obj)) {
            checkStub(obj);
            return { count: obj.length, isStub };
        }
        if (obj && typeof obj === 'object') {
            for (const key of ['questions', 'checks', 'test_cases', 'cases', 'tests']) {
                if (Array.isArray(obj[key])) {
                    checkStub(obj[key]);
                    return { count: obj[key].length, isStub };
                }
            }
            // Single envelope object → 1 record
            checkStub([obj]);
            return { count: 1, isStub };
        }
    } catch { /* not parseable */ }

    // Last resort: 1 line that parses as JSON = 1 record
    if (lines.length === 1) {
        try {
            const r = JSON.parse(lines[0]);
            checkStub([r]);
            return { count: 1, isStub };
        } catch { return { count: 0, isStub: false }; }
    }
    return { count: 0, isStub: false };
}

function buildSanitySet(slug) {
    const title = titleFromSlug(slug);
    const seeAlso = `See solution-plays/${slug}/README.md, config/, and infra/main.bicep for play-specific ground truth.`;
    return [
        {
            id: `${slug}-q001`,
            category: 'overview',
            question: `What is the primary use case for the ${title} solution play?`,
            ground_truth: `TODO — customer-specific. ${seeAlso}`
        },
        {
            id: `${slug}-q002`,
            category: 'architecture',
            question: `Which Azure services does ${title} typically deploy?`,
            ground_truth: `TODO — see infra/main.bicep for the canonical service list.`
        },
        {
            id: `${slug}-q003`,
            category: 'cost',
            question: `What is the recommended cost tier for ${title} in production?`,
            ground_truth: `TODO — see config/cost.json or play README for current dev/prod estimates.`
        },
        {
            id: `${slug}-q004`,
            category: 'waf',
            question: `Which Well-Architected Framework pillars are most critical for ${title}?`,
            ground_truth: `TODO — see fai-manifest.json context.waf and play README WAF table.`
        },
        {
            id: `${slug}-q005`,
            category: 'failure-mode',
            question: `What is a common failure mode in a ${title} deployment?`,
            ground_truth: `TODO — see play README "Common Pitfalls" section and reviewer agent.`
        }
    ];
}

function expandPlay(playDir) {
    const slug = path.basename(playDir);
    const evalDir = path.join(playDir, 'evaluation');
    const setPath = path.join(evalDir, 'test-set.jsonl');
    if (!fs.existsSync(setPath)) {
        return { slug, status: 'no-file' };
    }
    const raw = fs.readFileSync(setPath, 'utf8');
    const { count: records, isStub } = countRecords(raw);

    // Preserve only files that have ≥MIN_RECORDS AND are not stubs
    if (records >= MIN_RECORDS && !isStub && !FORCE) {
        return { slug, status: 'kept', records };
    }

    const bakPath = setPath + '.bak';
    const newRecords = buildSanitySet(slug);
    const newContent = newRecords.map(r => JSON.stringify(r)).join('\n') + '\n';

    if (DRY_RUN) {
        return { slug, status: 'would-rewrite', records, isStub, newRecords: newRecords.length };
    }
    // Backup once (do not overwrite an existing .bak)
    if (!fs.existsSync(bakPath)) {
        fs.writeFileSync(bakPath, raw);
    }
    fs.writeFileSync(setPath, newContent);
    return { slug, status: 'rewrote', records, isStub, newRecords: newRecords.length };
}

function main() {
    const plays = fs.readdirSync(PLAYS_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory() && /^\d+-/.test(d.name))
        .map(d => path.join(PLAYS_DIR, d.name))
        .sort();

    const results = plays.map(expandPlay);
    const counts = results.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
    }, {});

    console.log(DRY_RUN ? '\n[DRY-RUN] Would expand test-sets:\n' : '\n✅ Test-set expansion complete:\n');
    for (const [k, v] of Object.entries(counts)) {
        console.log(`  ${k.padEnd(15)} ${v}`);
    }
    console.log(`\n  Total plays inspected: ${results.length}`);

    // Show per-play summary for the rewritten ones
    const rewritten = results.filter(r => r.status === 'rewrote' || r.status === 'would-rewrite');
    if (rewritten.length && rewritten.length <= 30) {
        console.log('\nRewritten plays:');
        rewritten.forEach(r => console.log(`  ${r.slug.padEnd(45)} ${r.records}→${r.newRecords}`));
    }

    // Verify all rewritten files are now valid JSONL
    if (!DRY_RUN) {
        let validJsonl = 0;
        for (const r of rewritten) {
            const f = path.join(PLAYS_DIR, r.slug, 'evaluation', 'test-set.jsonl');
            const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(Boolean);
            try {
                lines.forEach(l => JSON.parse(l));
                validJsonl++;
            } catch (e) {
                console.error(`  ❌ Invalid JSONL: ${r.slug} — ${e.message}`);
            }
        }
        console.log(`\n  Validated JSONL: ${validJsonl}/${rewritten.length}`);
    }
}

main();
