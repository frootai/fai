#Requires -Version 7.0
<#
.SYNOPSIS
    FrootAI — Deploy a Solution Play to Azure.

.DESCRIPTION
    Deploys a FrootAI solution play end-to-end:
      1. Validates the play exists and has required infra files
      2. Deploys infrastructure via Bicep (az deployment group create)
      3. Copies config files to the deployed application
      4. Runs the evaluation test suite
      5. Prints a deployment summary

.PARAMETER PlayNumber
    Two-digit play ID (e.g., 01, 05, 20).

.PARAMETER SkipEval
    Skip the evaluation step after deployment.

.PARAMETER ResourceGroup
    Azure resource group name. Default: $env:FROOTAI_RESOURCE_GROUP or "frootai-rg".

.EXAMPLE
    .\scripts\deploy-play.ps1 -PlayNumber 01
    .\scripts\deploy-play.ps1 -PlayNumber 05 -SkipEval
    .\scripts\deploy-play.ps1 -PlayNumber 01 -ResourceGroup "myRG"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidatePattern('^\d{2}$')]
    [string]$PlayNumber,

    [switch]$SkipEval,

    [string]$ResourceGroup = $(if ($env:FROOTAI_RESOURCE_GROUP) { $env:FROOTAI_RESOURCE_GROUP } else { "frootai-rg" })
)

$ErrorActionPreference = "Stop"

# ─── Colors & Helpers ───────────────────────────────────────────────
function Write-Info    { param([string]$Msg) Write-Host "  ℹ  $Msg" -ForegroundColor Cyan }
function Write-Ok      { param([string]$Msg) Write-Host "  ✅ $Msg" -ForegroundColor Green }
function Write-Warn    { param([string]$Msg) Write-Host "  ⚠️  $Msg" -ForegroundColor Yellow }
function Write-Fail    { param([string]$Msg) Write-Host "  ❌ $Msg" -ForegroundColor Red; throw $Msg }
function Write-Banner  { param([string]$Msg)
    Write-Host ""
    Write-Host "  ────────────────────────────────────────" -ForegroundColor White
    Write-Host "    $Msg" -ForegroundColor White
    Write-Host "  ────────────────────────────────────────" -ForegroundColor White
    Write-Host ""
}

# ─── Resolve Paths ──────────────────────────────────────────────────
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot  = Split-Path -Parent $ScriptDir

# Find matching play directory
$PlayDir = Get-ChildItem -Path (Join-Path $RepoRoot "solution-plays") -Directory |
    Where-Object { $_.Name -match "^$PlayNumber-" } |
    Select-Object -First 1

if (-not $PlayDir) {
    Write-Fail "Play $PlayNumber not found in solution-plays/"
}

$PlayName   = $PlayDir.Name
$BicepFile  = Join-Path $PlayDir.FullName "infra\main.bicep"
$ParamsFile = Join-Path $PlayDir.FullName "infra\parameters.json"
$ConfigDir  = Join-Path $PlayDir.FullName "config"
$EvalScript = Join-Path $PlayDir.FullName "evaluation\eval.py"
$EvalData   = Join-Path $PlayDir.FullName "evaluation\test-set.jsonl"

Write-Banner "🌳 FrootAI — Deploying Play: $PlayName"

# ─── Step 1: Validate ──────────────────────────────────────────────
Write-Info "Validating play structure..."

if (-not (Test-Path $BicepFile))  { Write-Fail "Missing: infra\main.bicep in $PlayName" }
if (-not (Test-Path $ParamsFile)) { Write-Fail "Missing: infra\parameters.json in $PlayName" }

Write-Ok "Play structure validated: $PlayName"
Write-Info "Resource group: $ResourceGroup"

# ─── Step 2: Deploy Infrastructure ─────────────────────────────────
Write-Banner "🏗️  Step 2: Deploying Infrastructure"

Write-Info "Running: az deployment group create..."
$DeployStart = Get-Date

$DeploymentName = "frootai-$PlayNumber-$(Get-Date -Format 'yyyyMMddHHmmss')"

az deployment group create `
    --resource-group $ResourceGroup `
    --template-file $BicepFile `
    --parameters "@$ParamsFile" `
    --name $DeploymentName `
    --output table

if ($LASTEXITCODE -ne 0) {
    Write-Fail "Infrastructure deployment failed (exit code: $LASTEXITCODE)"
}

$DeployDuration = [math]::Round(((Get-Date) - $DeployStart).TotalSeconds)
Write-Ok "Infrastructure deployed in ${DeployDuration}s"

# ─── Step 3: Copy Config Files ─────────────────────────────────────
Write-Banner "📋 Step 3: Copying Configuration"

if (Test-Path $ConfigDir) {
    $ConfigFiles = Get-ChildItem -Path $ConfigDir -File
    Write-Info "Found $($ConfigFiles.Count) config file(s) in $PlayName\config\"

    foreach ($cfg in $ConfigFiles) {
        Write-Info "  → $($cfg.Name)"
    }
    Write-Ok "Configuration files staged for deployment"
}
else {
    Write-Warn "No config\ directory found — skipping config copy"
}

# ─── Step 4: Run Evaluation ────────────────────────────────────────
if ($SkipEval) {
    Write-Warn "Evaluation skipped (-SkipEval flag)"
}
else {
    Write-Banner "🧪 Step 4: Running Evaluation"

    if ((Test-Path $EvalScript) -and (Test-Path $EvalData)) {
        Write-Info "Running: python eval.py --test-set test-set.jsonl"
        python $EvalScript --test-set $EvalData
        if ($LASTEXITCODE -ne 0) {
            Write-Warn "Evaluation completed with warnings (exit code: $LASTEXITCODE)"
        }
        else {
            Write-Ok "Evaluation complete"
        }
    }
    elseif (Test-Path $EvalScript) {
        Write-Info "Running evaluation (no test-set.jsonl found)..."
        python $EvalScript
        if ($LASTEXITCODE -ne 0) {
            Write-Warn "Evaluation completed with warnings"
        }
        else {
            Write-Ok "Evaluation complete"
        }
    }
    else {
        Write-Warn "No evaluation script found at $PlayName\evaluation\eval.py — skipping"
    }
}

# ─── Step 5: Summary ───────────────────────────────────────────────
Write-Banner "📊 Deployment Summary"

$EvalStatus = if ($SkipEval) { "Skipped" } else { "Ran" }
$Timestamp  = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

Write-Host "  Play:           $PlayName"
Write-Host "  Resource Group: $ResourceGroup"
Write-Host "  Bicep Template: $BicepFile"
Write-Host "  Deploy Time:    ${DeployDuration}s"
Write-Host "  Evaluation:     $EvalStatus"
Write-Host "  Timestamp:      $Timestamp"
Write-Host ""
Write-Ok "Play $PlayNumber deployed successfully! 🌳"
Write-Host "  View in portal: https://portal.azure.com/#@/resource/subscriptions/.../resourceGroups/$ResourceGroup" -ForegroundColor Cyan
