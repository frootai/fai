# fai-slack-plugin

> Slack integration plugin for FAI — 4 MCP tools, dedicated agent, compatible plays.

## Overview

This community plugin integrates **Slack** with the FAI ecosystem, providing AI-powered workspace communication. It includes a dedicated agent, domain instructions, and 4 MCP tools for sending messages, creating channels, replying in threads, and sending notifications with intelligent context awareness.

## Installation

```bash
npx FAI install community/slack
```

## What's Included

| Type | Primitive | Purpose |
|------|-----------|---------|
| Agent | FAI Slack Expert | Channel management, notification design, bot interaction patterns |
| Instruction | Slack Integration | Best practices for Block Kit, threading, and workspace automation |
| MCP Tool | `slack_message_send` | Send messages with rich formatting and attachments |
| MCP Tool | `slack_channel_create` | Create channels with topic, purpose, and initial members |
| MCP Tool | `slack_thread_reply` | Reply in threads with context-aware AI-generated responses |
| MCP Tool | `slack_user_notify` | Send direct notifications with priority and action buttons |

## Configuration

Set the following environment variables or store them in Azure Key Vault:

- `SLACK_BASE_URL` — Slack API endpoint (default: `https://slack.com/api`)
- `SLACK_CLIENT_ID` — OAuth2 client ID for your Slack app
- `SLACK_CLIENT_SECRET` — OAuth2 client secret (use Key Vault reference in production)

Optional: `timeout_ms` (default 30000), `retry_max` (default 3), `rate_limit_per_minute` (default 60).

## Usage Example

```
@fai-slack-expert Post a deployment summary to #releases with a
thread containing the changelog and tag the on-call engineer.
```

The agent will use `slack_message_send` for the main post and `slack_thread_reply` for the changelog details.

## Compatible Solution Plays

- **All plays** — Slack is a universal notification and collaboration channel

## Authentication

Uses OAuth2 with `read` and `write` scopes. Token refresh is handled automatically by the MCP runtime.

## Keywords

`slack` `messaging` `channels` `notifications` `collaboration` `chat` `mcp` `community`

## Links

- [Slack API Docs](https://api.slack.com/docs)
- [FAI Community Plugins](https://FAI.dev/primitives/plugins)
- [FAI Solution Plays](https://FAI.dev/solution-plays)

## License

MIT — FAI Community
