# fai-pagerduty-plugin

> PagerDuty integration plugin for FAI — 3 MCP tools, dedicated agent, compatible plays.

## Overview

This community plugin integrates **PagerDuty** with the FAI ecosystem, providing AI-powered incident management. It includes a dedicated agent, domain instructions, and 3 MCP tools for creating incidents, querying on-call schedules, and triggering escalations with intelligent severity assessment.

## Installation

```bash
npx FAI install community/pagerduty
```

## What's Included

| Type | Primitive | Purpose |
|------|-----------|---------|
| Agent | FAI PagerDuty Expert | Guides incident triage, escalation policy design, and on-call optimization |
| Instruction | PagerDuty Incident Mgmt | Best practices for AI-driven severity classification and auto-escalation |
| MCP Tool | `pagerduty_incident_create` | Create incidents with severity, service, and escalation policy |
| MCP Tool | `pagerduty_oncall_query` | Query who is currently on-call for a specific service |
| MCP Tool | `pagerduty_escalation_trigger` | Trigger escalation for an existing incident |

## Configuration

Set the following environment variables or store them in Azure Key Vault:

- `PAGERDUTY_BASE_URL` — Your PagerDuty API endpoint (e.g., `https://api.pagerduty.com`)
- `PAGERDUTY_CLIENT_ID` — OAuth2 client ID for API access
- `PAGERDUTY_CLIENT_SECRET` — OAuth2 client secret (use Key Vault reference in production)

Optional: `timeout_ms` (default 30000), `retry_max` (default 3), `rate_limit_per_minute` (default 60).

## Usage Example

```
@fai-pagerduty-expert Our RAG pipeline latency spiked above 5s.
Create a P2 incident and check who's on-call for the AI platform team.
```

The agent will use `pagerduty_incident_create` and `pagerduty_oncall_query` to file the incident and notify the right responder.

## Compatible Solution Plays

- **Play 37 — DevOps AI Assistant**: AI-powered incident detection, escalation, and resolution

## Authentication

Uses OAuth2 with `read` and `write` scopes. Token refresh is handled automatically by the MCP runtime.

## Keywords

`pagerduty` `incidents` `escalation` `on-call` `alerting` `devops` `mcp` `community`

## Links

- [PagerDuty API Docs](https://developer.pagerduty.com/api-reference/)
- [FAI Community Plugins](https://FAI.dev/primitives/plugins)
- [Play 37 — DevOps AI Assistant](https://FAI.dev/solution-plays/37)

## License

MIT — FAI Community
