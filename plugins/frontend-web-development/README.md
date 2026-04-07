# frontend-web-development

> Frontend Web Development — React, Angular, Vue, Svelte, Astro, and Tailwind CSS patterns. Component architecture, state management, accessibility, and performance optimization for modern web apps.

## Overview

This plugin bundles **22 primitives** (6 agents, 7 instructions, 6 skills, 3 hooks) into a single installable package. All primitives are WAF-aligned and compatible with the FAI Protocol auto-wiring system.

## Installation

```bash
npx frootai install frontend-web-development
```

Or manually copy the referenced primitives from the FrootAI repository into your project.

## What's Included

| Type | Name | Purpose |
|------|------|---------|
| Agent | `frootai-react-expert` | React expert specialist |
| Agent | `frootai-vue-expert` | Vue expert specialist |
| Agent | `frootai-svelte-expert` | Svelte expert specialist |
| Agent | `frootai-angular-expert` | Angular expert specialist |
| Agent | `frootai-ux-designer` | Ux designer specialist |
| Agent | `frootai-accessibility-expert` | Accessibility expert specialist |
| Instruction | `html-css-waf` | Html css waf standards |
| Instruction | `tailwind-waf` | Tailwind waf standards |
| Instruction | `nextjs-waf` | Nextjs waf standards |
| Instruction | `nuxt-waf` | Nuxt waf standards |
| Instruction | `svelte-waf` | Svelte waf standards |
| Instruction | `astro-waf` | Astro waf standards |
| Instruction | `a11y-waf` | A11y waf standards |
| Skill | `frootai-react-component-scaffold` | React component scaffold capability |
| Skill | `frootai-design-ui-components` | Design ui components capability |
| Skill | `frootai-design-responsive` | Design responsive capability |
| Skill | `frootai-design-accessibility` | Design accessibility capability |
| Skill | `frootai-design-themes` | Design themes capability |
| Skill | `frootai-premium-frontend-ui` | Premium frontend ui capability |
| Hook | `frootai-secrets-scanner` | Secrets scanner gate |
| Hook | `frootai-tool-guardian` | Tool guardian gate |
| Hook | `frootai-governance-audit` | Governance audit gate |

## Keywords

`frontend` `react` `angular` `vue` `svelte` `astro` `tailwind` `accessibility` `responsive`

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
2. Edit files in `plugins/frontend-web-development/`
3. Run `npm run validate:primitives` to verify
4. Open a PR — CI validates schema and naming automatically

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full guidelines.

## License

MIT — see [LICENSE](../../LICENSE)