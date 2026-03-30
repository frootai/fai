# FrootAI Content Source Map

> Which file is the **source of truth** for each data point, and what files reference it.

This is the map that `sync-content.js` and `validate-consistency.js` use to keep everything in sync.

---

## Sources of Truth

| Data Point | Source of Truth | Referenced By |
|-----------|----------------|---------------|
| **MCP version** | `mcp-server/package.json` → `version` | README.md, functions/server.js, website, Docker tags |
| **Extension version** | `vscode-extension/package.json` → `version` | functions/server.js, website |
| **Tool count** | `mcp-server/index.js` → `server.tool()` calls | README.md, mcp-server/package.json description, vscode-extension/package.json description, vscode-extension sidebar view name, website /mcp-tooling page |
| **Command count** | `vscode-extension/package.json` → `contributes.commands[]` | README.md |
| **Module count** | `mcp-server/knowledge.json` → `modules` keys | README.md, mcp-server/package.json description |
| **Play count** | `solution-plays/` → directory count | README.md, mcp-server/package.json description |
| **Homepage URL** | `https://frootai.dev` | mcp-server/package.json homepage, README.md |
| **Repository URL** | `https://github.com/frootai/fai` | mcp-server/package.json repository, README.md |
| **Copyright** | `LICENSE`, `NOTICE` | All published packages |

---

## Downstream Files (auto-updated by sync-content.js)

| File | What Gets Updated |
|------|-------------------|
| `README.md` | Version refs (`@X.Y.Z`), tool count, command count, module count, play count |
| `mcp-server/package.json` | Description (tool count, module count, play count) |
| `vscode-extension/package.json` | Description (tool count, module count, play count), sidebar view name |
| `functions/server.js` | MCP version ref, extension version ref, tool count |

---

## Automation Chain

```
Code change (index.js, package.json, knowledge.json, solution-plays/)
  │
  ├─ Pre-commit hook (.husky/pre-commit)
  │   ├─ node scripts/sync-content.js     ← auto-updates downstream files
  │   └─ node scripts/validate-consistency.js  ← blocks if drift detected
  │
  ├─ PR guard (version-check.yml)         ← blocks merge if versions mismatch
  ├─ PR guard (content-sync.yml)          ← blocks merge if counts drift
  ├─ Push guard (consistency-check.yml)   ← runs on every push to main
  │
  └─ Release (scripts/release.js)
      ├─ Bumps versions in package.json files
      ├─ Runs sync-content.js
      ├─ Runs validate-consistency.js
      ├─ Generates CHANGELOG.md
      └─ Tags → triggers npm-publish, vsce-publish, docker-publish, release.yml
```

---

## Adding a New Data Point

1. Add the source of truth to `validate-consistency.js` (read + check)
2. Add the sync logic to `sync-content.js` (read source → update downstream)
3. Update this document
4. Test: `node scripts/sync-content.js && node scripts/validate-consistency.js`
