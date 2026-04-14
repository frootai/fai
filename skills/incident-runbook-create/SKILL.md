---
name: "incident-runbook-create"
description: "Create an incident response runbook for AI system failures"
---

# Incident Runbook Creation for AI Services

## Runbook Template Structure

Every AI incident runbook follows this structure. Store runbooks in `runbooks/` as markdown files with machine-parseable headers.

```markdown
# RB-{ID}: {Title}
- **Severity**: P1|P2|P3|P4
- **Services**: Azure OpenAI, AI Search, etc.
- **Last tested**: YYYY-MM-DD
- **Owner**: team-ai-platform

## Symptom
What the operator sees — alert text, dashboard anomaly, user report.

## Diagnosis
Step-by-step commands to confirm root cause.

## Resolution
Ordered actions to restore service. Include rollback steps.

## Escalation
Who to contact if resolution fails, with SLA timers.

## Post-Resolution
Verification steps and monitoring duration.
```

## Severity Classification

| Level | Response | Example AI Incidents |
|-------|----------|---------------------|
| **P1** | 15min ack, all-hands | Total model endpoint down, data leak via prompt injection |
| **P2** | 30min ack, on-call | 429 rate limiting >50% requests, RAG returning hallucinated content |
| **P3** | 4hr ack, business hours | Embedding pipeline backlog >1hr, content safety false positives >10% |
| **P4** | Next business day | Token cost spike <2x baseline, minor latency increase |

## Common AI Incidents Quick Reference

| Incident | First Check | Typical Cause |
|----------|------------|---------------|
| High latency (>5s P95) | `az monitor metrics list --resource $AOAI_ID --metric Latency` | Token-heavy prompts, region overload |
| Model 429 errors | Check TPM usage vs quota in Azure Portal | Burst traffic, insufficient PTU |
| Content safety blocks | Review `ContentFilterResults` in response | Overly strict filter config, input drift |
| Token budget exceeded | Sum `prompt_tokens + completion_tokens` from logs | Missing max_tokens cap, runaway chains |
| Embedding failures | Check Document Intelligence / chunking logs | Corrupt documents, encoding issues |
| RAG quality drop | Compare groundedness scores vs baseline | Index staleness, schema drift, re-ranker misconfigured |

## Runbook: Azure OpenAI 429 Rate Limiting (P2)

### Symptom
Alert: `aoai_429_rate > 5%` over 5 minutes. Users see "Service temporarily unavailable."

### Diagnosis
```bash
# Check current TPM usage vs quota
az cognitiveservices usage list \
  --name $AOAI_ACCOUNT --resource-group $RG \
  --query "[?name.value=='OpenAI.Standard.gpt-4o'].{used:currentValue,limit:limit}" -o table

# Query recent 429s from Log Analytics
az monitor log-analytics query -w $LAW_ID --analytics-query "
AzureDiagnostics
| where ResourceProvider == 'MICROSOFT.COGNITIVESERVICES'
| where resultSignature_d == 429
| summarize count() by bin(TimeGenerated, 1m), modelDeploymentName_s
| order by TimeGenerated desc
" -o table

# Check retry-after headers in app logs
az monitor log-analytics query -w $LAW_ID --analytics-query "
AppTraces | where message contains 'Retry-After'
| project TimeGenerated, message | take 20
" -o table
```

### Resolution
```bash
# Step 1: Enable fallback to secondary region (immediate)
az apim api operation update --resource-group $RG --service-name $APIM \
  --api-id ai-gateway --operation-id chat \
  --set properties.policies="<retry condition='@(context.Response.StatusCode == 429)' count='3'><forward-request backend-id='aoai-secondary' /></retry>"

# Step 2: Increase deployment capacity if within quota
az cognitiveservices account deployment update \
  --name $AOAI_ACCOUNT -g $RG --deployment-name gpt-4o-main \
  --capacity 80 --sku-name Standard

# Step 3: If PTU, request quota increase
az support tickets create --ticket-name "PTU-increase-$(date +%Y%m%d)" \
  --severity moderate --title "PTU quota increase for $AOAI_ACCOUNT" \
  --contact-first-name Ops --contact-last-name Team \
  --contact-method email --contact-email ai-ops@company.com
```

### Escalation
If 429 rate stays >20% after 15 minutes: page Azure Support (Sev B) and notify `#ai-platform-incidents` Slack channel.

## Runbook: RAG Quality Degradation (P2)

### Symptom
Alert: `rag_groundedness_score < 3.5` rolling 1-hour average (baseline: 4.2+). Users report irrelevant or fabricated answers.

### Diagnosis
```bash
# Check index freshness — when was last document indexed?
az search indexer status show --name doc-indexer \
  --service-name $SEARCH_SERVICE -g $RG \
  --query "lastResult.{status:status,end:endTime,docsProcessed:itemsProcessed,errors:errors}" -o table

# Compare current vs baseline groundedness from evaluation logs
az monitor log-analytics query -w $LAW_ID --analytics-query "
customMetrics
| where name == 'rag_groundedness'
| summarize avg(value) by bin(TimeGenerated, 1h)
| order by TimeGenerated desc | take 24
" -o table

# Check if search index schema drifted
az search index show --name main-index --service-name $SEARCH_SERVICE -g $RG \
  --query "fields[].{name:name,type:type,searchable:searchable}" -o table

# Verify embedding model version hasn't changed
az cognitiveservices account deployment show \
  --name $AOAI_ACCOUNT -g $RG --deployment-name text-embedding-3-large \
  --query "{model:properties.model.name,version:properties.model.version}" -o json
```

