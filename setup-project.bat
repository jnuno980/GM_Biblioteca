@echo off
echo ========================================
echo    Biblioteca GM - Setup do Projeto
echo ========================================
echo.

echo Verificando Node.js...
node --version >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao esta instalado!
    echo Instale Node.js 18+ em: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado

echo.
echo Instalando dependencias...
npm install

if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas

echo.
echo Copiando arquivo de ambiente...
if not exist ".env.local" (
    if exist "env.example" (
        copy "env.example" ".env.local"
        echo ✅ Arquivo .env.local criado
    ) else (
        echo AVISO: Arquivo env.example nao encontrado
    )
) else (
    echo ✅ Arquivo .env.local ja existe
)

echo.
echo ========================================
echo    Setup concluido com sucesso!
echo ========================================
echo.
echo Proximos passos:
echo 1. Execute: start-react-app.bat
echo 2. Ou execute: npm start
echo.
pause


