@echo off
echo === Instalando dependencias ===
set PATH=%PATH%;C:\Program Files\nodejs
cd /d "%~dp0"
if exist node_modules rmdir /s /q node_modules
call "C:\Program Files\nodejs\npm.cmd" install
if %errorlevel% neq 0 (
    echo.
    echo ERRO na instalacao. Tente rodar como Administrador.
    pause
    exit /b 1
)
echo.
echo === Iniciando servidor de desenvolvimento ===
call "C:\Program Files\nodejs\npm.cmd" run dev
pause
