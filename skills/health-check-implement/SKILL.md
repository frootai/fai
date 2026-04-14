---
name: "health-check-implement"
description: "Implement comprehensive health check endpoints for all AI service dependencies"
---

# Health Check Implementation for AI Services

Three probe types serve distinct orchestration purposes: **liveness** (`/health`) confirms the process is alive, **readiness** (`/ready`) confirms all dependencies accept traffic, **startup** (`/startup`) gates initial boot before liveness kicks in.

## Response Schema

Every probe returns this shape. Load balancers key on `status`; dashboards consume `dependencies[]`.

```json
{
  "status": "healthy | degraded | unhealthy",
  "version": "1.4.2",
  "uptime_seconds": 84312,
  "dependencies": [
    { "name": "azure_openai", "status": "healthy", "latency_ms": 42 },
    { "name": "ai_search", "status": "healthy", "latency_ms": 18 },
    { "name": "cosmos_db", "status": "degraded", "latency_ms": 310 },
    { "name": "redis", "status": "healthy", "latency_ms": 2 }
  ]
}
```

**Status logic:** `healthy` = all deps healthy. `degraded` = at least one dep degraded or optional dep unhealthy. `unhealthy` = any required dep unhealthy → readiness returns 503.

## Config-Driven Dependency List

Define checked dependencies in `config/health.json`. The checker only probes what's listed — no code changes when adding a new dependency.

```json
{
  "dependencies": [
    { "name": "azure_openai", "type": "azure_openai", "required": true, "timeout_ms": 3000,
      "endpoint_env": "AZURE_OPENAI_ENDPOINT" },
    { "name": "ai_search", "type": "ai_search", "required": true, "timeout_ms": 2000,
      "endpoint_env": "AZURE_SEARCH_ENDPOINT" },
    { "name": "cosmos_db", "type": "cosmos_db", "required": true, "timeout_ms": 3000,
      "endpoint_env": "COSMOS_ENDPOINT", "database_env": "COSMOS_DATABASE" },
    { "name": "redis", "type": "redis", "required": false, "timeout_ms": 1000,
      "url_env": "REDIS_URL" }
  ]
}
```

## Python FastAPI Implementation

```python
import os, time, json, asyncio, logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Response
from azure.identity.aio import DefaultAzureCredential
from openai import AsyncAzureOpenAI
from azure.search.documents.aio import SearchClient
from azure.cosmos.aio import CosmosClient
import redis.asyncio as aioredis

logger = logging.getLogger("healthcheck")
APP_VERSION = os.getenv("APP_VERSION", "0.0.0")
_start_time = time.monotonic()
_startup_complete = False

# --- dependency checkers ---------------------------------------------------

async def _check_azure_openai(cfg: dict) -> dict:
    endpoint = os.environ[cfg["endpoint_env"]]
    cred = DefaultAzureCredential()
    client = AsyncAzureOpenAI(azure_endpoint=endpoint, azure_ad_token_provider=cred)
    t0 = time.monotonic()
    await client.models.list()              # lightweight call, no tokens consumed
    return {"name": cfg["name"], "status": "healthy",
            "latency_ms": round((time.monotonic() - t0) * 1000)}

async def _check_ai_search(cfg: dict) -> dict:
    endpoint = os.environ[cfg["endpoint_env"]]
    cred = DefaultAzureCredential()
    client = SearchClient(endpoint, "health-probe-index", cred)
    t0 = time.monotonic()
    await client.get_document_count()       # zero-cost metadata call
    return {"name": cfg["name"], "status": "healthy",
            "latency_ms": round((time.monotonic() - t0) * 1000)}

async def _check_cosmos_db(cfg: dict) -> dict:
    endpoint = os.environ[cfg["endpoint_env"]]
    cred = DefaultAzureCredential()
    client = CosmosClient(endpoint, credential=cred)
    t0 = time.monotonic()
    db = client.get_database_client(os.environ[cfg["database_env"]])
    await db.read()                         # metadata read, 1 RU
    return {"name": cfg["name"], "status": "healthy",
            "latency_ms": round((time.monotonic() - t0) * 1000)}

async def _check_redis(cfg: dict) -> dict:
    url = os.environ.get(cfg["url_env"], "")
    if not url:
        return {"name": cfg["name"], "status": "degraded", "latency_ms": 0}
    r = aioredis.from_url(url, socket_connect_timeout=cfg["timeout_ms"] / 1000)
    t0 = time.monotonic()
    await r.ping()
    return {"name": cfg["name"], "status": "healthy",
            "latency_ms": round((time.monotonic() - t0) * 1000)}

CHECKERS = {
    "azure_openai": _check_azure_openai,
    "ai_search":    _check_ai_search,
    "cosmos_db":    _check_cosmos_db,
    "redis":        _check_redis,
}

# --- probe logic -----------------------------------------------------------

async def _run_checks(deps: list[dict]) -> tuple[str, list[dict]]:
    results = []
    for dep in deps:
        checker = CHECKERS.get(dep["type"])
        if not checker:
            results.append({"name": dep["name"], "status": "unhealthy", "latency_ms": 0})
            continue
        try:
            result = await asyncio.wait_for(
                checker(dep), timeout=dep["timeout_ms"] / 1000
            )
            results.append(result)
        except asyncio.TimeoutError:
            results.append({"name": dep["name"], "status": "unhealthy", "latency_ms": dep["timeout_ms"]})
        except Exception as exc:
            logger.warning("Health check failed for %s: %s", dep["name"], exc)
            results.append({"name": dep["name"], "status": "unhealthy", "latency_ms": 0})

    required_unhealthy = any(
        r["status"] == "unhealthy" and d.get("required", True)
        for r, d in zip(results, deps)
    )
    any_degraded = any(r["status"] != "healthy" for r in results)
    status = "unhealthy" if required_unhealthy else ("degraded" if any_degraded else "healthy")
    return status, results

def _load_deps() -> list[dict]:
    cfg_path = os.path.join(os.path.dirname(__file__), "config", "health.json")
    with open(cfg_path) as f:
        return json.load(f)["dependencies"]

# --- FastAPI routes --------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _startup_complete
    deps = _load_deps()
    status, _ = await _run_checks(deps)
    _startup_complete = status != "unhealthy"
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/health")              # liveness — is the process alive?
async def liveness():
    return Response(
        content=json.dumps({"status": "healthy", "version": APP_VERSION}),
        media_type="application/json",
    )

@app.get("/ready")               # readiness — can we accept traffic?
async def readiness(response: Response):
    deps = _load_deps()
    status, results = await _run_checks(deps)
    body = {
        "status": status, "version": APP_VERSION,
        "uptime_seconds": round(time.monotonic() - _start_time),
        "dependencies": results,
    }
    if status == "unhealthy":
        response.status_code = 503
    return body

@app.get("/startup")             # startup — has initial boot completed?
async def startup(response: Response):
    if not _startup_complete:
        response.status_code = 503
    return {"status": "healthy" if _startup_complete else "unhealthy"}
```

