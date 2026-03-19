# QA PDF Sprint 7
$pass = 0
$fail = 0

Write-Host "========================================"
Write-Host " QA PDF INSTITUTIONAL SPRINT 7"
Write-Host "========================================"

function Check($name, $cond) {
    if ($cond) {
        Write-Host "  PASS: $name" -ForegroundColor Green
        $script:pass++
    } else {
        Write-Host "  FAIL: $name" -ForegroundColor Red
        $script:fail++
    }
}

Write-Host "[1] Build..."
npx vite build 2>&1 | Out-Null
Check "Build exit 0" ($LASTEXITCODE -eq 0)

Write-Host "[2] PDF types.ts"
Check "pdf/types.ts" (Test-Path "src/shared/lib/pdf/types.ts")

Write-Host "[3] PDF template.ts"
Check "pdf/template.ts" (Test-Path "src/shared/lib/pdf/template.ts")

Write-Host "[4] PDF sections.ts"
Check "pdf/sections.ts" (Test-Path "src/shared/lib/pdf/sections.ts")

Write-Host "[5] PDF chartCapture.ts"
Check "pdf/chartCapture.ts" (Test-Path "src/shared/lib/pdf/chartCapture.ts")

Write-Host "[6] PDF index.ts"
$idx = Test-Path "src/shared/lib/pdf/index.ts"
$idxContent = ""
if ($idx) { $idxContent = Get-Content "src/shared/lib/pdf/index.ts" -Raw }
Check "pdf/index.ts + buildInstitutionalPDF" ($idx -and ($idxContent -match "buildInstitutionalPDF"))

Write-Host "[7] exportReports.ts"
$er = Test-Path "src/shared/lib/pdf/exportReports.ts"
$erc = ""
if ($er) { $erc = Get-Content "src/shared/lib/pdf/exportReports.ts" -Raw }
Check "exportReportInstitutionalPDF" ($er -and ($erc -match "exportReportInstitutionalPDF"))

Write-Host "[8] exportClosings.ts"
$ec = Test-Path "src/shared/lib/pdf/exportClosings.ts"
$ecc = ""
if ($ec) { $ecc = Get-Content "src/shared/lib/pdf/exportClosings.ts" -Raw }
Check "exportClosingToPDF" ($ec -and ($ecc -match "exportClosingToPDF"))

Write-Host "[9] exportPacks.ts"
$ep = Test-Path "src/shared/lib/pdf/exportPacks.ts"
$epc = ""
if ($ep) { $epc = Get-Content "src/shared/lib/pdf/exportPacks.ts" -Raw }
Check "exportPackToPDF" ($ep -and ($epc -match "exportPackToPDF"))

Write-Host "[10] Chart capture pipeline"
$cc = Get-Content "src/shared/lib/pdf/chartCapture.ts" -Raw
Check "captureChart+captureAllCharts" (($cc -match "captureChart") -and ($cc -match "captureAllCharts"))

Write-Host "[11] data-pdf-chart in ProgressReport"
$pr = Get-Content "src/features/reports/components/ProgressReport.tsx" -Raw
Check "data-pdf-chart attrs" ($pr -match "data-pdf-chart")

Write-Host "[12] PDF button in ClosingDetails"
$cd = Get-Content "src/features/closings/pages/ClosingDetailsPage.tsx" -Raw
Check "exportClosingToPDF in ClosingDetails" ($cd -match "exportClosingToPDF")

Write-Host "[13] PDF button in StrategicPack"
$sp = Get-Content "src/features/strategic-pack/pages/StrategicPackPage.tsx" -Raw
Check "exportPackToPDF in StrategicPack" ($sp -match "exportPackToPDF")

Write-Host "[14] Fallback handling"
$sec = Get-Content "src/shared/lib/pdf/sections.ts" -Raw
Check "Chart fallback note" ($sec -match "indisponivel")

Write-Host "[15] Footer+Header in template"
$tpl = Get-Content "src/shared/lib/pdf/template.ts" -Raw
Check "renderHeader+applyFooters" (($tpl -match "renderHeader") -and ($tpl -match "applyFooters"))

$total = $pass + $fail
Write-Host "========================================"
Write-Host " PASS: $pass / $total"
Write-Host " FAIL: $fail"
Write-Host "========================================"
if ($fail -eq 0) {
    Write-Host " QA PASSED" -ForegroundColor Green
} else {
    Write-Host " QA FAILED" -ForegroundColor Red
}
