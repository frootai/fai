# Partner Onboarding Kit — FrootAI Integration Guide

> **For Partners**: ServiceNow, Salesforce, SAP, Datadog, PagerDuty, Jira, and other enterprise platforms.
> This guide walks you through creating a FrootAI community plugin that connects your platform to the FAI ecosystem.

---

## What Is a Community Plugin?

A community plugin bundles FrootAI primitives (agents, skills, instructions, hooks) to integrate your platform with AI solution plays. When users install your plugin, they get pre-built AI capabilities for your platform — wired into the FAI Protocol.

**Examples already built:**
- `community-plugins/servicenow/` — IT ticket classification, routing, resolution via ServiceNow MCP
- `community-plugins/salesforce/` — CRM integration, lead scoring, pipeline AI
- `community-plugins/sap/` — ERP integration, procurement AI, supply chain

---

## Plugin Structure

```
community-plugins/
└── your-platform/
    ├── plugin.json          # Required — plugin manifest
    ├── README.md            # Required — install guide + architecture
    ├── agents/              # Optional — platform-specific agents
    │   └── your-agent.agent.md
    ├── skills/              # Optional — platform-specific skills
    │   └── your-skill/
    │       └── SKILL.md
    ├── instructions/        # Optional — platform-specific coding standards
    │   └── your-platform.instructions.md
    └── hooks/               # Optional — platform-specific lifecycle hooks
        └── your-hook/
            ├── hooks.json
            └── script.sh
```

---

## Step 1: Create `plugin.json`

```json
{
  "name": "your-platform",
  "description": "FrootAI integration for YourPlatform — [what it does]",
  "version": "1.0.0",
  "author": {
    "name": "Your Company",
    "url": "https://yourplatform.com"
  },
  "license": "MIT",
  "keywords": ["your-platform", "integration", "mcp", "enterprise"],
  "plays": ["05-it-ticket-resolution", "54-ai-customer-support-v2"],
  "primitives": {
    "agents": ["agents/your-agent.agent.md"],
    "skills": ["skills/your-skill/"],
    "instructions": ["instructions/your-platform.instructions.md"],
    "hooks": []
  },
  "mcp": {
    "tools": ["your_platform_search", "your_platform_create", "your_platform_update"],
    "transport": "stdio"
  },
  "requirements": {
    "node": ">=18",
    "apiAccess": "YourPlatform API key or OAuth2 credentials"
  }
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Kebab-case, matches folder name |
| `description` | string | 10-1024 characters |
| `version` | string | Semver (e.g., `1.0.0`) |
| `author.name` | string | Company or individual name |
| `license` | string | Must be MIT for community plugins |

### Optional but Recommended

| Field | Type | Description |
|-------|------|-------------|
| `plays` | string[] | Which solution plays this plugin enhances |
| `keywords` | string[] | Search/discovery terms |
| `mcp.tools` | string[] | MCP tool names your plugin exposes |

---

## Step 2: Create Platform Agent

Create `agents/your-platform-agent.agent.md`:

```yaml
---
description: "AI agent for YourPlatform — [primary capability]"
tools: ["your_platform_search", "your_platform_create"]
waf: ["security", "reliability", "operational-excellence"]
plays: ["05-it-ticket-resolution"]
---

# YourPlatform AI Agent

You are an expert in YourPlatform integration. You help users:
- Search and retrieve records from YourPlatform
- Create and update records via API
- Map YourPlatform data to FrootAI solution play schemas
- Follow YourPlatform API best practices and rate limits

## Authentication
Always use OAuth2 or managed credentials. Never hardcode API keys.

## Rate Limiting
Respect YourPlatform API limits: [specify limits]

## Error Handling
On 429 (rate limit): exponential backoff with jitter
On 401 (auth): prompt for credential refresh
On 5xx: retry with circuit breaker (3 attempts, 30s cooldown)
```

---

## Step 3: Create README.md

Your README should include:

1. **What it does** — 2-3 sentence summary
2. **Prerequisites** — API access, credentials, versions
3. **Installation** — `npx frootai install your-platform`
4. **Configuration** — Environment variables, OAuth setup
5. **Compatible Plays** — Which solution plays it enhances
6. **MCP Tools** — What tools it adds to the MCP server
7. **Architecture** — How data flows between FrootAI and your platform
8. **Examples** — Real usage scenarios

---

## Step 4: Test & Validate

```bash
# Validate plugin structure
npm run validate:primitives

# Check JSON syntax
node -e "require('./community-plugins/your-platform/plugin.json')"

# Verify agent frontmatter
# (description 10+ chars, name kebab-case)
```

---

## Step 5: Submit PR

1. Fork [github.com/frootai/frootai](https://github.com/frootai/frootai)
2. Create branch: `feat/community-plugin-your-platform`
3. Add your plugin to `community-plugins/your-platform/`
4. Run validation: `npm run validate:primitives`
5. Submit PR using the [PR Template](https://github.com/frootai/frootai/blob/main/.github/PULL_REQUEST_TEMPLATE.md)

### PR Checklist for Partners

- [ ] `plugin.json` has all required fields
- [ ] `README.md` exists with installation instructions
- [ ] No hardcoded API keys or secrets
- [ ] All file names use lowercase-hyphen convention
- [ ] Agent files have valid YAML frontmatter (description 10+ chars)
- [ ] Tested with at least one compatible solution play
- [ ] License is MIT

---

## Existing Partner Plugins

| Partner | Folder | Plays | MCP Tools | Status |
|---------|--------|-------|-----------|--------|
| ServiceNow | `community-plugins/servicenow/` | 05, 37, 54 | ticket_search, ticket_create, ticket_update | ✅ Active |
| Salesforce | `community-plugins/salesforce/` | 54, 59, 64 | lead_search, opportunity_update, contact_create | ✅ Active |
| SAP | `community-plugins/sap/` | 55, 89 | procurement_search, inventory_check, order_create | ✅ Active |

---

## Partner Benefits

- **Marketplace Listing**: Your plugin appears in the [FAI Marketplace](https://frootai.dev/marketplace) (77+ plugins)
- **Search Index**: Discoverable via the website search (3,346 entries)
- **MCP Integration**: Your tools are accessible from Claude, Copilot, Cursor, Windsurf
- **Solution Play Wiring**: Users get your integration automatically when they init a compatible play
- **VS Code Extension**: Your plugin appears in the VS Code sidebar Primitives view
- **Community Visibility**: Listed on the [Partners page](https://frootai.dev/partners)

---

## Support

- **Documentation**: [frootai.dev/docs](https://frootai.dev/docs)
- **Community**: [frootai.dev/community](https://frootai.dev/community)
- **Contribute**: [frootai.dev/contribute](https://frootai.dev/contribute)
- **Issues**: [github.com/frootai/frootai/issues](https://github.com/frootai/frootai/issues)
- **Discussions**: [github.com/frootai/frootai/discussions](https://github.com/frootai/frootai/discussions)
