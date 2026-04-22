# Deploy Planos de Ação PE2026
# Script PowerShell para Windows

$ErrorActionPreference = "Stop"

function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Blue }
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DEPLOY: Planos de Ação PE2026" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar dependências
Write-Info "Verificando dependências..."

$supabase = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabase) {
    $npxSupabase = Get-Command npx -ErrorAction SilentlyContinue
    if (-not $npxSupabase) {
        Write-Error "Supabase CLI não encontrado. Instale: npm install -g supabase"
        exit 1
    }
}

Write-Success "Dependências OK"
Write-Host ""

# Verificar se Docker está rodando
Write-Info "Verificando Docker..."
try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Warn "Docker não está rodando. Inicie o Docker Desktop primeiro."
        Write-Host ""
        Write-Host "Para aplicar os seeds manualmente mais tarde:"
        Write-Host "  1. Inicie o Docker Desktop"
        Write-Host "  2. Execute: npx supabase start"
        Write-Host "  3. Execute: npx supabase db reset"
        Write-Host "  4. Execute: python scripts/verify_all_action_plans.py"
        exit 0
    }
} catch {
    Write-Warn "Docker não está disponível"
    exit 0
}

Write-Success "Docker OK"
Write-Host ""

# Iniciar Supabase se necessário
Write-Info "Verificando Supabase..."
try {
    $status = npx supabase status 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Info "Iniciando Supabase..."
        npx supabase start
    }
} catch {
    Write-Info "Iniciando Supabase..."
    npx supabase start
}

Write-Success "Supabase OK"
Write-Host ""

# Reset do banco (aplica migrations + seeds)
Write-Info "Aplicando seeds no Supabase local..."
npx supabase db reset

Write-Success "Seeds aplicados com sucesso!"
Write-Host ""

# Validação
Write-Info "Validando dados..."
python scripts/verify_all_action_plans.py --verbose

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deploy concluído!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:"
Write-Host "  1. Inicie o app: npm run dev"
Write-Host "  2. Acesse: http://localhost:5173/planning/initiatives"
Write-Host "  3. Verifique os dados no Supabase Studio"
Write-Host ""
