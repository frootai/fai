---
description: "AI Landing Zone Advanced domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# AI Landing Zone Advanced — Domain Knowledge

This workspace implements an advanced AI landing zone — multi-region, hub-spoke with multiple spokes, Azure Policy governance, Defender for Cloud, and enterprise-scale management group hierarchy.

## Advanced Landing Zone Architecture (What the Model Gets Wrong)

### Enterprise-Scale Management Group Hierarchy
```
Tenant Root Group
├── Platform
│   ├── Management (Log Analytics, Automation)
│   ├── Connectivity (Hub VNets, ExpressRoute, DNS)
│   └── Identity (Azure AD DS, Conditional Access)
└── Landing Zones
    ├── Corp (internal workloads, private endpoints)
    │   ├── AI-Prod (production AI services)
    │   └── AI-NonProd (dev/test AI services)
    └── Online (internet-facing, App Gateway + WAF)
```

### Multi-Region with Traffic Manager
```bicep
// WRONG — single region (no DR)
param location string = 'eastus2'

// CORRECT — multi-region with paired regions
param primaryLocation string = 'eastus2'
param secondaryLocation string = 'centralus'  // Paired region for DR
// Deploy all critical resources in both regions
// Use Traffic Manager or Front Door for routing
```

### Azure Policy for Governance
| Policy | Effect | Purpose |
|--------|--------|---------|
| Deny public endpoints | Deny | All AI services must use PE |
| Require encryption | Audit | Storage + DB encryption at rest |
| Allowed SKUs | Deny | Prevent over-provisioned VMs |
| Require tags | Deny | Cost center, environment, owner |
| Require diagnostics | DeployIfNotExists | Auto-enable logging |
| Deny IP forwarding | Deny | Network security |

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Single management group | No isolation between prod/dev | Use hierarchy: Platform + Landing Zones |
| No Azure Policy | Resources deployed without governance | Assign policies at MG level |
| Manual DNS zones | Private endpoint DNS breaks | Use Azure Private DNS Zones + auto-registration |
| No Defender for Cloud | Threats undetected | Enable Defender for all resource types |
| ExpressRoute without backup | Single point of failure | Add VPN as backup path |
| No resource locks | Accidental deletion of prod | Lock-level: CanNotDelete on production RGs |
| Hub VNet too small | IP exhaustion | Plan /16 for hub, /16 per spoke |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | AI model configuration per region |
| `config/guardrails.json` | Policy compliance thresholds |
| `config/landing-zone.json` | Network ranges, regions, SKU limits |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement multi-region Bicep, MG hierarchy, Policy assignments |
| `@reviewer` | Audit governance, compliance, network isolation, Defender config |
| `@tuner` | Optimize SKUs, regions, policy effects, cost across environments |

## Slash Commands
`/deploy` — Deploy landing zone | `/test` — Run compliance tests | `/review` — Governance audit | `/evaluate` — Evaluate compliance score
