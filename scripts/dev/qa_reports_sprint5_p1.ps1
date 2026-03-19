#!/usr/bin/env pwsh
# QA Reports Sprint 5 P1
# Valida: build, pack select, date range, charts, export PDF, toast, icon warnings

$ErrorActionPreference = "Continue"
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$timestamp = Get-Date -Format "yyyyMMdd_HHmm"

Write-Host "=== QA Reports Sprint 5 P1 ==="
Write-Host "Repo: $repoRoot"
Write-Host ""

# ---------- 1) Build ----------
Write-Host ">> Rodando build..."
$buildOutput = & npm run build 2>&1 | Out-String
$buildExitCode = $LASTEXITCODE
$buildStatus = if ($buildExitCode -eq 0) { "BUILD OK (exit $buildExitCode)" } else { "BUILD FALHOU (exit $buildExitCode)" }
Write-Host "  $buildStatus"
Write-Host ""

# ---------- 2) Capturar icon warnings ----------
Write-Host ">> Verificando warnings de icones..."
$iconWarnings = ($buildOutput | Select-String -Pattern "dynamically imported by.*icons\.tsx" -AllMatches).Matches.Count
$iconWarningCheck = if ($iconWarnings -eq 0) { "OK - 0 warnings de icones" } else { "ALERTA - $iconWarnings warnings de icones" }
Write-Host "  Icones: $iconWarningCheck"
Write-Host ""

# ---------- 3) Validar ReportsPage P1 ----------
Write-Host ">> Validando ReportsPage P1..."

$reportsPagePath = Join-Path $repoRoot "src/features/reports/pages/ReportsPage.tsx"
$reportsContent = Get-Content -Raw -Encoding UTF8 $reportsPagePath

# a) Pack select real (select element with availablePacks)
$packSelectCheck = if ($reportsContent -match "availablePacks") { "OK - pack select real" } else { "FALHOU - sem pack select" }

# b) Date range inputs
$dateRangeCheck = if ($reportsContent -match 'type="date"') { "OK - date range inputs" } else { "FALHOU - sem date range" }

# c) Filters prop passed
$filtersCheck = if ($reportsContent -match "filters=\{filterSummary\}") { "OK - filters prop" } else { "FALHOU - sem filters prop" }

Write-Host "  Pack select: $packSelectCheck"
Write-Host "  Date range: $dateRangeCheck"
Write-Host "  Filters: $filtersCheck"
Write-Host ""

# ---------- 4) Validar ProgressReport charts ----------
Write-Host ">> Validando charts no ProgressReport..."

$progressPath = Join-Path $repoRoot "src/features/reports/components/ProgressReport.tsx"
$progressContent = Get-Content -Raw -Encoding UTF8 $progressPath

$statusBarChartCheck = if ($progressContent -match "StatusBarChart") { "OK - StatusBarChart" } else { "FALHOU" }
$doughnutChartCheck = if ($progressContent -match "ProgramDoughnutChart") { "OK - ProgramDoughnutChart" } else { "FALHOU" }

Write-Host "  StatusBarChart: $statusBarChartCheck"
Write-Host "  ProgramDoughnutChart: $doughnutChartCheck"
Write-Host ""

# ---------- 5) Validar chart files exist ----------
Write-Host ">> Verificando arquivos de charts..."

$chartFiles = @(
  "src/features/reports/components/charts/StatusBarChart.tsx",
  "src/features/reports/components/charts/ProgramDoughnutChart.tsx"
)

foreach ($f in $chartFiles) {
  $fp = Join-Path $repoRoot $f
  if (Test-Path $fp) {
    $sz = (Get-Item $fp).Length
    Write-Host "  $f : OK ($sz bytes)"
  } else {
    Write-Host "  $f : FALHOU (nao encontrado)"
  }
}
Write-Host ""

# ---------- 6) Validar export PDF melhorado ----------
Write-Host ">> Validando export PDF..."

$exportPath = Join-Path $repoRoot "src/shared/lib/export.ts"
$exportContent = Get-Content -Raw -Encoding UTF8 $exportPath

$exportReportPDFCheck = if ($exportContent -match "exportReportToPDF") { "OK - exportReportToPDF" } else { "FALHOU" }
$filtersBlockCheck = if ($exportContent -match "Filtros aplicados") { "OK - bloco filtros no PDF" } else { "FALHOU" }

Write-Host "  exportReportToPDF: $exportReportPDFCheck"
Write-Host "  Bloco filtros: $filtersBlockCheck"
Write-Host ""

# ---------- 7) Validar toast integrado ----------
Write-Host ">> Validando toast no export..."

$execReportPath = Join-Path $repoRoot "src/features/reports/components/ExecutiveReport.tsx"
$execContent = Get-Content -Raw -Encoding UTF8 $execReportPath

$toastCheck = if ($execContent -match "useToast") { "OK - useToast integrado" } else { "FALHOU" }
$toastSuccessCheck = if ($execContent -match "Exportado com sucesso") { "OK - toast success" } else { "FALHOU" }

Write-Host "  useToast: $toastCheck"
Write-Host "  Toast success: $toastSuccessCheck"
Write-Host ""

# ---------- 8) Validar dados mock (42 IDs RH) ----------
Write-Host ">> Validando dados mock..."

