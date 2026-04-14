---
name: github-actions-ai-pipeline
description: "Create a GitHub Actions CI/CD pipeline with evaluation gates for AI apps"
---

# GitHub Actions CI/CD for AI Applications

## Workflow Architecture

Four-stage pipeline: **Build → Test → Evaluate → Deploy**. The evaluate stage gates deployment — if AI quality metrics regress below thresholds, the pipeline fails before reaching production.

## OIDC Authentication with Azure

Use federated credentials instead of storing service principal secrets. Create the identity once:

```yaml
# .github/workflows/ai-pipeline.yml
name: AI App CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  id-token: write   # OIDC token for Azure login
  contents: read
  packages: write    # Push to GHCR if needed

env:
  AZURE_CLIENT_ID: ${{ vars.AZURE_CLIENT_ID }}
  AZURE_TENANT_ID: ${{ vars.AZURE_TENANT_ID }}
  AZURE_SUBSCRIPTION_ID: ${{ vars.AZURE_SUBSCRIPTION_ID }}
  ACR_NAME: ${{ vars.ACR_NAME }}
  RESOURCE_GROUP: ${{ vars.RESOURCE_GROUP }}
```

## Stage 1 — Build & Docker Push to ACR

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: pip

      - name: Install dependencies
        run: pip install -r requirements.txt -r requirements-dev.txt

      - name: Lint & type check
        run: |
          ruff check app/
          pyright app/

      - name: Azure login (OIDC)
        uses: azure/login@v2
        with:
          client-id: ${{ env.AZURE_CLIENT_ID }}
          tenant-id: ${{ env.AZURE_TENANT_ID }}
          subscription-id: ${{ env.AZURE_SUBSCRIPTION_ID }}

      - name: ACR login
        run: az acr login --name ${{ env.ACR_NAME }}

      - name: Docker meta
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.ACR_NAME }}.azurecr.io/ai-app
          tags: |
            type=sha,prefix=
            type=ref,event=branch

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: ${{ github.event_name == 'push' }}
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## Stage 2 — Unit & Integration Tests

```yaml
  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: pip

      - run: pip install -r requirements.txt -r requirements-dev.txt

      - name: Unit tests
        run: pytest tests/unit/ -v --cov=app --cov-report=xml --junitxml=test-results.xml

      - name: Integration tests
        run: pytest tests/integration/ -v --junitxml=integration-results.xml
        env:
          AZURE_OPENAI_ENDPOINT: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
          AZURE_OPENAI_API_KEY: ${{ secrets.AZURE_OPENAI_API_KEY }}

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: |
            test-results.xml
            coverage.xml
```

## Stage 3 — AI Evaluation Gate

This is the critical gate. Runs the evaluation pipeline against a golden dataset, compares metrics to thresholds, and blocks deployment on regression.

```yaml
  evaluate:
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: pip

      - run: pip install -r requirements.txt -r requirements-eval.txt

      - name: Azure login (OIDC)
        uses: azure/login@v2
        with:
          client-id: ${{ env.AZURE_CLIENT_ID }}
          tenant-id: ${{ env.AZURE_TENANT_ID }}
          subscription-id: ${{ env.AZURE_SUBSCRIPTION_ID }}

      - name: Run evaluation pipeline
        run: |
          python -m evaluation.run \
            --dataset evaluation/golden-dataset.jsonl \
            --config config/openai.json \
            --output evaluation-results.json
        env:
          AZURE_OPENAI_ENDPOINT: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
          AZURE_OPENAI_API_KEY: ${{ secrets.AZURE_OPENAI_API_KEY }}

      - name: Check quality thresholds
        run: |
          python -c "
          import json, sys
          results = json.load(open('evaluation-results.json'))
          thresholds = {'groundedness': 4.0, 'relevance': 4.0, 'coherence': 4.0, 'fluency': 4.0}
          failed = []
          for metric, minimum in thresholds.items():
              score = results['metrics'].get(metric, 0)
              status = 'PASS' if score >= minimum else 'FAIL'
              print(f'{metric}: {score:.2f} (threshold: {minimum}) [{status}]')
              if score < minimum:
                  failed.append(f'{metric}={score:.2f}<{minimum}')
          if failed:
              print(f'::error::Evaluation gate FAILED: {", ".join(failed)}')
              sys.exit(1)
          print('All evaluation gates passed.')
          "

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: evaluation-results
          path: evaluation-results.json
```

## Stage 4 — Deploy with Approval Gate