### Resolution
1. **Index stale** → Force reindex: `az search indexer run --name doc-indexer --service-name $SEARCH_SERVICE -g $RG`
2. **Schema drift** → Revert index definition from IaC: `az search index create --service-name $SEARCH_SERVICE -g $RG --index @infra/search-index.json`
3. **Embedding model changed** → Reindex all documents with consistent model version
4. **Prompt drift** → Rollback system prompt to last known-good version in `config/openai.json`

### Escalation
If groundedness stays below 3.5 after reindex + prompt rollback: engage ML team for evaluation pipeline review.

## PagerDuty / Slack Alert Integration

Create alert rules that fire to PagerDuty for P1/P2 and Slack for P3/P4:

```bash
# PagerDuty webhook for P1/P2 AI incidents
az monitor action-group create -g $RG -n ai-pagerduty \
  --action webhook pagerduty "https://events.pagerduty.com/integration/$PD_INTEGRATION_KEY/enqueue" \
  useCommonAlertSchema=true

# Slack webhook for P3/P4 AI incidents
az monitor action-group create -g $RG -n ai-slack \
  --action webhook slack "$SLACK_WEBHOOK_URL" \
  useCommonAlertSchema=true

# Alert rule: 429 rate > 5% → PagerDuty
az monitor metrics alert create -g $RG -n aoai-429-alert \
  --scopes $AOAI_ID --condition "total ClientErrors > 50 where StatusCode includes 429" \
  --window-size 5m --evaluation-frequency 1m \
  --action ai-pagerduty --severity 2 --description "AOAI 429 rate exceeded threshold"

# Alert rule: Groundedness drop → PagerDuty
az monitor scheduled-query create -g $RG -n rag-quality-alert \
  --scopes $LAW_ID --condition-query "
customMetrics | where name == 'rag_groundedness'
| summarize avg_score=avg(value) by bin(TimeGenerated, 15m)
| where avg_score < 3.5" \
  --condition "count > 0" --action-groups $PD_GROUP_ID --severity 2
```

## Post-Incident Review Template

```markdown
# PIR-{YYYY-MM-DD}: {Incident Title}

## Timeline
| Time (UTC) | Event |
|------------|-------|
| HH:MM | Alert fired: {alert name} |
| HH:MM | Acknowledged by {responder} |
| HH:MM | Root cause identified: {cause} |
| HH:MM | Mitigation applied |
| HH:MM | Service restored, monitoring |

## Impact
- **Duration**: X minutes
- **Users affected**: N
- **Requests failed**: N (X% of total)
- **Financial impact**: $X (failed requests + remediation cost)

## Root Cause
One paragraph explaining the technical root cause.

## Action Items
| Item | Owner | Deadline | Status |
|------|-------|----------|--------|
| Add circuit breaker to model calls | @engineer | YYYY-MM-DD | Open |
| Increase PTU capacity by 20% | @platform | YYYY-MM-DD | Open |
| Add runbook for this failure mode | @sre | YYYY-MM-DD | Open |
```

## Automated Remediation Script

Deploy as an Azure Function triggered by alert webhooks:

```bash
#!/usr/bin/env bash
# auto-remediate-429.sh — triggered by Azure Monitor action group
set -euo pipefail

AOAI_ACCOUNT="${1:?Usage: $0 <account> <rg> <deployment>}"
RG="${2:?}"
DEPLOYMENT="${3:?}"

current=$(az cognitiveservices account deployment show \
  --name "$AOAI_ACCOUNT" -g "$RG" --deployment-name "$DEPLOYMENT" \
  --query "properties.rateLimits[0].count" -o tsv)

new_capacity=$((current + 20))
max_capacity=200

if [ "$new_capacity" -le "$max_capacity" ]; then
  az cognitiveservices account deployment update \
    --name "$AOAI_ACCOUNT" -g "$RG" --deployment-name "$DEPLOYMENT" \
    --capacity "$new_capacity"
  echo "Scaled $DEPLOYMENT from $current to $new_capacity TPM"
else
  echo "ESCALATE: $DEPLOYMENT at max capacity ($current TPM), manual intervention required"
  # Post to Slack escalation channel
  curl -s -X POST "$SLACK_ESCALATION_URL" \
    -H 'Content-Type: application/json' \
    -d "{\"text\":\"P1 ESCALATION: $DEPLOYMENT at max capacity ($current TPM). Manual intervention required.\"}"
  exit 1
fi
```

## Runbook Testing Schedule

| Runbook | Test Frequency | Method | Last Tested |
|---------|---------------|--------|-------------|
| AOAI 429 Rate Limiting | Monthly | Inject synthetic 429s via APIM policy | — |
| RAG Quality Degradation | Bi-weekly | Run evaluation suite, compare baselines | — |
| Content Safety False Positives | Monthly | Submit known-safe corpus, measure block rate | — |
| Embedding Pipeline Failure | Quarterly | Kill indexer mid-run, verify recovery | — |
| Model Endpoint Down | Quarterly | Disable primary AOAI endpoint, verify failover | — |

Test procedure:
1. Schedule in `#ai-platform` Slack channel 48 hours ahead
2. Run test in staging environment first, then production with feature flag
3. Capture time-to-detect, time-to-acknowledge, time-to-resolve
4. Update runbook with findings and adjust thresholds
5. Record results in `runbooks/test-log.md`
