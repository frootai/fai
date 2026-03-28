Here's the content of /memories/repo/frootai-handover.md with line numbers:
     1	# FrootAI — Complete Agent Handover Document
     2	> Generated: March 29, 2026 | Conversation span: March 20-29, 2026 (10 days)
     3	> Author: GitHub Copilot session with Pavleen Bali (Co-founder, Microsoft CSA)
     4	
     5	---
     6	
     7	## 1. WHAT IS FROOTAI
     8	
     9	FrootAI is an AI architecture toolkit — the "open glue" binding Infrastructure, Platform & Application teams.
    10	
    11	**FROOT** = **F**oundations · **R**easoning · **O**rchestration · **O**perations · **T**ransformation
    12	
    13	**Repo**: `C:\Users\pavleenbali\OneDrive - Microsoft\Desktop\Desk Case\MS Space\CSA\Code CSA\frootai-dev\`
    14	**GitHub**: https://github.com/gitpavleenbali/frootai (public, MIT)
    15	**Website**: https://frootai.dev (Docusaurus on GitHub Pages)
    16	
    17	---
    18	
    19	## 2. CANONICAL VALUES (Source of Truth)
    20	
    21	| Fact | Value | Source File |
    22	|------|-------|-------------|
    23	| MCP tools | **23** | `mcp-server/index.js` |
    24	| Solution plays | **20** (ALL Ready) | `python-sdk/frootai/plays.py` |
    25	| VS Code commands | **19** | `vscode-extension/package.json` |
    26	| VS Code version | **1.4.0** | `vscode-extension/package.json` |
    27	| npm MCP version | **3.2.0** | `mcp-server/package.json` |
    28	| Python SDK version | **3.3.0** | `python-sdk/pyproject.toml` |
    29	| Python MCP version | **3.2.0** | `python-mcp/pyproject.toml` |
    30	| Knowledge modules | **16** | `mcp-server/knowledge.json` |
    31	| Glossary terms | **159+** | Runtime extraction from content |
    32	| FROOT layers | **5** (F, R, O_ORCH, O_OPS, T) | knowledge.json |
    33	| Website pages | **26** | `website/src/pages/*.tsx` |
    34	| CI/CD workflows | **13** | `.github/workflows/*.yml` |
    35	| Workshops | **3** | `workshops/` |
    36	| Community plugins | **3** | `community-plugins/` (ServiceNow, Salesforce, SAP) |
    37	| Bicep modules | **2** | `bicep-registry/` |
    38	
    39	---
    40	
    41	## 3. DISTRIBUTION CHANNELS (8 total, all live)
    42	
    43	| Channel | URL / Command | Version |
    44	|---------|--------------|---------|
    45	| npm | `npm install frootai-mcp` / npmjs.com/package/frootai-mcp | 3.2.0 |
    46	| PyPI SDK | `pip install frootai` / pypi.org/project/frootai/ | 3.3.0 |
    47	| PyPI MCP | `pip install frootai-mcp` / pypi.org/project/frootai-mcp/ | 3.2.0 |
    48	| Docker | `docker run -i ghcr.io/gitpavleenbali/frootai-mcp` | latest |
    49	| VS Code | `code --install-extension pavleenbali.frootai` | 1.4.0 |
    50	| CLI | `npx frootai help` | 3.2.0 |
    51	| REST API | frootai-chatbot-api.azurewebsites.net | live |
    52	| GitHub | github.com/gitpavleenbali/frootai | latest |
    53	
    54	---
    55	
    56	## 4. FILE MAP
    57	
    58	### Core Product
    59	- `mcp-server/index.js` — 23 MCP tools, 682KB knowledge
    60	- `mcp-server/cli.js` — CLI (init, scaffold, search, cost, validate, doctor)
    61	- `mcp-server/knowledge.json` — 16 modules, 682KB bundled knowledge
    62	- `vscode-extension/src/extension.js` — 19 commands, 2 sidebar panels (Plays + MCP Tools)
    63	- `vscode-extension/package.json` — v1.4.0 manifest
    64	- `python-sdk/frootai/` — client, plays, evaluation, ab_testing, cli (zero deps)
    65	- `python-mcp/frootai_mcp/server.py` — Python MCP, 22 tools
    66	- `functions/server.js` — REST API + Agent FAI chatbot system prompt
    67	- `foundry-agent/agent.py` — Azure AI Foundry hosted agent
    68	
    69	### Website (26 pages)
    70	- `website/src/pages/index.tsx` — Homepage with FROOT layers
    71	- `website/src/pages/solution-plays.tsx` — 20 plays, all Ready
    72	- `website/src/pages/mcp-tooling.tsx` — 23 tools + pip install
    73	- `website/src/pages/vscode-extension.tsx` — v1.4.0, 19 commands
    74	- `website/src/pages/ecosystem.tsx` — 8 channels incl Python card
    75	- `website/src/pages/setup-guide.tsx` — Parts 1-5 (MCP, VS Code, CLI, Docker, Python)
    76	- `website/src/pages/enterprise.tsx` — Free + Professional + Enterprise tiers
    77	- `website/src/pages/learning-hub.tsx` — 3-tier certification (Associate/Professional/Expert)
    78	- `website/src/pages/dev-hub.tsx` — Versions, changelog
    79	- `website/src/pages/dev-hub-changelog.tsx` — Release history
    80	- `website/src/pages/marketplace.tsx` — Plugin marketplace
    81	- `website/src/pages/community.tsx` — OSS community
    82	- `website/src/pages/chatbot.tsx` — Agent FAI interface
    83	- `website/docusaurus.config.ts` — SEO, search plugin config
    84	- `website/src/theme/SearchBar/index.js` — Custom search pill (loads search-index.json)
    85	- `website/static/.well-known/agent.json` — A2A agent discovery
    86	
    87	### Solution Plays (20, all production configs)
    88	- `solution-plays/XX-name/config/openai.json` — AI model config with system prompt
    89	- `solution-plays/XX-name/config/guardrails.json` — Domain-specific safety rules
    90	- `solution-plays/XX-name/.github/agents/` — builder, reviewer, tuner (read spec/)
    91	- `solution-plays/XX-name/spec/play-spec.json` — Architecture + WAF alignment
    92	- `solution-plays/XX-name/froot.json` — Package manifest
    93	- `solution-plays/XX-name/infra/main.bicep` — Azure infrastructure
    94	
    95	### CI/CD (13 workflows)
    96	- `deploy.yml` — Website to GitHub Pages
    97	- `npm-publish.yml` — npm (needs NPM_TOKEN secret)
    98	- `vsce-publish.yml` — VS Code Marketplace (needs VSCE_PAT)
    99	- `pypi-publish.yml` — PyPI (needs PYPI_TOKEN)
   100	- `docker-publish.yml` — Docker ghcr.io
   101	- `deploy-chatbot.yml` — Azure App Service
   102	- `consistency-check.yml` — Self-healing auto-fix
   103	- `validate-plays.yml` — JSON + Bicep validation per play
   104	- `content-sync.yml`, `version-check.yml`, `sync-readme.yml` — Consistency
   105	- `uptime.yml` — Site + API monitoring
   106	- `release.yml` — GitHub Release notes
   107	
   108	### Internal Docs (gitignored .internal/)
   109	- `.internal/docs/ImplementationPlan.md` — Master plan (98% complete, 6 items remain)
   110	- `.internal/docs/knowledge-mapping.md` — Self-reference for AI agents (all green)
   111	- `.internal/marketing/` — 7 draft files (blog, HN, PH, Reddit, LinkedIn, demo, awesome-mcp)
   112	- `.internal/company/` — Acquisition positioning, IP strategy
   113	
   114	---
   115	
   116	## 5. AZURE RESOURCES
   117	
   118	| Resource | Location | RG |
   119	|----------|----------|-----|
   120	| Subscription | ME-MngEnvMCAP852047-pavleenbali-1 | — |
   121	| AI Services | cost-intelligence-agent-resource | rg-dev, swedencentral |
   122	| OpenAI | cs-openai-varcvenlme53e | rg-dev, eastus2 |
   123	| Chatbot | frootai-chatbot-api (App Service B1) | rg-frootai-chatbot, eastus2 |
   124	| Foundry Hub | frootai-hub | rg-dev, swedencentral |
   125	| Foundry Project | frootai-rag-agent | rg-dev, swedencentral |
   126	
   127	---
   128	
   129	## 6. WHAT WAS BUILT (March 20-29)
   130	
   131	### Phase 1-10 (March 20-25): Foundation
   132	- 16 knowledge modules (682KB), 20 solution plays, MCP server (22 tools), VS Code extension, website (26 pages), Docker, Agent FAI chatbot, CLI, REST API, 13 CI/CD workflows
   133	
   134	### March 26-27: Tier 1-2 (Growth + Community)
   135	- Auto-publish workflows, self-healing CI, marketing drafts, community plugins, eval dashboard, one-click plugin install
   136	
   137	### March 28: Python + Play Hardening
   138	- Python MCP server (production, 22 tools querying real knowledge)
   139	- Python SDK v3.3.0 (offline-first, zero deps, 10 tests pass)
   140	- Published BOTH to PyPI (frootai + frootai-mcp)
   141	- All 20 plays hardened (Skeleton → Ready) with production openai.json + guardrails.json
   142	- Foundry Hub + Project created, agent code written
   143	
   144	### March 28: Priority Sprints P1-P6
   145	- P2: VS Code v1.4.0 (2 panels, layer colors, pip option, cleaner UX)
   146	- P3: Agents wired to spec/, WAF, froot.json for all 20 plays
   147	- P4: run_evaluation tool (#23), tree animation, self-guided tutorial README
   148	- P5: action.yml, bicep-registry, A2A .well-known/agent.json, marketplace
   149	- P6: Enterprise tiers, 3-tier certification, 3 workshops, acquisition positioning
   150	
   151	### March 28: Consistency Sweeps
   152	- Module count 18→16 fixed across 14+ website pages
   153	- Command count 13/16→19 fixed across 6+ pages
   154	- Tool count 22→23 fixed across 15+ pages
   155	- Version numbers synced (v1.4.0, v3.2.0) across all surfaces
   156	- 31 📋→✅ icons fixed in implementation plan
   157	
   158	---
   159	
   160	## 7. REMAINING ITEMS (6 total)
   161	
   162	| # | Item | Owner | Type |
   163	|---|------|-------|------|
   164	| 1 | Add GitHub Secrets (NPM_TOKEN, VSCE_PAT, PYPI_TOKEN) | Pavleen | Portal |
   165	| 2 | Add GitHub Topics (mcp, ai-tools, azure, copilot) | Pavleen | Portal |
   166	| 3 | Re-run failed GitHub Actions | Pavleen | Portal |
   167	| 4 | TypeScript SDK (@frootai/sdk) | Deferred | Low demand |
   168	| 5 | SDK documentation + examples | Deferred | Python covers it |
   169	| 6 | MCP auto-restart / health check | Blocked | VS Code API ~v1.102+ |
   170	
   171	**Also pending (Pavleen's manual actions):**
   172	- Publish VS Code v1.4.0: `cd vscode-extension && vsce publish`
   173	- Revoke + regenerate PyPI token (was exposed in terminal)
   174	- Publish marketing drafts (.internal/marketing/)
   175	
   176	---
   177	
   178	## 8. CONSISTENCY CHECK PROTOCOL
   179	
   180	When changing counts or versions:
   181	1. Update source of truth (package.json, index.js)
   182	2. Bulk replace across website: `Get-ChildItem -Recurse -Path "website/src/pages" -Filter "*.tsx" | ...`
   183	3. Update READMEs (root, mcp-server, vscode-extension, python-sdk, python-mcp)
   184	4. Update chatbot prompt (functions/server.js)
   185	5. Update docusaurus.config.ts
   186	6. Commit: `fix: sync [thing] across N files`
   187	7. Verify: `node scripts/validate-consistency.js`
   188	
   189	---
   190	
   191	## 9. KEY DECISIONS LOG
   192	
   193	- **16 modules** (not 18) — knowledge.json has F4+R3+O3+O3+T3 = 16
   194	- **23 tools** (not 22) — run_evaluation added March 28
   195	- **20 ALL Ready** — every play has production openai.json + guardrails.json
   196	- **Python SDK has ZERO dependencies** — pure stdlib, offline-first
   197	- **VS Code sidebar: 2 panels** (was 4) — removed Knowledge Hub + Glossary for cleaner UX
   198	- **Stubs removed**: foundry.py, sso.py, telemetry.py, a2a.py deleted from Python SDK (were non-functional)
   199	- **Cost estimates are hardcoded** — not live Azure Pricing API (known gap)
   200	- **A/B testing requires model_fn callback** — no built-in LLM (by design)
   201	
   202	---
   203	
   204	## 10. CRITICAL FILES TO READ FIRST
   205	
   206	For any new session, read these in order:
   207	1. `.internal/docs/knowledge-mapping.md` — Full ecosystem reference
   208	2. `.internal/docs/ImplementationPlan.md` — Master plan with all phases
   209	3. `mcp-server/package.json` — npm version
   210	4. `vscode-extension/package.json` — VS Code version + commands
   211	5. `python-sdk/pyproject.toml` — Python SDK version
   212	
   213	---
   214	
   215	## 11. COMMON TASKS
   216	
   217	### Bump npm version
   218	```bash
   219	cd mcp-server && npm version patch && npm publish
   220	# Then sync "3.X.Y" across all READMEs + website pages
   221	```
   222	
   223	### Bump VS Code version
   224	```bash
   225	cd vscode-extension && npm version patch && vsce publish
   226	# Then sync version across dev-hub.tsx, adoption.tsx, changelog
   227	```
   228	
   229	### Add a new MCP tool
   230	1. Add `server.tool()` in `mcp-server/index.js`
   231	2. Add to `MCP_TOOLS` array in `vscode-extension/src/extension.js`
   232	3. Add to `mcp-server/README.md` tool table
   233	4. Bulk replace tool count across website pages
   234	5. Update chatbot prompt in `functions/server.js`
   235	
   236	### Add a new solution play
   237	1. Create `solution-plays/XX-name/` with config/, .github/, spec/, infra/
   238	2. Add to `SOLUTION_PLAYS` in `vscode-extension/src/extension.js`
   239	3. Add to `_PLAYS_DATA` in `python-sdk/frootai/plays.py`
   240	4. Create `froot.json` manifest
   241	5. Update play count across website + READMEs
   242	
   243	---
   244	
   245	## 12. SECURITY NOTES
   246	
   247	- PyPI token was exposed in terminal history — MUST be revoked
   248	- All Azure resources use managed identity (no API keys)
   249	- Content Safety API enabled in all play guardrails
   250	- Private endpoints recommended (Landing Zone plays enforce this)
   251	- GitHub Secrets not yet configured — auto-publish workflows can't fire
   252	