---
name: "feature-flag-ai"
description: "Implement feature flags for AI capabilities with gradual rollout"
---

# Feature Flag AI — Model Rollout with Azure App Configuration

## Architecture

Azure App Configuration feature flags control which AI model serves each request. Flags carry targeting rules — percentage splits, tenant allow-lists, and kill switches — so you can roll out `gpt-4o-2024-08-06` to 5% of traffic, measure quality, then widen or revert without redeployment.

```
Request → App Configuration SDK → evaluate flag → route to model deployment
                                      ↓
                              Azure Monitor ← quality metrics per variant
```

## config/feature-flags.json

Store model rollout state alongside your TuneKit config. This file is the local source of truth; `az appconfig kv import` pushes it to Azure.

```json
{
  "feature_flags": {
    "model_gpt4o_august": {
      "enabled": true,
      "description": "GPT-4o August 2024 checkpoint rollout",
      "rollout_stage": "beta",
      "conditions": {
        "percentage_filter": { "value": 25 },
        "targeting_filter": {
          "audience": {
            "users": ["tenant-acme", "tenant-contoso"],
            "groups": [
              { "name": "beta-testers", "rollout_percentage": 100 },
              { "name": "enterprise", "rollout_percentage": 10 }
            ],
            "default_rollout_percentage": 0
          }
        }
      },
      "variants": {
        "control": "gpt-4o-2024-05-13",
        "treatment": "gpt-4o-2024-08-06"
      }
    },
    "model_kill_switch": {
      "enabled": false,
      "description": "Emergency revert — forces all traffic to stable model",
      "fallback_model": "gpt-4o-2024-05-13"
    }
  }
}
```

## Python SDK Integration

```python
# feature_flags.py — Azure App Configuration feature flag client
import hashlib
from azure.identity import DefaultAzureCredential
from azure.appconfiguration.provider import load
from azure.appconfiguration import FeatureFlagConfigurationSetting

class AIFeatureFlags:
    """Evaluate feature flags for AI model routing."""

    def __init__(self, endpoint: str):
        credential = DefaultAzureCredential()
        self.config = load(
            endpoint=endpoint,
            credential=credential,
            feature_flag_enabled=True,
            feature_flag_refresh_enabled=True,
            refresh_interval=30,  # seconds — fast enough for kill switch
        )

    def get_model_deployment(self, tenant_id: str, user_id: str) -> str:
        """Return the model deployment name for this request context."""
        # Kill switch takes absolute priority
        if self.config["feature_management"]["feature_flags"].get(
            "model_kill_switch", {}
        ).get("enabled"):
            return "gpt-4o-2024-05-13"

        flag = self.config["feature_management"]["feature_flags"].get(
            "model_gpt4o_august", {}
        )
        if not flag.get("enabled"):
            return "gpt-4o-2024-05-13"

        # Deterministic bucket from tenant+user hash for sticky assignment
        bucket = int(hashlib.sha256(
            f"{tenant_id}:{user_id}".encode()
        ).hexdigest(), 16) % 100

        targeting = flag.get("conditions", {}).get("targeting_filter", {})
        audience = targeting.get("audience", {})

        # Explicit user override
        if tenant_id in audience.get("users", []):
            return flag["variants"]["treatment"]

        # Group-based rollout
        for group in audience.get("groups", []):
            if self._in_group(tenant_id, group["name"]):
                if bucket < group["rollout_percentage"]:
                    return flag["variants"]["treatment"]
                return flag["variants"]["control"]

        # Default percentage rollout
        pct = flag["conditions"].get("percentage_filter", {}).get("value", 0)
        if bucket < pct:
            return flag["variants"]["treatment"]

        return flag["variants"]["control"]

    def _in_group(self, tenant_id: str, group_name: str) -> bool:
        """Check tenant membership. Replace with your tenant registry."""
        # In production, query your tenant metadata store
        group_map = {
            "beta-testers": ["tenant-acme", "tenant-contoso"],
            "enterprise": ["tenant-megacorp", "tenant-bigbank"],
        }
        return tenant_id in group_map.get(group_name, [])
```

## A/B Model Selection in Request Pipeline