$mockActionsPath = Join-Path $repoRoot "src/features/area-plans/utils/mockActions.ts"
$mockContent = Get-Content -Raw -Encoding UTF8 $mockActionsPath

$rhIds = [regex]::Matches($mockContent, "RH-[A-Z]{3}-\d{2}")
$uniqueIds = $rhIds | ForEach-Object { $_.Value } | Sort-Object -Unique
$idCount = $uniqueIds.Count
$idCheck = if ($idCount -eq 42) { "OK - 42 IDs RH" } else { "ALERTA - $idCount IDs (esperado 42)" }

Write-Host "  IDs RH: $idCheck"
Write-Host ""

# ---------- 9) Verificar icon migration ----------
Write-Host ">> Verificando migração de icones..."

$directImports = Get-ChildItem -Path (Join-Path $repoRoot "src/features") -Recurse -Include "*.tsx","*.ts" | 
  Select-String -Pattern "from 'lucide-react'" -List
$directImportCount = ($directImports | Measure-Object).Count
$migrationCheck = if ($directImportCount -eq 0) { "OK - 0 imports diretos de lucide-react em features/" } else { "ALERTA - $directImportCount arquivos com import direto" }

Write-Host "  Migracao: $migrationCheck"
Write-Host ""

# ---------- 10) Verificar arquivos ----------
Write-Host ">> Verificando arquivos criados/alterados..."

$files = @(
  "src/features/reports/pages/ReportsPage.tsx",
  "src/features/reports/hooks.ts",
  "src/features/reports/types.ts",
  "src/features/reports/components/ExecutiveReport.tsx",
  "src/features/reports/components/PackActionsReport.tsx",
  "src/features/reports/components/ProgressReport.tsx",
  "src/features/reports/components/charts/StatusBarChart.tsx",
  "src/features/reports/components/charts/ProgramDoughnutChart.tsx",
  "src/shared/lib/export.ts",
  "src/shared/ui/icons.tsx"
)

$fileResults = @()
$hashResults = @()

foreach ($f in $files) {
  $fp = Join-Path $repoRoot $f
  if (Test-Path $fp) {
    $sz = (Get-Item $fp).Length
    $hash = (Get-FileHash $fp -Algorithm SHA256).Hash.Substring(0, 16)
    $fileResults += "| $f | OK ($sz bytes) |"
    $hashResults += "| $f | $hash... |"
    Write-Host "  $f : OK ($sz bytes)"
  } else {
    $fileResults += "| $f | FALHOU |"
    Write-Host "  $f : FALHOU"
  }
}
Write-Host ""

# ---------- Gerar QA Report ----------
$qaPath = Join-Path $repoRoot "specs/04_REPORTS/QA_08_REPORTS_SPRINT5_P1_$timestamp.md"

$qaContent = @"
# QA_08 - Reports Sprint 5 P1

**Timestamp:** $(Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
**Repo:** $repoRoot

## 1) Build

``````text
$buildStatus
``````

## 2) Icon Warnings

| Check | Resultado |
|-------|-----------|
| Warnings de icones no build | $iconWarningCheck |
| Imports diretos em features/ | $migrationCheck |

## 3) Validacoes P1

| Check | Resultado |
|-------|-----------|
| Pack select real | $packSelectCheck |
| Date range inputs | $dateRangeCheck |
| Filters prop | $filtersCheck |
| StatusBarChart | $statusBarChartCheck |
| ProgramDoughnutChart | $doughnutChartCheck |
| exportReportToPDF | $exportReportPDFCheck |
| Bloco filtros no PDF | $filtersBlockCheck |
| useToast integrado | $toastCheck |
| Toast success msg | $toastSuccessCheck |
| IDs RH no mock | $idCheck |

## 4) Arquivos

| Arquivo | Status |
|---------|--------|
$($fileResults -join "`n")

## 5) Hashes (SHA256)

| Arquivo | Hash (parcial) |
|---------|---------------|
$($hashResults -join "`n")

## 6) Checklist GATE_10 (P1)

| Criterio | Status |
|----------|--------|
| G-01 Pack selector real | $(if ($packSelectCheck -match 'OK') { 'PASSA' } else { 'FALHA' }) |
| G-02 Date range picker | $(if ($dateRangeCheck -match 'OK') { 'PASSA' } else { 'FALHA' }) |
| G-03 Chart.js interativo | $(if ($statusBarChartCheck -match 'OK' -and $doughnutChartCheck -match 'OK') { 'PASSA' } else { 'FALHA' }) |
| G-04 Export PDF melhorado | $(if ($exportReportPDFCheck -match 'OK') { 'PASSA' } else { 'FALHA' }) |
| G-05 Toast feedback | $(if ($toastCheck -match 'OK') { 'PASSA' } else { 'FALHA' }) |
| G-06 Icon warnings resolvidos | $(if ($iconWarnings -eq 0) { 'PASSA' } else { 'PARCIAL' }) |
| G-07 42 acoes pack-rh-2026 | $(if ($idCheck -match 'OK') { 'PASSA' } else { 'FALHA' }) |
| G-08 Build sem erros | $(if ($buildExitCode -eq 0) { 'PASSA' } else { 'FALHA' }) |

"@

$qaContent | Out-File -FilePath $qaPath -Encoding UTF8
Write-Host "=== QA Report gerado ==="
Write-Host "Arquivo: $qaPath"
