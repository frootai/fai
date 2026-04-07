// #39: Create partner integration agents and plugin configs for 7 partners
const fs = require("fs"), path = require("path");

const partners = [
    {
        name: "servicenow",
        agent: "frootai-servicenow-expert",
        desc: "ServiceNow ITSM integration — incident management, change requests, CMDB queries, knowledge base, service catalog automation via REST API and MCP tools",
        tools: ["servicenow_ticket_search", "servicenow_ticket_create", "servicenow_ticket_update", "servicenow_cmdb_query", "servicenow_kb_search"],
        plays: ["05", "37", "54"],
        mcp_tools: [
            { name: "servicenow_ticket_search", desc: "Search ServiceNow incidents, changes, and requests by query, state, priority, or assigned group" },
            { name: "servicenow_ticket_create", desc: "Create a new ServiceNow incident, change request, or service request with full field population" },
            { name: "servicenow_ticket_update", desc: "Update an existing ServiceNow ticket — state, assignment, comments, work notes, resolution" },
            { name: "servicenow_cmdb_query", desc: "Query the ServiceNow CMDB for configuration items, relationships, and dependency maps" }
        ]
    },
    {
        name: "sap",
        agent: "frootai-sap-expert",
        desc: "SAP integration — procurement, inventory management, order processing, material queries via SAP BTP and OData APIs",
        tools: ["sap_procurement_search", "sap_inventory_check", "sap_order_create", "sap_material_query"],
        plays: ["55", "89"],
        mcp_tools: [
            { name: "sap_procurement_search", desc: "Search SAP procurement documents — purchase orders, requisitions, contracts" },
            { name: "sap_inventory_check", desc: "Check inventory levels across SAP warehouses and plants" },
            { name: "sap_order_create", desc: "Create a sales order or purchase order in SAP" },
            { name: "sap_material_query", desc: "Query SAP material master data — descriptions, pricing, availability" }
        ]
    },
    {
        name: "datadog",
        agent: "frootai-datadog-expert",
        desc: "Datadog observability integration — monitor creation, event search, dashboard queries, metric analysis, APM trace correlation for AI workloads",
        tools: ["datadog_monitor_create", "datadog_event_search", "datadog_metric_query", "datadog_dashboard_create"],
        plays: ["17", "37"],
        mcp_tools: [
            { name: "datadog_monitor_create", desc: "Create a Datadog monitor with thresholds, notifications, and escalation policies" },
            { name: "datadog_event_search", desc: "Search Datadog events by tags, time range, priority, and source" },
            { name: "datadog_metric_query", desc: "Query Datadog metrics with aggregation, grouping, and time series" },
            { name: "datadog_dashboard_create", desc: "Create a Datadog dashboard with widgets for AI system observability" }
        ]
    },
    {
        name: "pagerduty",
        agent: "frootai-pagerduty-expert",
        desc: "PagerDuty incident management — incident creation, on-call queries, escalation triggers, postmortem automation for AI system outages",
        tools: ["pagerduty_incident_create", "pagerduty_oncall_query", "pagerduty_escalation_trigger", "pagerduty_postmortem_create"],
        plays: ["37"],
        mcp_tools: [
            { name: "pagerduty_incident_create", desc: "Create a PagerDuty incident with severity, service, and escalation policy" },
            { name: "pagerduty_oncall_query", desc: "Query who is currently on-call for a specific PagerDuty service" },
            { name: "pagerduty_escalation_trigger", desc: "Trigger an escalation for an existing PagerDuty incident" }
        ]
    },
    {
        name: "jira",
        agent: "frootai-jira-expert",
        desc: "Jira project management — issue creation, sprint queries, board management, release tracking, AI-powered ticket triage and prioritization",
        tools: ["jira_issue_create", "jira_sprint_query", "jira_board_update", "jira_release_track"],
        plays: ["24", "32", "51"],
        mcp_tools: [
            { name: "jira_issue_create", desc: "Create a Jira issue with type, priority, labels, components, and custom fields" },
            { name: "jira_sprint_query", desc: "Query Jira sprint content — backlog, in-progress, done items with story points" },
            { name: "jira_board_update", desc: "Update a Jira board — move items between columns, update status" },
            { name: "jira_release_track", desc: "Track Jira release progress — issues resolved, remaining, blockers" }
        ]
    },
    {
        name: "slack",
        agent: "frootai-slack-expert",
        desc: "Slack integration — message sending, channel management, thread replies, user notifications, AI-powered conversation summarization and action extraction",
        tools: ["slack_message_send", "slack_channel_create", "slack_thread_reply", "slack_user_notify"],
        plays: ["all"],
        mcp_tools: [
            { name: "slack_message_send", desc: "Send a message to a Slack channel or user with rich formatting and attachments" },
            { name: "slack_channel_create", desc: "Create a Slack channel with topic, purpose, and initial members" },
            { name: "slack_thread_reply", desc: "Reply in a Slack thread with context-aware AI-generated response" },
            { name: "slack_user_notify", desc: "Send a direct notification to a Slack user with priority and action buttons" }
        ]
    },
    {
        name: "teams",
        agent: "frootai-teams-expert",
        desc: "Microsoft Teams integration — adaptive card sending, channel messages, meeting scheduling, AI-powered meeting summarization and action item extraction via Graph API",
        tools: ["teams_adaptive_card_send", "teams_channel_message", "teams_meeting_schedule", "teams_action_extract"],
        plays: ["08", "16", "39", "40"],
        mcp_tools: [
            { name: "teams_adaptive_card_send", desc: "Send an Adaptive Card to a Teams channel or chat with interactive elements" },
            { name: "teams_channel_message", desc: "Post a message to a Teams channel with formatting and @mentions" },
            { name: "teams_meeting_schedule", desc: "Schedule a Teams meeting with participants, agenda, and AI-generated briefing" }
        ]
    }
];

