# servicenow-ai-agent

> ServiceNow ITSM integration — AI-powered ticket routing, auto-resolution, knowledge base search.

## Overview

This community plugin integrates **ServiceNow** with the FAI ecosystem, providing AI-powered IT Service Management. It includes a dedicated agent and instructions for intelligent ticket routing, automated resolution of common issues, knowledge base search, and SLA compliance monitoring.

## Installation

```bash
npx FAI install community/servicenow
```

## What's Included

| Type | Primitive | Purpose |
|------|-----------|---------|
| Agent | FAI ServiceNow Expert | ITSM workflows, ticket triage, auto-resolution patterns |
| Instruction | ServiceNow Integration | Best practices for REST API, Flow Designer, GlideRecord |
| Workflow | ServiceNow Sync | Automated ticket sync and knowledge base indexing |

## Key Capabilities

- **Intelligent Ticket Routing** — AI classification of incidents by category, priority, and assignment group
- **Auto-Resolution** — Pattern matching against known solutions for L1/L2 tickets
- **Knowledge Base Search** — Semantic search across ServiceNow KB articles for relevant solutions
- **SLA Monitoring** — Proactive alerting on tickets approaching SLA breach thresholds

## Configuration

Set the following environment variables or store them in Azure Key Vault:

- `SERVICENOW_INSTANCE_URL` — Your ServiceNow instance (e.g., `https://yourorg.service-now.com`)
- `SERVICENOW_CLIENT_ID` — OAuth2 client ID for REST API access
- `SERVICENOW_CLIENT_SECRET` — OAuth2 client secret (use Key Vault reference in production)

## Usage Example

```
@fai-servicenow-expert Route the last 50 unassigned P2 incidents
to the correct assignment groups based on category and description.
```

The agent queries the incident table, applies AI classification, and updates assignment groups via REST API.

## Compatible Solution Plays

- **Play 05 — IT Ticket Resolution**: End-to-end AI-powered ticket lifecycle management

## Dependencies

- `FAI-mcp` — FAI MCP Server for tool execution

## Keywords

`servicenow` `itsm` `ticketing` `incident-management` `knowledge-base` `enterprise` `integration`

## Links

- [ServiceNow REST API Docs](https://developer.servicenow.com/dev.do#!/reference/api)
- [FAI Community Plugins](https://FAI.dev/primitives/plugins)
- [Play 05 — IT Ticket Resolution](https://FAI.dev/solution-plays/05)

## License

MIT — FAI Community
