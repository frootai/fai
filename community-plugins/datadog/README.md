# fai-datadog-plugin

> Datadog integration plugin for FAI — 4 MCP tools, dedicated agent, compatible plays.

## Overview

This community plugin integrates **Datadog** with the FAI ecosystem, providing full-stack observability for AI workloads. It includes a dedicated agent, domain instructions, and 4 MCP tools for monitoring metrics, creating dashboards, managing monitors, and searching events across your AI infrastructure.

## Installation

```bash
npx FAI install community/datadog
```

## What's Included

| Type | Primitive | Purpose |
|------|-----------|---------|
| Agent | FAI Datadog Expert | Guides Datadog setup, dashboard design, and alert tuning for AI systems |
| Instruction | Datadog Observability | Best practices for AI-specific metrics, SLOs, and anomaly detection |
| MCP Tool | `datadog_metric_query` | Query metrics with aggregation, grouping, and time series |
| MCP Tool | `datadog_dashboard_create` | Create dashboards with widgets for AI system observability |
| MCP Tool | `datadog_monitor_create` | Create monitors with thresholds, notifications, and escalation |
| MCP Tool | `datadog_event_search` | Search events by tags, time range, priority, and source |

## Configuration

Set the following environment variables or store them in Azure Key Vault:

- `DATADOG_BASE_URL` — Your Datadog API endpoint (e.g., `https://api.datadoghq.com`)
- `DATADOG_CLIENT_ID` — OAuth2 client ID for API access
- `DATADOG_CLIENT_SECRET` — OAuth2 client secret (use Key Vault reference in production)

Optional: `timeout_ms` (default 30000), `retry_max` (default 3), `rate_limit_per_minute` (default 60).

## Usage Example

```
@fai-datadog-expert Create a dashboard for monitoring my RAG pipeline latency,
token usage, and error rates across the last 24 hours.
```

The agent will use `datadog_dashboard_create` and `datadog_metric_query` to build a comprehensive AI observability dashboard.

## Compatible Solution Plays

- **Play 17 — AI Observability**: End-to-end monitoring for AI workloads
- **Play 37 — DevOps AI Assistant**: AI-powered incident detection and response

## Authentication

Uses OAuth2 with `read` and `write` scopes. Token refresh is handled automatically by the MCP runtime.

## Keywords

`datadog` `observability` `monitoring` `apm` `metrics` `dashboards` `mcp` `community`

## Links

- [Datadog API Docs](https://docs.datadoghq.com/api/)
- [FAI Community Plugins](https://FAI.dev/primitives/plugins)
- [Play 17 — AI Observability](https://FAI.dev/solution-plays/17)

## License

MIT — FAI Community
