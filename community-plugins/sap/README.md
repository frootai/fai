# sap-ai-gateway

> SAP integration — AI gateway for S/4HANA, BTP, document processing, supply chain optimization.

## Overview

This community plugin integrates **SAP** with the FAI ecosystem, providing an AI gateway for S/4HANA and Business Technology Platform (BTP). It includes a dedicated agent and instructions for document processing, supply chain optimization, procurement intelligence, and SAP AI Core integration.

## Installation

```bash
npx FAI install community/sap
```

## What's Included

| Type | Primitive | Purpose |
|------|-----------|---------|
| Agent | FAI SAP Expert | S/4HANA navigation, BTP integration, CAP model guidance |
| Instruction | SAP Integration | Best practices for OData, CDS views, BAPI wrappers, AI Core |
| Workflow | SAP Sync | Automated data synchronization with SAP systems |

## Key Capabilities

- **Document Processing** — Invoice extraction, PO matching, goods receipt automation
- **Supply Chain Optimization** — Demand forecasting, inventory optimization, supplier risk
- **Procurement Intelligence** — Contract analysis, spend categorization, vendor scoring
- **SAP AI Core** — Model deployment, inference pipelines, MLOps on BTP

## Configuration

Set the following environment variables or store them in Azure Key Vault:

- `SAP_BASE_URL` — Your SAP system URL (e.g., `https://myhost.s4hana.cloud.sap`)
- `SAP_CLIENT_ID` — OAuth2 client ID for BTP or S/4HANA API access
- `SAP_CLIENT_SECRET` — OAuth2 client secret (use Key Vault reference in production)

## Usage Example

```
@fai-sap-expert Analyze our top 20 suppliers by on-time delivery rate
and flag any with deteriorating performance trends.
```

The agent connects to S/4HANA via OData, aggregates delivery data, and applies AI-driven trend analysis.

## Compatible Solution Plays

- **Play 14 — Cost-Optimized AI Gateway**: SAP as a backend behind the AI gateway pattern

## Dependencies

- `FAI-mcp` — FAI MCP Server for tool execution

## Keywords

`sap` `erp` `s4hana` `btp` `supply-chain` `procurement` `enterprise` `integration`

## Links

- [SAP API Business Hub](https://api.sap.com/)
- [FAI Community Plugins](https://FAI.dev/primitives/plugins)
- [Play 14 — Cost-Optimized AI Gateway](https://FAI.dev/solution-plays/14)

## License

MIT — FAI Community
