# Changelog

## [6.0.0] — 2026-04-14

### Architecture
- **TypeScript migration** — entire extension rewritten from 2,127-line JS monolith to modular TypeScript
- **esbuild bundling** — fast builds via esbuild (114KB dev / 78KB prod), replaces no-build approach
- **17 TypeScript modules** across `data/`, `providers/`, `commands/`, `webviews/`, `utils/`
- Strict TypeScript with full type safety

### New Features
- **Global Search** (`Ctrl+Shift+F9`) — fuzzy search across plays, MCP tools, and glossary
- **Play Detail Panel** — rich webview with hero header, WAF alignment pills, quick actions
- **Evaluation Dashboard** — 5 metric cards with scores, thresholds, pass/fail visualization
- **Scaffold Wizard** — 4-step interactive wizard (pick play → name → preview → create)
- **MCP Tool Explorer** — filterable grid of all 45 tools with category badges and copy config
- **Getting Started Walkthrough** — 5-step onboarding for new users
- **Keybinding** — `Ctrl+Shift+F9` for Search Everything

### Enhanced Tree Views
- Solution Plays: search/filter, complexity badges (color-coded), status icons, rich tooltips
- Primitives Catalog: fixed counts (201/176/282/10/77), distinct category icons, count descriptions
- MCP Tools: read-only/read-write annotations, 7 category groups

### Cleanup
- Removed 9 stale VSIX files from repository (0.1.0 through 5.0.7)
- Added `.vscodeignore` to exclude source files from published VSIX
- Build output goes to `out/` (not source `src/`)

## [5.0.7] — 2026-04-01
- 4 tree views (plays, primitives, FAI protocol, MCP tools)
- 25 commands (init DevKit/TuneKit/SpecKit, evaluate, cost, etc.)
- MCP server auto-registration
- Markdown webview rendering with Mermaid support
- GitHub download + 24h cache
