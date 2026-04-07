# Good First Issues — FrootAI Community

> **For Newcomers**: These issues are labeled `good first issue` and are perfect for your first contribution to FrootAI.
> Each issue has a clear scope, expected output, and links to related files.
> See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

---

## 🤖 Add New Agents (10 issues)

Agents are `.agent.md` files in `agents/`. Each needs YAML frontmatter with `description`, optional `tools`, `waf`, and `plays` fields.

| # | Issue Title | File to Create | Reference Play | Difficulty |
|---|-------------|---------------|---------------|------------|
| 1 | Add `frootai-data-quality-analyst` agent | `agents/frootai-data-quality-analyst.agent.md` | Play 27 (AI Data Pipeline) | Easy |
| 2 | Add `frootai-mlops-engineer` agent | `agents/frootai-mlops-engineer.agent.md` | Play 13 (Fine-Tuning) | Easy |
| 3 | Add `frootai-chaos-engineer` agent | `agents/frootai-chaos-engineer.agent.md` | Play 37 (AI DevOps) | Easy |
| 4 | Add `frootai-ux-researcher` agent | `agents/frootai-ux-researcher.agent.md` | Play 31 (Low-Code Builder) | Easy |
| 5 | Add `frootai-incident-responder` agent | `agents/frootai-incident-responder.agent.md` | Play 37 (AI DevOps) | Easy |
| 6 | Add `frootai-data-privacy-officer` agent | `agents/frootai-data-privacy-officer.agent.md` | Play 35 (Compliance) | Medium |
| 7 | Add `frootai-api-designer` agent | `agents/frootai-api-designer.agent.md` | Play 29 (MCP Gateway) | Easy |
| 8 | Add `frootai-database-optimizer` agent | `agents/frootai-database-optimizer.agent.md` | Play 45 (Real-Time Event AI) | Medium |
| 9 | Add `frootai-accessibility-tester` agent | `agents/frootai-accessibility-tester.agent.md` | Play 76 (Accessibility) | Easy |
| 10 | Add `frootai-localization-expert` agent | `agents/frootai-localization-expert.agent.md` | Play 57 (Translation) | Easy |

**Template:**
```yaml
---
description: "One-line description (10+ chars)"
tools: []
waf: ["security", "reliability"]
plays: ["XX-play-slug"]
---

# Agent Name

Your detailed agent instructions here.
```

---

## 🧩 Create New Skills (5 issues)

Skills are `SKILL.md` files in `skills/<name>/`. Each needs frontmatter with `name` (kebab-case, must match folder) and `description`.

| # | Issue Title | Folder to Create | Reference | Difficulty |
|---|-------------|-----------------|-----------|------------|
| 11 | Create `frootai-load-test-runner` skill | `skills/frootai-load-test-runner/` | Play 32 (Testing) | Medium |
| 12 | Create `frootai-pii-scanner` skill | `skills/frootai-pii-scanner/` | Play 35 (Compliance) | Medium |
| 13 | Create `frootai-cost-report-generator` skill | `skills/frootai-cost-report-generator/` | Play 66 (Infra Optimizer) | Easy |
| 14 | Create `frootai-changelog-writer` skill | `skills/frootai-changelog-writer/` | All plays | Easy |
| 15 | Create `frootai-diagram-generator` skill | `skills/frootai-diagram-generator/` | All plays | Medium |

---

## 📝 Create New Instructions (5 issues)

Instructions are `.instructions.md` files in `instructions/`. Each needs `description` and `applyTo` glob patterns.

| # | Issue Title | File to Create | ApplyTo | Difficulty |
|---|-------------|---------------|---------|------------|
| 16 | Add `graphql-waf` instructions | `instructions/graphql-waf.instructions.md` | `**/*.graphql, **/*.gql` | Easy |
| 17 | Add `dockerfile-waf` instructions | `instructions/dockerfile-waf.instructions.md` | `**/Dockerfile*` | Easy |
| 18 | Add `terraform-waf` instructions | `instructions/terraform-waf.instructions.md` | `**/*.tf` | Medium |
| 19 | Add `rust-waf` instructions | `instructions/rust-waf.instructions.md` | `**/*.rs` | Medium |
| 20 | Add `swift-waf` instructions | `instructions/swift-waf.instructions.md` | `**/*.swift` | Medium |

---

## 📖 Improve Documentation (5 issues)

| # | Issue Title | File | Difficulty |
|---|-------------|------|------------|
| 21 | Add code examples to L4: Skills Workshop | `frootai.dev/src/app/learning-hub/skills-workshop/` | Easy |
| 22 | Add troubleshooting section to Setup Guide | `frootai.dev/src/app/setup-guide/` | Easy |
| 23 | Add architecture diagrams to 5 play READMEs | `solution-plays/*/README.md` | Medium |
| 24 | Translate README.md to Spanish | `README.es.md` | Easy |
| 25 | Translate README.md to Chinese | `README.zh.md` | Easy |

---

## How to Claim an Issue

1. Comment on the GitHub issue: "I'd like to work on this"
2. Fork the repo and create a branch: `feat/issue-number-description`
3. Follow the naming conventions in [CONTRIBUTING.md](../CONTRIBUTING.md)
4. Run `npm run validate:primitives` before submitting
5. Submit a PR referencing the issue number

## Labels

- `good first issue` — Perfect for newcomers
- `help wanted` — Community contributions welcome
- `primitive` — New agent, skill, instruction, or hook
- `documentation` — Docs improvements
- `solution-play` — Play-related work
