# fai-teams-plugin

> Microsoft Teams integration plugin for FAI — 3 MCP tools, dedicated agent, compatible plays.

## Overview

This community plugin integrates **Microsoft Teams** with the FAI ecosystem, providing AI-powered collaboration features. It includes a dedicated agent, domain instructions, and 3 MCP tools for sending Adaptive Cards, posting channel messages, and scheduling meetings with AI-generated briefings.

## Installation

```bash
npx FAI install community/teams
```

## What's Included

| Type | Primitive | Purpose |
|------|-----------|---------|
| Agent | FAI Teams Expert | Teams app design, Adaptive Card authoring, bot framework patterns |
| Instruction | Teams Integration | Best practices for Graph API, Bot Framework, and M365 compliance |
| MCP Tool | `teams_adaptive_card_send` | Send Adaptive Cards with interactive elements to channels or chats |
| MCP Tool | `teams_channel_message` | Post messages with formatting and @mentions to Teams channels |
| MCP Tool | `teams_meeting_schedule` | Schedule meetings with participants, agenda, and AI briefings |

## Configuration

Set the following environment variables or store them in Azure Key Vault:

- `TEAMS_TENANT_ID` — Azure AD tenant ID for Microsoft Graph access
- `TEAMS_CLIENT_ID` — App registration client ID
- `TEAMS_CLIENT_SECRET` — App registration secret (use Key Vault reference in production)

Optional: `timeout_ms` (default 30000), `retry_max` (default 3), `rate_limit_per_minute` (default 60).

## Usage Example

```
@fai-teams-expert Send an Adaptive Card to the #ai-platform channel
showing today's model performance metrics with approve/reject buttons.
```

The agent will use `teams_adaptive_card_send` to build and deliver an interactive card with live data.

## Compatible Solution Plays

- **Play 08 — Copilot Studio Bot**: Teams bot with Copilot Studio integration
- **Play 16 — Copilot Teams Extension**: Native Teams message extension
- **Play 39 — M365 Copilot Plugin**: Microsoft 365 Copilot plugin development
- **Play 40 — Declarative Copilot**: Custom Copilot agent for Teams

## Authentication

Uses OAuth2 via Azure AD with `read` and `write` scopes. Token refresh is handled automatically by the MCP runtime.

## Keywords

`teams` `microsoft` `adaptive-cards` `collaboration` `meetings` `m365` `mcp` `community`

## Links

- [Microsoft Graph API Docs](https://learn.microsoft.com/en-us/graph/)
- [FAI Community Plugins](https://FAI.dev/primitives/plugins)
- [Play 16 — Copilot Teams Extension](https://FAI.dev/solution-plays/16)

## License

MIT — FAI Community