let agentsCreated = 0, pluginsCreated = 0;

for (const partner of partners) {
    // Create agent if not exists
    const agentPath = path.join("agents", `${partner.agent}.agent.md`);
    if (!fs.existsSync(agentPath)) {
        const agentContent = `---
description: "${partner.desc}"
tools: ${JSON.stringify(partner.tools)}
model: "gpt-4o"
waf: ["reliability", "security", "operational-excellence"]
plays: ${JSON.stringify(partner.plays)}
---

# ${partner.name.charAt(0).toUpperCase() + partner.name.slice(1)} Expert Agent

You are a FrootAI specialized agent for ${partner.name.charAt(0).toUpperCase() + partner.name.slice(1)} integration. ${partner.desc.split(" — ")[1] || partner.desc}

## Core Expertise
${partner.mcp_tools.map(t => `- **${t.name}**: ${t.desc}`).join("\n")}

## Integration Architecture

### Authentication
- Use OAuth 2.0 with client credentials for service-to-service auth
- Store client_id and client_secret in Azure Key Vault
- Token refresh handled automatically with retry on 401

### API Patterns
- All API calls use retry with exponential backoff (max 3 retries)
- Rate limiting: respect Retry-After headers, implement client-side throttling
- Pagination: handle cursor-based and offset-based pagination transparently
- Error handling: map ${partner.name} API errors to FrootAI ErrorCategory enum

### Data Mapping
- Map ${partner.name} entities to FrootAI play domain models
- Normalize timestamps to UTC ISO 8601 format
- Handle field-level encryption for sensitive data (PII, credentials)
- Validate all incoming data against Pydantic/Zod schemas

## Compatible Solution Plays
${partner.plays.map(p => `- Play ${p}`).join("\n")}

## Security
- All credentials stored in Azure Key Vault
- API calls over HTTPS only (TLS 1.2+)
- Audit logging for all ${partner.name} API interactions
- Data minimization: only fetch fields needed for the operation
- PII masking in logs (${partner.name} user IDs, email addresses)

## MCP Tool Definitions
${partner.mcp_tools.map(t => `### ${t.name}\n${t.desc}\n`).join("\n")}

## Error Handling
| Error | Cause | Resolution |
|-------|-------|-----------|
| 401 Unauthorized | Token expired | Refresh OAuth token via Key Vault |
| 403 Forbidden | Insufficient permissions | Verify API scopes and user roles |
| 404 Not Found | Resource deleted or wrong ID | Verify resource exists, check ID format |
| 429 Too Many Requests | Rate limit exceeded | Wait for Retry-After header value |
| 500 Internal Server Error | ${partner.name} outage | Circuit breaker → fallback → retry |

## Configuration
Store ${partner.name} integration config in the play's \`config/\` directory:
\`\`\`json
{
  "${partner.name}": {
    "base_url": "https://api.${partner.name === "teams" ? "graph.microsoft" : partner.name}.com",
    "api_version": "v2",
    "timeout_ms": 30000,
    "retry_max": 3,
    "rate_limit_per_minute": 60
  }
}
\`\`\`

## WAF Alignment
- **Reliability:** Circuit breaker on all API calls, retry with backoff, health checks
- **Security:** OAuth 2.0, Key Vault secrets, audit logging, TLS 1.2+
- **Operational Excellence:** Structured logging, error classification, incident runbooks
`;
        fs.writeFileSync(agentPath, agentContent);
        agentsCreated++;
    }

    // Create/update plugin config
    const pluginDir = path.join("community-plugins", partner.name);
    const pluginPath = path.join(pluginDir, "plugin.json");
    fs.mkdirSync(pluginDir, { recursive: true });

    if (!fs.existsSync(pluginPath) || JSON.parse(fs.readFileSync(pluginPath, "utf8")).version === "0.0.0") {
        const pluginConfig = {
            name: `frootai-${partner.name}-plugin`,
            description: `${partner.name.charAt(0).toUpperCase() + partner.name.slice(1)} integration plugin for FrootAI — ${partner.mcp_tools.length} MCP tools, dedicated agent, compatible plays`,
            version: "1.0.0",
            author: { name: "FrootAI", url: "https://frootai.dev" },
            license: "MIT",
            agent: partner.agent,
            tools: partner.mcp_tools.map(t => ({ name: t.name, description: t.desc })),
            compatible_plays: partner.plays,
            authentication: { type: "oauth2", token_url: `https://${partner.name === "teams" ? "login.microsoftonline.com" : `${partner.name}.com/oauth`}/token`, scopes: ["read", "write"] },
            configuration: {
                required: ["base_url", "client_id", "client_secret_key_vault_ref"],
                optional: ["timeout_ms", "retry_max", "rate_limit_per_minute"]
            }
        };
        fs.writeFileSync(pluginPath, JSON.stringify(pluginConfig, null, 2));
        pluginsCreated++;
    }
}

console.log(`Partner agents created: ${agentsCreated}`);
console.log(`Partner plugins created/updated: ${pluginsCreated}`);
console.log(`Total agents: ${fs.readdirSync("agents").filter(f => f.endsWith(".agent.md")).length}`);
