# qa_ui_redesign_wave1.ps1 — QA para Onda 1 do UI Redesign
# Uso: powershell -ExecutionPolicy Bypass -File scripts/dev/qa_ui_redesign_wave1.ps1
# Pre-requisito: npm run build deve ser rodado ANTES e exit code informado

$repoRoot = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path))
$srcDir = Join-Path $repoRoot "src"
$specsDir = Join-Path (Join-Path $repoRoot "specs") "05_UI_REDESIGN"
$timestamp = Get-Date -Format "yyyyMMdd_HHmm"
$qaFile = Join-Path $specsDir "QA_UI_REDESIGN_WAVE1_${timestamp}.md"

Write-Host ""
Write-Host "===== QA UI REDESIGN WAVE 1 =====" -ForegroundColor Cyan
Write-Host ""

# --- 1. Post-migration color count ---
Write-Host "[1/4] Contagem pos-migracao..." -ForegroundColor Yellow
$patternNames = @("text-gray-", "bg-gray-", "border-gray-", "bg-white", "text-black", "text-white", "stroke-gray-")
$files = Get-ChildItem -Path $srcDir -Recurse -Include "*.tsx","*.ts"
$files = $files | Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.d\.ts$" -and $_.FullName -notmatch "tokens\.css$" -and $_.FullName -notmatch "tailwind\.config" }

$countMap = @{}
foreach ($pn in $patternNames) { $countMap[$pn] = 0 }
$totalAfter = 0

foreach ($file in $files) {
    $content = Get-Content -Raw $file.FullName
    foreach ($pn in $patternNames) {
        $m = [regex]::Matches($content, [regex]::Escape($pn))
        if ($m.Count -gt 0) { $countMap[$pn] += $m.Count; $totalAfter += $m.Count }
    }
}

foreach ($pn in $patternNames) {
    Write-Host "  ${pn}: $($countMap[$pn])" -ForegroundColor $(if($countMap[$pn] -eq 0){"Green"}else{"Yellow"})
}
Write-Host "  TOTAL AFTER: $totalAfter" -ForegroundColor $(if($totalAfter -eq 0){"Green"}else{"Yellow"})

# --- 2. Guardrail ---
Write-Host ""
Write-Host "[2/4] Rodando guardrail..." -ForegroundColor Yellow
$guardrailScript = Join-Path (Join-Path $repoRoot "scripts") "dev\ui_guardrail_no_raw_colors.ps1"
$guardrailResult = "N/A"
if (Test-Path $guardrailScript) {
    try {
        & powershell -ExecutionPolicy Bypass -File $guardrailScript 2>&1 | Out-Null
        $guardrailExitCode = $LASTEXITCODE
    } catch {
        $guardrailExitCode = 1
    }
    $guardrailResult = if ($guardrailExitCode -eq 0) { "PASSA" } else { "FALHA (exit $guardrailExitCode) - raw colors still present in non-allowlisted files" }
    Write-Host "  Guardrail: $guardrailResult" -ForegroundColor $(if($guardrailExitCode -eq 0){"Green"}else{"Yellow"})
} else {
    Write-Host "  Guardrail script not found" -ForegroundColor Red
}

# --- 3. PageHeader check ---
Write-Host ""
Write-Host "[3/4] Verificando PageHeader nas paginas-alvo..." -ForegroundColor Yellow

$targetPages = @(
    "src\features\planning\pages\PlanningHomePage.tsx",
    "src\features\planning\pages\PlanningDashboardPage.tsx",
    "src\features\planning\pages\PlanningCalendarPage.tsx",
    "src\features\planning\pages\area\PlanningAreaDashboardPage.tsx",
    "src\features\reports\pages\ReportsPage.tsx"
)

$pageResults = @()
foreach ($tp in $targetPages) {
    $fullPath = Join-Path $repoRoot $tp
    $hasPageHeader = $false
    $hasBreadcrumbs = $false
    if (Test-Path $fullPath) {
        $content = Get-Content -Raw $fullPath
        $hasPageHeader = $content -match "PageHeader"
        $hasBreadcrumbs = $content -match "breadcrumbs|Breadcrumbs"
    }
    $phStatus = if ($hasPageHeader) { "OK" } else { "FALTA" }
    $bcStatus = if ($hasBreadcrumbs) { "OK" } else { "FALTA" }
    $pageResults += @{ Path = $tp; PageHeader = $phStatus; Breadcrumbs = $bcStatus }
    Write-Host "  $tp -> PageHeader: $phStatus, Breadcrumbs: $bcStatus" -ForegroundColor $(if($hasPageHeader -and $hasBreadcrumbs){"Green"}else{"Yellow"})
}

