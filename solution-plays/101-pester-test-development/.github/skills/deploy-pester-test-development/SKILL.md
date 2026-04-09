---
name: deploy-pester-test-development
description: "Deploy Pester test suite to a PowerShell project — copy test files, configure Invoke-Pester with coverage, set up CI/CD pipeline (Azure DevOps or GitHub Actions), configure coverage gates at 90%+"
---

# Deploy Pester Test Suite

Deploy generated Pester tests to any PowerShell project with CI/CD integration.

## Steps
1. Copy *.Tests.ps1 files to target project's tests/ directory
2. Copy test helpers to tests/TestHelpers/
3. Create PesterConfiguration with coverage settings (JaCoCo, NUnit)
4. Validate all tests pass locally: Invoke-Pester -Configuration $config
5. Configure CI/CD pipeline:
   - Azure DevOps: PowerShell@2 task + PublishTestResults + PublishCodeCoverage
   - GitHub Actions: pwsh shell step + upload-artifact for reports
6. Set coverage gate: fail pipeline if line coverage < 90%
7. Verify pipeline execution: trigger manually, confirm reports published
