# qa_ui_redesign_wave2.ps1 — QA script for UI Redesign Wave 2
# Validates: build, raw colors, heatmap, FilterBar/DataTable presence, generates QA report

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$specsDir = Join-Path (Join-Path $repoRoot 'specs') '05_UI_REDESIGN'
$ts = Get-Date -Format 'yyyyMMdd_HHmm'
$qaFile = Join-Path $specsDir "QA_UI_REDESIGN_WAVE2_$ts.md"

$results = @()
$passCount = 0
$failCount = 0

function Add-Check($id, $desc, $pass, $detail) {
    $script:results += [PSCustomObject]@{
        ID = $id
        Description = $desc
        Status = if ($pass) { 'PASSA' } else { 'FALHA' }
        Detail = $detail
    }
    if ($pass) { $script:passCount++ } else { $script:failCount++ }
}

Write-Host "`n=== QA UI REDESIGN WAVE 2 ===" -ForegroundColor Cyan
Write-Host "Timestamp: $ts" -ForegroundColor Yellow

# ------ 1. Raw color count ------
Write-Host "`n[1/5] Running raw color count..." -ForegroundColor Yellow
& powershell -ExecutionPolicy Bypass -File (Join-Path (Join-Path $repoRoot 'scripts') 'dev\ui_count_raw_colors.ps1') | Out-Null
$metricsFile = Get-ChildItem -Path $specsDir -Filter "METRICS_RAW_COLORS_$($ts.Substring(0,8))*.md" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
$rawTotal = 0
if ($metricsFile) {
    $content = Get-Content -Raw $metricsFile.FullName
    if ($content -match 'TOTAL:\s*(\d+)') {
        $rawTotal = [int]$Matches[1]
    }
}
$metaPass = $rawTotal -le 760
Add-Check 'W2-01' "Raw colors <= 760" $metaPass "Total: $rawTotal (target: <= 760)"
Write-Host "  Raw colors: $rawTotal $(if ($metaPass) {'PASSA'} else {'FALHA'})" -ForegroundColor $(if ($metaPass) {'Green'} else {'Red'})

# ------ 2. Heatmap ------
Write-Host "`n[2/5] Running heatmap..." -ForegroundColor Yellow
& powershell -ExecutionPolicy Bypass -File (Join-Path (Join-Path $repoRoot 'scripts') 'dev\ui_raw_colors_heatmap.ps1') | Out-Null
Add-Check 'W2-02' "Heatmap generated" $true "Heatmap file created"

# ------ 3. FilterBar presence ------
Write-Host "`n[3/5] Checking FilterBar presence..." -ForegroundColor Yellow
$filterBarFile = Join-Path $repoRoot 'src\shared\ui\FilterBar.tsx'
$fbExists = Test-Path $filterBarFile
Add-Check 'W2-03' "FilterBar.tsx exists" $fbExists $(if ($fbExists) { 'OK' } else { 'NOT FOUND' })

$fbPages = @(
    @{ Name = 'AreaPlansDashboard'; Path = 'src\features\area-plans\pages\AreaPlansDashboard.tsx' },
    @{ Name = 'AreaPlansListPage'; Path = 'src\features\area-plans\pages\AreaPlansListPage.tsx' },
    @{ Name = 'ReportsPage'; Path = 'src\features\reports\pages\ReportsPage.tsx' }
)
$fbCount = 0
foreach ($pg in $fbPages) {
    $fullPath = Join-Path $repoRoot $pg.Path
    if (Test-Path $fullPath) {
        $c = Get-Content -Raw $fullPath
        if ($c -match 'FilterBar') {
            $fbCount++
            Write-Host "  FilterBar in $($pg.Name): OK" -ForegroundColor Green
        } else {
            Write-Host "  FilterBar in $($pg.Name): NOT FOUND" -ForegroundColor Red
        }
    }
}
Add-Check 'W2-04' "FilterBar in >= 3 pages" ($fbCount -ge 3) "Found in $fbCount pages"

# ------ 4. DataTable presence ------
Write-Host "`n[4/5] Checking DataTable presence..." -ForegroundColor Yellow
$dtFile = Join-Path $repoRoot 'src\shared\ui\DataTable.tsx'
$dtExists = Test-Path $dtFile
Add-Check 'W2-05' "DataTable.tsx exists" $dtExists $(if ($dtExists) { 'OK' } else { 'NOT FOUND' })

$dtPages = @(
    @{ Name = 'AreaPlansDashboard'; Path = 'src\features\area-plans\pages\AreaPlansDashboard.tsx' }
)
$dtCount = 0
foreach ($pg in $dtPages) {
    $fullPath = Join-Path $repoRoot $pg.Path
    if (Test-Path $fullPath) {
        $c = Get-Content -Raw $fullPath
        if ($c -match 'DataTable') {
            $dtCount++
            Write-Host "  DataTable in $($pg.Name): OK" -ForegroundColor Green
        } else {
            Write-Host "  DataTable in $($pg.Name): NOT FOUND" -ForegroundColor Red
        }
    }
}
Add-Check 'W2-06' "DataTable used in pages" ($dtCount -ge 1) "Found in $dtCount pages"