```python
# model_router.py — plug into your LLM call layer
from openai import AzureOpenAI
from feature_flags import AIFeatureFlags
from azure.monitor.opentelemetry import configure_azure_monitor

configure_azure_monitor()

flags = AIFeatureFlags(endpoint="https://fai-appconfig.azconfig.io")
client = AzureOpenAI()

def chat_completion(messages: list, tenant_id: str, user_id: str) -> dict:
    model = flags.get_model_deployment(tenant_id, user_id)

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.3,
    )

    # Emit custom metric for quality comparison per variant
    from opentelemetry import metrics
    meter = metrics.get_meter("fai.model_routing")
    variant_counter = meter.create_counter("model_variant_requests")
    variant_counter.add(1, {"model": model, "tenant": tenant_id})

    return {"model_used": model, "response": response.choices[0].message.content}
```

## Gradual Rollout Stages

| Stage | `percentage_filter` | `targeting_filter` | Duration | Gate Criteria |
|-------|--------------------|--------------------|----------|---------------|
| **Canary** | 0% | 2-3 internal tenants only | 3-5 days | No regressions in groundedness (≥4.0) |
| **Beta** | 10-25% | Beta group + opted-in tenants | 1-2 weeks | Latency p95 ≤ baseline × 1.1, coherence ≥4.2 |
| **GA** | 100% | All tenants | Permanent | Cost delta < 15%, safety scores hold |

Advance stages by updating `config/feature-flags.json` and syncing:

```bash
az appconfig kv import \
  --name fai-appconfig \
  --source file \
  --path config/feature-flags.json \
  --format json \
  --yes
```

## Kill Switch Activation

When a model produces unsafe outputs or latency degrades:

```python
from azure.appconfiguration import AzureAppConfigurationClient
from azure.identity import DefaultAzureCredential

client = AzureAppConfigurationClient(
    "https://fai-appconfig.azconfig.io",
    DefaultAzureCredential()
)

# Activate kill switch — all traffic reverts to stable model immediately
kill_flag = client.get_configuration_setting(key=".appconfig.featureflag/model_kill_switch")
kill_flag.value = kill_flag.value.replace('"enabled":false', '"enabled":true')
client.set_configuration_setting(kill_flag)
```

Pair with an Azure Monitor alert rule that auto-triggers the kill switch when groundedness drops below 3.5 or content safety flags exceed 2% of requests.

## Monitoring Flag Impact on Quality

Track per-variant metrics in Application Insights using custom dimensions:

```kql
// KQL — compare quality scores between model variants
customMetrics
| where name == "groundedness_score"
| extend model = tostring(customDimensions["model"])
| summarize avg_score=avg(value), p50=percentile(value, 50),
            p5=percentile(value, 5), request_count=count()
  by model, bin(timestamp, 1h)
| order by timestamp desc
```

Set alert thresholds: if treatment variant's avg groundedness drops >0.3 below control for 30 minutes, fire the kill switch webhook.

## LaunchDarkly Alternative

If you use LaunchDarkly instead of Azure App Configuration:

```python
import ldclient
from ldclient.config import Config
from ldclient import Context

ldclient.set_config(Config("sdk-key-from-env"))
ld_client = ldclient.get()

def get_model_ld(tenant_id: str, user_id: str) -> str:
    context = Context.builder(user_id).set("tenant", tenant_id).build()
    variant = ld_client.variation("model-gpt4o-august", context, default="control")
    return {
        "control": "gpt-4o-2024-05-13",
        "treatment": "gpt-4o-2024-08-06",
    }.get(variant, "gpt-4o-2024-05-13")
```

The same `config/feature-flags.json` structure works — export it to LaunchDarkly via their import API. The flag evaluation semantics (percentage hash, targeting, kill switch) remain identical.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Flag changes not reflected | Check `refresh_interval` — default is 30s. Call `config.refresh()` manually for instant pickup |
| Sticky assignment drift | Ensure hash input (`tenant:user`) is stable; don't include session IDs |
| Kill switch delay | Use App Config events + Event Grid for push-based invalidation instead of polling |
| A/B metrics skewed | Verify bucket distribution is uniform; check for tenant-size bias in group rollout |

## Related

- [Azure App Configuration Feature Flags](https://learn.microsoft.com/azure/azure-app-configuration/concept-feature-management)
- [Python App Configuration Provider](https://learn.microsoft.com/python/api/overview/azure/appconfiguration-readme)
- [LaunchDarkly Python SDK](https://docs.launchdarkly.com/sdk/server-side/python)
