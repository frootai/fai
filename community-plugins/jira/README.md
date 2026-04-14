# fai-jira-plugin

> Jira integration plugin for FAI — 4 MCP tools, dedicated agent, compatible plays.

## Overview

This community plugin integrates **Jira** with the FAI ecosystem, providing AI-powered project management capabilities. It includes a dedicated agent, domain instructions, and 4 MCP tools for creating issues, querying sprints, updating boards, and tracking releases with intelligent prioritization.

## Installation

```bash
npx FAI install community/jira
```

## What's Included

| Type | Primitive | Purpose |
|------|-----------|---------|
| Agent | FAI Jira Expert | Guides sprint planning, backlog grooming, and release tracking |
| Instruction | Jira Workflow | Best practices for AI-assisted issue triage and sprint optimization |
| MCP Tool | `jira_issue_create` | Create issues with type, priority, labels, components, custom fields |
| MCP Tool | `jira_sprint_query` | Query sprint content — backlog, in-progress, done with story points |
| MCP Tool | `jira_board_update` | Move items between columns, update status transitions |
| MCP Tool | `jira_release_track` | Track release progress — resolved, remaining, blockers |

## Configuration

Set the following environment variables or store them in Azure Key Vault:

- `JIRA_BASE_URL` — Your Jira instance URL (e.g., `https://yourorg.atlassian.net`)
- `JIRA_CLIENT_ID` — OAuth2 client ID for API access
- `JIRA_CLIENT_SECRET` — OAuth2 client secret (use Key Vault reference in production)

Optional: `timeout_ms` (default 30000), `retry_max` (default 3), `rate_limit_per_minute` (default 60).

## Usage Example

```
@fai-jira-expert Show me the current sprint status for project AIOPS
and identify any stories at risk of not completing.
```

The agent will use `jira_sprint_query` to analyze velocity and flag blocked or over-scoped items.

## Compatible Solution Plays

- **Play 24 — Code Review AI**: AI-assisted PR-to-Jira issue linking
- **Play 32 — Test Automation**: Test coverage mapped to Jira stories
- **Play 51 — Enterprise Workflow**: Multi-system workflow orchestration

## Authentication

Uses OAuth2 with `read` and `write` scopes. Token refresh is handled automatically by the MCP runtime.

## Keywords

`jira` `project-management` `sprints` `issues` `agile` `backlogs` `mcp` `community`

## Links

- [Jira REST API Docs](https://developer.atlassian.com/cloud/jira/platform/rest/)
- [FAI Community Plugins](https://FAI.dev/primitives/plugins)
- [Play 24 — Code Review AI](https://FAI.dev/solution-plays/24)

## License

MIT — FAI Community
