---
description: "Copilot Teams Extension domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Copilot Teams Extension — Domain Knowledge

This workspace implements a Microsoft Teams Copilot extension — message extensions, adaptive cards, bot framework integration, and Microsoft Graph API for enterprise team productivity.

## Teams Extension Architecture (What the Model Gets Wrong)

### Declarative Agent Manifest (Not Custom Bot Code)
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.2/schema.json",
  "version": "v1.2",
  "name": "Enterprise Assistant",
  "description": "Answers questions using company knowledge base",
  "instructions": "You help employees find information from SharePoint and internal docs.",
  "capabilities": [
    { "name": "OneDriveAndSharePoint", "items_by_url": [{ "url": "https://contoso.sharepoint.com/sites/knowledge" }] }
  ],
  "actions": [{ "id": "lookupEmployee", "file": "apiPlugin.json" }]
}
```

### Message Extension vs Bot vs Declarative Agent
| Type | When to Use | Complexity |
|------|------------|-----------|
| Declarative Agent | Knowledge Q&A over M365 data | Low (config only) |
| Message Extension | Search + action commands in compose box | Medium |
| Bot Framework | Full conversational AI with state | High |
| API Plugin | Extend Copilot with custom API calls | Medium |

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Building bot from scratch | Teams Toolkit + declarative agents handle 80% of cases | Start with declarative, upgrade to bot only if needed |
| No SSO authentication | Users prompted to login repeatedly | Configure Azure AD SSO in manifest |
| Ignoring adaptive cards | Plain text responses in Teams look unprofessional | Use Adaptive Cards for rich UI |
| No Graph API for M365 data | Querying external DB instead of M365 | Use Graph API: search, calendar, mail, files |
| No rate limiting | Bot overwhelms Teams API | Respect Teams throttling: 50 msg/sec |
| Hardcoded tenant ID | Works only in one tenant | Use `{tenantId}` token in manifest |
| No error cards | Errors show raw JSON | Return AdaptiveCard with friendly error message |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Model for generating responses |
| `config/guardrails.json` | Content moderation, response length limits |
| `config/agents.json` | Bot behavior, conversation flow rules |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement Teams extension, adaptive cards, Graph API integration |
| `@reviewer` | Audit SSO, permissions, card design, throttling compliance |
| `@tuner` | Optimize response quality, card layouts, Graph query performance |

## Slash Commands
`/deploy` — Deploy to Teams | `/test` — Test in Teams Toolkit | `/review` — Audit security | `/evaluate` — Evaluate user engagement
