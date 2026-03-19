# QA Script — UI Redesign Wave 4
# Executa validações automatizadas

$ErrorActionPreference = "Continue"
$ts = Get-Date -Format "yyyyMMdd_HHmm"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " QA UI REDESIGN WAVE 4 — $ts" -ForegroundColor Cyan
Write-Host "========================================`n"

# 1. Build
Write-Host "[1/5] Running build..." -ForegroundColor Yellow
$buildResult = npx vite build 2>&1
$buildExit = $LASTEXITCODE
if ($buildExit -eq 0) {
    Write-Host "  BUILD OK (exit 0)" -ForegroundColor Green
} else {
    Write-Host "  BUILD FAILED (exit $buildExit)" -ForegroundColor Red
}

# 2. Raw colors count
Write-Host "`n[2/5] Counting raw colors..." -ForegroundColor Yellow
powershell -ExecutionPolicy Bypass -File scripts/dev/ui_count_raw_colors.ps1

# 3. Heatmap
Write-Host "`n[3/5] Generating heatmap..." -ForegroundColor Yellow
powershell -ExecutionPolicy Bypass -File scripts/dev/ui_raw_colors_heatmap.ps1

# 4. Sidebar check
Write-Host "`n[4/5] Checking Sidebar for raw colors..." -ForegroundColor Yellow
$sidebarRaw = Select-String -Path "src/app/layout/Sidebar.tsx" -Pattern "text-gray|bg-gray|border-gray" | Measure-Object | Select-Object -ExpandProperty Count
if ($sidebarRaw -eq 0) {
    Write-Host "  SIDEBAR OK (0 raw gray patterns)" -ForegroundColor Green
} else {
    Write-Host "  SIDEBAR HAS $sidebarRaw raw gray patterns" -ForegroundColor Red
}

# 5. STATUS/PRIORITY colors check
Write-Host "`n[5/5] Checking ACTION_STATUS_COLORS/PRIORITY_COLORS for raw -500/-600..." -ForegroundColor Yellow
$statusRaw = Select-String -Path "src/features/area-plans/types.ts" -Pattern "-(blue|red|green|yellow|purple|orange)-(100|200|300|400|500|600|700|800)" | Measure-Object | Select-Object -ExpandProperty Count
if ($statusRaw -eq 0) {
    Write-Host "  STATUS/PRIORITY COLORS OK (0 raw color patterns)" -ForegroundColor Green
} else {
    Write-Host "  STATUS/PRIORITY COLORS HAS $statusRaw raw patterns" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " QA COMPLETE" -ForegroundColor Cyan
Write-Host "========================================`n"
Write-Host "Build: exit $buildExit"
Write-Host "Sidebar raw: $sidebarRaw"
Write-Host "Status/Priority raw: $statusRaw"
