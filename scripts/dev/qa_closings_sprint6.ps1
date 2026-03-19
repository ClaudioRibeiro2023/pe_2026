# QA Closings Sprint 6
$pass = 0
$fail = 0

Write-Host "========================================"
Write-Host " QA CLOSINGS SPRINT 6"
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

Write-Host "[2] types.ts"
Check "types.ts" (Test-Path "src/features/closings/types.ts")

Write-Host "[3] api-mock.ts"
Check "api-mock.ts" (Test-Path "src/features/closings/api-mock.ts")

Write-Host "[4] Pages"
$p1 = Test-Path "src/features/closings/pages/ClosingsListPage.tsx"
$p2 = Test-Path "src/features/closings/pages/ClosingDetailsPage.tsx"
$p3 = Test-Path "src/features/closings/pages/ClosingsComparePage.tsx"
Check "3 pages exist" ($p1 -and $p2 -and $p3)

Write-Host "[5] Routes"
$rc = Get-Content "src/shared/config/routes.ts" -Raw
Check "GOVERNANCE_CLOSINGS route" ($rc -match "GOVERNANCE_CLOSINGS")

Write-Host "[6] Router"
$rt = Get-Content "src/app/router.tsx" -Raw
Check "Router entries" (($rt -match "ClosingsListPage") -and ($rt -match "ClosingDetailsPage"))

Write-Host "[7] Sidebar nav"
$nv = Get-Content "src/shared/config/navigation.ts" -Raw
Check "Fechamentos nav" ($nv -match "Fechamentos")

Write-Host "[8] Export"
Check "export.ts" (Test-Path "src/features/closings/export.ts")

Write-Host "[9] Seeds+Diff+Audit"
$api = Get-Content "src/features/closings/api-mock.ts" -Raw
Check "seedClosings+diffClosings" (($api -match "seedClosings") -and ($api -match "diffClosings"))

Write-Host "[10] Hooks"
$hk = Get-Content "src/features/closings/hooks.ts" -Raw
Check "useClosings+useAuditTrail" (($hk -match "useClosings") -and ($hk -match "useAuditTrail"))

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