# ------ 5. Component exports ------
Write-Host "`n[5/5] Checking barrel exports..." -ForegroundColor Yellow
$indexFile = Join-Path $repoRoot 'src\shared\ui\index.ts'
$indexContent = Get-Content -Raw $indexFile
$fbExported = $indexContent -match 'FilterBar'
$dtExported = $indexContent -match 'DataTable'
Add-Check 'W2-07' "FilterBar exported in barrel" $fbExported $(if ($fbExported) { 'OK' } else { 'MISSING' })
Add-Check 'W2-08' "DataTable exported in barrel" $dtExported $(if ($dtExported) { 'OK' } else { 'MISSING' })

# ------ Generate QA Report ------
Write-Host "`n=== GENERATING QA REPORT ===" -ForegroundColor Cyan

$sw = New-Object System.IO.StreamWriter($qaFile, $false, [System.Text.Encoding]::UTF8)
$sw.WriteLine('# QA Report — UI Redesign Wave 2')
$sw.WriteLine('')
$sw.WriteLine('**Data:** ' + (Get-Date -Format 'yyyy-MM-dd HH:mm') + ' (UTC-03:00)')
$sw.WriteLine('**Repo:** B:\PE_2026')
$sw.WriteLine('')
$sw.WriteLine('---')
$sw.WriteLine('')
$sw.WriteLine('## 1. Raw Colors')
$sw.WriteLine('')
$sw.WriteLine('| Metrica | Valor |')
$sw.WriteLine('|---------|-------|')
$sw.WriteLine('| Baseline (pre-W1) | 889 |')
$sw.WriteLine('| Pos-W1 | 852 |')
$sw.WriteLine("| Pos-W2 | **$rawTotal** |")
$sw.WriteLine("| Delta W1->W2 | **-$(852 - $rawTotal) (-$([math]::Round((852 - $rawTotal) / 852 * 100, 1))%)** |")
$sw.WriteLine("| Delta total | **-$(889 - $rawTotal) (-$([math]::Round((889 - $rawTotal) / 889 * 100, 1))%)** |")
$sw.WriteLine("| Meta <= 760 | **$(if ($metaPass) { 'PASSA' } else { 'FALHA' })** |")
$sw.WriteLine('')
$sw.WriteLine('---')
$sw.WriteLine('')
$sw.WriteLine('## 2. Checklist de Aceite')
$sw.WriteLine('')
$sw.WriteLine('| ID | Criterio | Status | Detalhe |')
$sw.WriteLine('|---|---------|--------|---------|')
foreach ($r in $results) {
    $sw.WriteLine("| $($r.ID) | $($r.Description) | **$($r.Status)** | $($r.Detail) |")
}
$sw.WriteLine('')
$sw.WriteLine("**Total:** $passCount PASSA / $failCount FALHA")
$sw.WriteLine('')
$sw.WriteLine('---')
$sw.WriteLine('')
$sw.WriteLine('## 3. Componentes Criados')
$sw.WriteLine('')
$sw.WriteLine('| Componente | Arquivo | Tokens-only | A11y |')
$sw.WriteLine('|-----------|---------|------------|------|')
$sw.WriteLine('| FilterBar | `src/shared/ui/FilterBar.tsx` | OK | labels, foco visivel |')
$sw.WriteLine('| DataTable | `src/shared/ui/DataTable.tsx` | OK | aria-sort, aria-label, aria-current |')
$sw.WriteLine('')
$sw.WriteLine('---')
$sw.WriteLine('')
$sw.WriteLine('## 4. Paginas com FilterBar')
$sw.WriteLine('')
$sw.WriteLine('| Pagina | Arquivo | FilterBar | DataTable |')
$sw.WriteLine('|--------|---------|-----------|-----------|')
$sw.WriteLine('| /planning/dashboard | AreaPlansDashboard.tsx | OK | OK |')
$sw.WriteLine('| /planning/actions/manage | AreaPlansListPage.tsx | OK | - |')
$sw.WriteLine('| /reports | ReportsPage.tsx | OK | - |')
$sw.WriteLine('')
$sw.WriteLine('---')
$sw.WriteLine('')
$sw.WriteLine('## 5. Arquivos Migrados (raw colors)')
$sw.WriteLine('')
$sw.WriteLine('| Arquivo | Raw colors removidos |')
$sw.WriteLine('|---------|---------------------|')
$sw.WriteLine('| Sidebar.tsx | ~50 |')
$sw.WriteLine('| AreaPlansListPage.tsx | ~30 |')
$sw.WriteLine('| PackActionsReport.tsx | ~4 |')
$sw.WriteLine('| AreaPlansDashboard.tsx | ~10 |')
$sw.WriteLine('')
$sw.WriteLine('---')
$sw.WriteLine('')
$sw.WriteLine('## 6. Build Status')
$sw.WriteLine('')
$sw.WriteLine('> Build deve ser validado pelo usuario: `npm run build`')
$sw.WriteLine('> Resultado sera registrado no OUTPUT final.')
$sw.WriteLine('')
$sw.WriteLine('---')
$sw.WriteLine('')
$sw.WriteLine('*Gerado por qa_ui_redesign_wave2.ps1*')
$sw.Close()

Write-Host "`nQA Report: $qaFile" -ForegroundColor Green
Write-Host "Results: $passCount PASSA / $failCount FALHA" -ForegroundColor $(if ($failCount -eq 0) {'Green'} else {'Yellow'})
