@echo off
echo === Build de producao ===
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERRO no build.
    pause
    exit /b 1
)
echo.
echo === Build concluido com sucesso! ===
echo Arquivos gerados em: dist/
pause
