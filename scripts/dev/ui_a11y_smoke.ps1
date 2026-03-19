# A11y Smoke Check — UI Redesign Wave 5
$ErrorActionPreference = "Continue"
$ts = Get-Date -Format "yyyyMMdd_HHmm"
$pass = 0
$fail = 0
$warn = 0

Write-Host ""
Write-Host "========================================"
Write-Host " A11Y SMOKE CHECK"
Write-Host "========================================"

function Count-Pattern($pat) {
    return (Get-ChildItem -Path src -Recurse -Include *.tsx,*.css | Select-String -Pattern $pat | Measure-Object).Count
}

# 1
$v = Count-Pattern "focus-visible"
Write-Host "[1] focus-visible: $v"
if ($v -ge 10) { $pass++ } else { $warn++ }

# 2
$v = Count-Pattern "aria-label"
Write-Host "[2] aria-label: $v"
if ($v -ge 15) { $pass++ } else { $warn++ }

# 3
$v = Count-Pattern "role="
Write-Host "[3] role=: $v"
if ($v -ge 5) { $pass++ } else { $warn++ }

# 4
$v = Count-Pattern "aria-modal"
Write-Host "[4] aria-modal: $v"
if ($v -ge 1) { $pass++ } else { $warn++ }

# 5
$v = Count-Pattern "tabIndex"
Write-Host "[5] tabIndex: $v"
if ($v -ge 3) { $pass++ } else { $warn++ }

# 6
$v = Count-Pattern "sr-only"
Write-Host "[6] sr-only: $v"
if ($v -ge 3) { $pass++ } else { $warn++ }

# 7
$v = Count-Pattern "main-content"
Write-Host "[7] skip-to-main: $v"
if ($v -ge 1) { $pass++ } else { $warn++ }

# 8
$v = Count-Pattern "reduced-motion|motion-reduce"
Write-Host "[8] prefers-reduced-motion: $v"
if ($v -ge 1) { $pass++ } else { $warn++ }

# 9
$v = Count-Pattern "aria-live"
Write-Host "[9] aria-live: $v"
if ($v -ge 1) { $pass++ } else { $warn++ }

# 10
$v = Count-Pattern "aria-current"
Write-Host "[10] aria-current: $v"
if ($v -ge 1) { $pass++ } else { $warn++ }

$total = $pass + $warn + $fail
Write-Host ""
Write-Host "========================================"
Write-Host " PASS: $pass / $total"
Write-Host " WARN: $warn"
Write-Host " FAIL: $fail"
Write-Host "========================================"

if ($fail -eq 0) {
    Write-Host " RESULT: SMOKE OK" -ForegroundColor Green
} else {
    Write-Host " RESULT: SMOKE FAILED" -ForegroundColor Red
}