```yaml
  deploy-staging:
    runs-on: ubuntu-latest
    needs: evaluate
    environment:
      name: staging
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - uses: actions/checkout@v4

      - name: Azure login (OIDC)
        uses: azure/login@v2
        with:
          client-id: ${{ env.AZURE_CLIENT_ID }}
          tenant-id: ${{ env.AZURE_TENANT_ID }}
          subscription-id: ${{ env.AZURE_SUBSCRIPTION_ID }}

      - name: Deploy infrastructure
        run: azd up --environment staging --no-prompt
        env:
          AZURE_ENV_NAME: staging
          AZD_INITIAL_ENVIRONMENT_CONFIG: ${{ secrets.AZD_CONFIG_STAGING }}

      - name: Deploy app to Container Apps
        id: deploy
        run: |
          az containerapp update \
            --name ai-app \
            --resource-group ${{ env.RESOURCE_GROUP }}-staging \
            --image ${{ env.ACR_NAME }}.azurecr.io/ai-app:${{ github.sha }} \
            --output none
          URL=$(az containerapp show --name ai-app \
            --resource-group ${{ env.RESOURCE_GROUP }}-staging \
            --query properties.configuration.ingress.fqdn -o tsv)
          echo "url=https://$URL" >> "$GITHUB_OUTPUT"

      - name: Smoke test
        run: |
          curl -sf "${{ steps.deploy.outputs.url }}/health" | jq .
          curl -sf "${{ steps.deploy.outputs.url }}/api/chat" \
            -X POST -H "Content-Type: application/json" \
            -d '{"message":"health check"}' | jq .status

  deploy-production:
    runs-on: ubuntu-latest
    needs: deploy-staging
    environment:
      name: production  # Requires manual approval in GitHub settings
    steps:
      - uses: actions/checkout@v4

      - name: Azure login (OIDC)
        uses: azure/login@v2
        with:
          client-id: ${{ env.AZURE_CLIENT_ID }}
          tenant-id: ${{ env.AZURE_TENANT_ID }}
          subscription-id: ${{ env.AZURE_SUBSCRIPTION_ID }}

      - name: Deploy to production
        run: |
          az containerapp update \
            --name ai-app \
            --resource-group ${{ env.RESOURCE_GROUP }}-prod \
            --image ${{ env.ACR_NAME }}.azurecr.io/ai-app:${{ github.sha }} \
            --output none
```

## Environment Protection Rules

Configure in GitHub repo **Settings → Environments**:

| Environment | Protection Rules |
|-------------|-----------------|
| `staging` | Required reviewers: none. Wait timer: 0. Deployment branches: `main` only |
| `production` | Required reviewers: 2 approvers. Wait timer: 15 min. Deployment branches: `main` only |

## Secrets Management

Store secrets in GitHub Environments, not repository-level:

| Secret/Variable | Scope | Purpose |
|-----------------|-------|---------|
| `AZURE_CLIENT_ID` | Repository variable | OIDC app registration client ID |
| `AZURE_TENANT_ID` | Repository variable | Entra ID tenant |
| `AZURE_SUBSCRIPTION_ID` | Repository variable | Target subscription |
| `ACR_NAME` | Repository variable | Container registry name |
| `AZURE_OPENAI_ENDPOINT` | Environment secret | Per-environment AOAI endpoint |
| `AZURE_OPENAI_API_KEY` | Environment secret | Per-environment AOAI key (prefer Managed Identity in prod) |

## Failure Notifications

```yaml
  notify:
    runs-on: ubuntu-latest
    needs: [build, test, evaluate, deploy-staging, deploy-production]
    if: failure()
    steps:
      - uses: slackapi/slack-github-action@v2
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK }}
          webhook-type: incoming-webhook
          payload: |
            {
              "text": "AI Pipeline FAILED: ${{ github.repository }}@${{ github.sha }}\nRun: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}\nBranch: ${{ github.ref_name }}\nTriggered by: ${{ github.actor }}"
            }
```

## Key Practices

- **OIDC over secrets** — federated credentials rotate automatically, no secret expiry incidents
- **Evaluation as gate** — never deploy without passing quality thresholds against a golden dataset
- **GHA cache** — `cache-from: type=gha` cuts Docker builds from 8min to 90s on cache hit
- **Environment isolation** — staging and production use separate Azure resource groups, AOAI endpoints, and secrets
- **Immutable tags** — image tagged by commit SHA ensures exact reproducibility
