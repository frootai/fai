# FrootAI Governance

> How decisions are made, who makes them, and how you can shape FrootAI's future.

## Mission

We are building the **industry standard for AI primitive unification** — the
FAI Protocol that wires agents, instructions, skills, hooks, workflows,
plugins, tools, prompts, and guardrails into deployable solution plays.

## Project Stewardship

| Role | Responsibility |
|------|---------------|
| **Founder / BDFL** | Pavle (project founder). Casts deciding vote on protocol direction, breaking changes, and licensing. Accountable for the long-term mission. |
| **Core Maintainers** | Merge rights on `frootai/*` repos. Review PRs, triage issues, cut releases. Listed in [`MAINTAINERS.md`](./MAINTAINERS.md). |
| **Domain Owners** | Subject-matter experts for specific areas (RAG, security, infra). Listed in [`.github/CODEOWNERS`](./.github/CODEOWNERS). Auto-assigned PR reviews in their domain. |
| **Contributors** | Anyone who has had a PR merged. Recognized in `CONTRIBUTORS.md` (auto-generated). |
| **Community** | Everyone who participates in Discussions, Issues, Discord. |

## Decision-Making Process

We use a **lazy consensus** model with three escalation tiers:

### Tier 1 — Routine Changes (Lazy Consensus)
- Bug fixes, doc improvements, new primitives, new solution plays
- Any maintainer can merge after one approving review and passing CI
- No formal vote required

### Tier 2 — Significant Changes (Maintainer Consensus)
- Breaking API changes, new dependencies, removal of features, security policies
- Requires **2 maintainer approvals** + 7-day comment window
- Discussion happens on the PR or in a GitHub Discussion

### Tier 3 — Strategic Changes (RFC Process)
- Protocol changes, major architecture shifts, repo splits, license changes
- Requires an **RFC** (Request for Comments) document in
  [`frootai/rfcs`](https://github.com/frootai/rfcs) (planned repo)
- 14-day public comment period
- Final decision rests with the Founder + Core Maintainers

## Becoming a Maintainer

We invite contributors to become maintainers based on:

1. **Sustained contributions** — at least 10 merged PRs over 3+ months
2. **Quality** — PRs land cleanly, follow conventions, pass CI on first try most of the time
3. **Community** — constructive review comments, helps newcomers, follows Code of Conduct
4. **Trust** — current maintainers know your work and trust your judgment

Existing maintainers nominate; the Founder confirms. New maintainers start with
review + triage rights, gaining merge rights after a 4-week probation.

## Releases

Releases follow [SemVer](https://semver.org). Each distribution channel ships
independently:

| Channel | Cadence | Cut By |
|---------|---------|--------|
| `frootai-mcp` (npm) | As needed; bug fixes batched weekly | Any maintainer via `npm run release:mcp` |
| `frootai-vscode` (vsce) | Aligned with VS Code monthly release | Any maintainer via `npm run release:ext` |
| `frootai` (npm CLI) | As needed | Any maintainer via `npm run release:cli` |
| `frootai-mcp` / `frootai` (PyPI) | Aligned with npm cadence | Any maintainer via `npm run release:pymcp` |
| `frootai/frootai` (catalog) | Continuous (factory pipeline auto-syncs to `frootai-core`) | Automatic on merge to `main` |

Channel doctrine (enforced by `scripts/validate-channels.js`):
**local version ≤ registry-published + 1 patch + tolerance**.
Maintainers MUST NOT bump beyond this without first publishing the previous
version to the registry.

## Conflict Resolution

1. **Discuss** in the relevant PR/Issue first
2. **Escalate** to a Core Maintainer if no resolution in 7 days
3. **Founder decides** if maintainers cannot agree
4. **Code of Conduct violations** → email `conduct@frootai.dev`

## Funding & Sustainability

FrootAI is **MIT-licensed and free forever**. There is no premium tier.

Sustainability comes from:
- **GitHub Sponsors** (when available) for the Founder
- **Future managed offerings** in `frootai.dev` (hosted FAI Engine, evaluation
  pipelines) — distinct from the open-source primitives
- **Enterprise consulting** for large-scale solution-play deployments

No sponsor or paying customer can buy a feature, a vote, or a maintainer slot.
The catalog stays neutral.

## Amending This Document

Changes to this governance document follow the **Tier 3 RFC process**.
Existing maintainers + Founder must approve.

---

*Last updated: May 03, 2026.*
*Adapted from open-source governance patterns observed in CNCF, Apache, and Vercel projects.*
