# salesforce-ai-copilot

> Salesforce CRM integration — AI copilot for sales forecasting, lead scoring, account summarization.

## Overview

This community plugin integrates **Salesforce** with the FAI ecosystem, providing AI-powered CRM intelligence. It includes a dedicated agent and instructions for sales forecasting, lead scoring, opportunity analysis, and account summarization using Einstein AI and SOQL-driven data extraction.

## Installation

```bash
npx FAI install community/salesforce
```

## What's Included

| Type | Primitive | Purpose |
|------|-----------|---------|
| Agent | FAI Salesforce Expert | Sales forecasting, lead scoring, account health analysis |
| Instruction | Salesforce Integration | Best practices for CRM data access, Apex triggers, SOQL patterns |
| Workflow | Salesforce Sync | Automated CRM data synchronization pipeline |

## Key Capabilities

- **Sales Forecasting** — AI-driven pipeline analysis with confidence scoring
- **Lead Scoring** — Multi-signal lead qualification using historical conversion data
- **Account Summarization** — Auto-generated account briefs from CRM activity history
- **Opportunity Insights** — Risk detection and next-best-action recommendations

## Configuration

Set the following environment variables or store them in Azure Key Vault:

- `SALESFORCE_INSTANCE_URL` — Your Salesforce org URL (e.g., `https://yourorg.my.salesforce.com`)
- `SALESFORCE_CLIENT_ID` — Connected App client ID
- `SALESFORCE_CLIENT_SECRET` — Connected App secret (use Key Vault reference in production)

## Usage Example

```
@fai-salesforce-expert Summarize the top 10 opportunities at risk of slipping
this quarter and suggest next actions for each.
```

The agent queries Salesforce via SOQL, applies AI analysis, and returns prioritized recommendations.

## Compatible Solution Plays

- **Play 07 — Multi-Agent Service**: CRM agent as part of enterprise multi-agent orchestration

## Dependencies

- `FAI-mcp` — FAI MCP Server for tool execution

## Keywords

`salesforce` `crm` `sales` `lead-scoring` `forecasting` `enterprise` `integration`

## Links

- [Salesforce REST API Docs](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/)
- [FAI Community Plugins](https://FAI.dev/primitives/plugins)
- [Play 07 — Multi-Agent Service](https://FAI.dev/solution-plays/07)

## License

MIT — FAI Community