# --- 4. Shared component check ---
Write-Host ""
Write-Host "[4/4] Verificando componentes shared criados/alterados..." -ForegroundColor Yellow

$sharedComponents = @(
    @{ File = "src\shared\ui\Breadcrumbs.tsx"; Check = "NEW" },
    @{ File = "src\shared\ui\PageHeader.tsx"; Check = "NEW" },
    @{ File = "src\shared\ui\Card.tsx"; Check = "MIGRATED" },
    @{ File = "src\shared\ui\Input.tsx"; Check = "MIGRATED" },
    @{ File = "src\shared\ui\Progress.tsx"; Check = "MIGRATED" },
    @{ File = "src\shared\ui\Tooltip.tsx"; Check = "MIGRATED" },
    @{ File = "src\shared\ui\index.ts"; Check = "UPDATED" }
)

$componentResults = @()
foreach ($sc in $sharedComponents) {
    $exists = Test-Path (Join-Path $repoRoot $sc.File)
    $status = if ($exists) { "OK ($($sc.Check))" } else { "MISSING" }
    $componentResults += @{ File = $sc.File; Status = $status }
    Write-Host "  $($sc.File): $status" -ForegroundColor $(if($exists){"Green"}else{"Red"})
}

# --- Write QA file ---
Write-Host ""
Write-Host "Gerando QA report..." -ForegroundColor Yellow

$sw = [System.IO.StreamWriter]::new($qaFile, $false, [System.Text.Encoding]::UTF8)
$sw.WriteLine("# QA UI Redesign Wave 1 - $timestamp")
$sw.WriteLine("")
$sw.WriteLine("## 1. Contagem de Cores Raw (pos-migracao)")
$sw.WriteLine("")
$sw.WriteLine("| Pattern | Baseline (pre) | After | Delta |")
$sw.WriteLine("|---------|---------------|-------|-------|")

# Baseline values hardcoded from run at 20260208_1539
$baselineMap = @{
    "text-gray-" = 498; "bg-gray-" = 149; "border-gray-" = 106;
    "bg-white" = 52; "text-black" = 0; "text-white" = 82; "stroke-gray-" = 2
}
$totalBaseline = 889

foreach ($pn in $patternNames) {
    $b = $baselineMap[$pn]
    $a = $countMap[$pn]
    $d = $a - $b
    $dStr = if ($d -le 0) { "$d" } else { "+$d" }
    $sw.WriteLine("| ``$pn`` | $b | $a | $dStr |")
}

$totalDelta = $totalAfter - $totalBaseline
$dTotalStr = if ($totalDelta -le 0) { "$totalDelta" } else { "+$totalDelta" }
$sw.WriteLine("| **TOTAL** | **$totalBaseline** | **$totalAfter** | **$dTotalStr** |")

$sw.WriteLine("")
$sw.WriteLine("## 2. Guardrail")
$sw.WriteLine("")
$sw.WriteLine("Resultado: **$guardrailResult**")
$sw.WriteLine("")
$sw.WriteLine("Nota: O guardrail verifica apenas arquivos fora da allowlist (tokens.css, tailwind.config, icons.tsx, .d.ts, styles/).")
$sw.WriteLine("A meta da Onda 1 e reduzir e criar guardrails, nao zerar 100% do repo.")

$sw.WriteLine("")
$sw.WriteLine("## 3. PageHeader + Breadcrumbs nas Paginas-Alvo")
$sw.WriteLine("")
$sw.WriteLine("| Pagina | PageHeader | Breadcrumbs |")
$sw.WriteLine("|--------|-----------|------------|")
foreach ($pr in $pageResults) {
    $sw.WriteLine("| ``$($pr.Path)`` | $($pr.PageHeader) | $($pr.Breadcrumbs) |")
}

$sw.WriteLine("")
$sw.WriteLine("## 4. Componentes Shared Criados/Alterados")
$sw.WriteLine("")
$sw.WriteLine("| Componente | Status |")
$sw.WriteLine("|-----------|--------|")
foreach ($cr in $componentResults) {
    $sw.WriteLine("| ``$($cr.File)`` | $($cr.Status) |")
}

$sw.WriteLine("")
$sw.WriteLine("## 5. Build")
$sw.WriteLine("")
$sw.WriteLine("Build deve ser validado manualmente: ``npm run build``")
$sw.WriteLine("")
$sw.WriteLine("---")
$sw.WriteLine("*QA Onda 1 - UI Redesign PE_2026*")
$sw.Close()

Write-Host ""
Write-Host "QA report salvo em: $qaFile" -ForegroundColor Green
Write-Host ""
