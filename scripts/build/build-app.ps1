# Estratégico Aero - Script de Build Automático
# Planejamento que Decola

$Host.UI.RawUI.WindowTitle = "Estratégico Aero - Build"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           ESTRATÉGICO AERO - BUILD AUTOMÁTICO                ║" -ForegroundColor Cyan
Write-Host "║              Planejamento que Decola                         ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Função para exibir status
function Show-Status {
    param([string]$Step, [string]$Message, [string]$Status = "info")
    
    $color = switch ($Status) {
        "success" { "Green" }
        "error" { "Red" }
        "warning" { "Yellow" }
        default { "White" }
    }
    
    $icon = switch ($Status) {
        "success" { "✓" }
        "error" { "✗" }
        "warning" { "!" }
        default { "→" }
    }
    
    Write-Host "[$Step] " -NoNewline -ForegroundColor Cyan
    Write-Host "$icon $Message" -ForegroundColor $color
}

# Verificar Node.js
Show-Status "1/5" "Verificando Node.js..."
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Show-Status "1/5" "Node.js não encontrado. Instale em https://nodejs.org" "error"
    Read-Host "Pressione Enter para sair"
    exit 1
}
Show-Status "1/5" "Node.js $nodeVersion encontrado" "success"

# Instalar dependências
Write-Host ""
Show-Status "2/6" "Instalando dependências..."
npm install --silent 2>$null
if ($LASTEXITCODE -ne 0) {
    Show-Status "2/6" "Falha ao instalar dependências" "error"
    Read-Host "Pressione Enter para sair"
    exit 1
}
Show-Status "2/6" "Dependências instaladas" "success"

# Gerar ícones
Write-Host ""
Show-Status "3/6" "Gerando ícones..."
node scripts/generate-icons.mjs 2>$null
if ($LASTEXITCODE -ne 0) {
    Show-Status "3/6" "Falha ao gerar ícones (usando existentes)" "warning"
} else {
    Show-Status "3/6" "Ícones gerados" "success"
}

# Build da aplicação web
Write-Host ""
Show-Status "4/6" "Compilando aplicação web..."
npm run build:electron 2>$null
if ($LASTEXITCODE -ne 0) {
    Show-Status "4/6" "Falha na compilação" "error"
    Read-Host "Pressione Enter para sair"
    exit 1
}
Show-Status "4/6" "Aplicação compilada" "success"

# Gerar executável
Write-Host ""
Show-Status "5/6" "Gerando instalador Windows (NSIS)..."
npx electron-builder --win 2>$null
if ($LASTEXITCODE -ne 0) {
    Show-Status "5/6" "Falha ao gerar executável" "error"
    Read-Host "Pressione Enter para sair"
    exit 1
}
Show-Status "5/6" "Instalador gerado" "success"

# Finalização
Write-Host ""
Show-Status "6/6" "Finalizando..."

$installer = Get-ChildItem "$PSScriptRoot\release\EstrategicoAero-Setup-*.exe" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $installer) {
    Show-Status "6/6" "Instalador não encontrado em release" "warning"
    Read-Host "Pressione Enter para sair"
    exit 1
}
$exeSize = [math]::Round($installer.Length / 1MB, 2)

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    BUILD CONCLUÍDO!                          ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║  Instalador: $($installer.Name)".PadRight(62) + "║" -ForegroundColor Green
Write-Host "║  Tamanho: $exeSize MB".PadRight(62) + "║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Abrir pasta release
Start-Process explorer.exe -ArgumentList "release"

Write-Host "Deseja abrir a pasta release? (S/N): " -NoNewline -ForegroundColor Yellow
$response = Read-Host
if ($response -eq "S" -or $response -eq "s") {
    Start-Process explorer.exe -ArgumentList "release"
}
