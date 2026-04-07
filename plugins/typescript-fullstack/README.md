# typescript-fullstack

> TypeScript Full-Stack — Next.js, React, NestJS, Prisma, Zod, Vitest, and end-to-end type safety. Modern web development with server components, tRPC, and Tailwind CSS.

## Overview

This plugin bundles **17 primitives** (2 agents, 8 instructions, 4 skills, 3 hooks) into a single installable package. All primitives are WAF-aligned and compatible with the FAI Protocol auto-wiring system.

## Installation

```bash
npx frootai install typescript-fullstack
```

Or manually copy the referenced primitives from the FrootAI repository into your project.

## What's Included

| Type | Name | Purpose |
|------|------|---------|
| Agent | `frootai-typescript-expert` | Typescript expert specialist |
| Agent | `frootai-react-expert` | React expert specialist |
| Instruction | `typescript-waf` | Typescript waf standards |
| Instruction | `nextjs-waf` | Nextjs waf standards |
| Instruction | `nestjs-waf` | Nestjs waf standards |
| Instruction | `prisma-waf` | Prisma waf standards |
| Instruction | `zod-waf` | Zod waf standards |
| Instruction | `vitest-waf` | Vitest waf standards |
| Instruction | `tailwind-waf` | Tailwind waf standards |
| Instruction | `trpc-waf` | Trpc waf standards |
| Skill | `frootai-nextjs-scaffold` | Nextjs scaffold capability |
| Skill | `frootai-react-component-scaffold` | React component scaffold capability |
| Skill | `frootai-jest-test` | Jest test capability |
| Skill | `frootai-playwright-test` | Playwright test capability |
| Hook | `frootai-secrets-scanner` | Secrets scanner gate |
| Hook | `frootai-tool-guardian` | Tool guardian gate |
| Hook | `frootai-governance-audit` | Governance audit gate |

## Keywords

`typescript` `nextjs` `react` `nestjs` `prisma` `zod` `vitest` `tailwind`

## Usage

After installation, the primitives are available in your project:

1. **Agents** activate when you `@mention` them in Copilot Chat
2. **Instructions** auto-apply to matching files via `applyTo` glob patterns
3. **Skills** are invoked by agents or via `/skill` commands
4. **Hooks** fire automatically at session lifecycle events

When used inside a solution play with `fai-manifest.json`, all primitives auto-wire through the FAI Protocol — shared context, WAF guardrails, and evaluation thresholds propagate automatically.

## WAF Alignment

| Pillar | Coverage |
|--------|----------|
| Security | Secrets scanning, Managed Identity, Key Vault integration, RBAC |
| Reliability | Retry with backoff, circuit breaker, health probes, fallback chains |
| Operational Excellence | CI/CD integration, observability, IaC templates, automated testing |

## Quality Gates

When used inside a play, this plugin enforces:

| Metric | Threshold |
|--------|-----------|
| Groundedness | ≥ 0.85 |
| Coherence | ≥ 0.80 |
| Relevance | ≥ 0.80 |
| Safety | 0 violations |
| Cost per query | ≤ $0.05 |

## Contributing

To improve this plugin:

1. Fork the [FrootAI repository](https://github.com/FrootAI/frootai)
2. Edit files in `plugins/typescript-fullstack/`
3. Run `npm run validate:primitives` to verify
4. Open a PR — CI validates schema and naming automatically

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full guidelines.

## License

MIT — see [LICENSE](../../LICENSE)