## Kubernetes Probe Configuration

```yaml
# deployment.yaml — probe section
containers:
  - name: ai-service
    livenessProbe:
      httpGet:
        path: /health
        port: 8000
      initialDelaySeconds: 5
      periodSeconds: 10
      failureThreshold: 3          # restart after 30s of failures
    readinessProbe:
      httpGet:
        path: /ready
        port: 8000
      periodSeconds: 15
      failureThreshold: 2          # pull from LB after 30s
      successThreshold: 1
    startupProbe:
      httpGet:
        path: /startup
        port: 8000
      periodSeconds: 5
      failureThreshold: 30         # allow up to 150s for cold start + model load
```

## Azure App Service Health Check

Enable WEBSITE_HEALTHCHECK_MAXPINGFAILURES in App Settings and set the health check path in the portal or Bicep:

```bicep
resource appService 'Microsoft.Web/sites@2023-12-01' = {
  properties: {
    siteConfig: {
      healthCheckPath: '/ready'    // App Service pings every 30s
      appSettings: [
        { name: 'WEBSITE_HEALTHCHECK_MAXPINGFAILURES', value: '3' }
      ]
    }
  }
}
```

App Service removes the instance from load balancer rotation after 3 consecutive failures (90s). Paired with the `/ready` endpoint, this means traffic stops flowing only when a required dependency (Azure OpenAI, AI Search, Cosmos DB) is confirmed unreachable.

## Load Balancer Integration

- **Azure Front Door / Application Gateway:** Set the health probe to `GET /ready` with a 200-range expected response. 503 triggers automatic removal from the backend pool.
- **Internal traffic managers:** Use `/health` for keep-alive (fast, no I/O); use `/ready` for traffic decisions.
- **Separate probe intervals:** Liveness every 10s (cheap), readiness every 15-30s (hits deps — budget for RU/token cost).

## Monitoring Health Check Failures

Wire the readiness probe results into Azure Monitor so alerts fire before users notice:

```python
# In your readiness handler, after _run_checks():
from opencensus.ext.azure import metrics_exporter  # or opentelemetry equivalent

for dep in results:
    if dep["status"] != "healthy":
        logger.error("Dependency %s is %s (latency=%dms)",
                      dep["name"], dep["status"], dep["latency_ms"])
        # Custom metric → Azure Monitor alert rule triggers
        tracer.add_attribute_to_current_span(f"dep.{dep['name']}.status", dep["status"])
```

Create an Azure Monitor alert rule on the custom metric with a 2-of-3 evaluation window. Route to an Action Group that pages the on-call engineer. For Kubernetes, expose readiness failures as a Prometheus metric and configure an AlertManager rule with the same 2-of-3 logic.

## Degraded State Handling

Degraded means the service still works but at reduced capability — e.g., Redis is down so the cache layer is bypassed, or a secondary search index is unreachable. The readiness probe returns 200 for degraded (traffic keeps flowing) but the response body flags the degraded deps. Downstream clients and load balancers treat 200 as healthy; observability picks up the degraded field and alerts the team. This avoids cascading restarts when an optional dependency has a transient failure.
