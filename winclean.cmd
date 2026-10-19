@echo off
setlocal enabledelayedexpansion

REM =========================================================
REM Windows Cleaner CLI - Startup & Node.js Pre-Flight Check
REM =========================================================

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo ========================================================
    echo   [ERROR] Node.js is not installed or not in your PATH!
    echo ========================================================
    echo.
    echo Windows Cleaner CLI requires Node.js ^(version 18.0.0 or higher^).
    echo.
    echo You can install it quickly using Windows Package Manager ^(winget^):
    echo.
    echo   winget install OpenJS.NodeJS.LTS
    echo.
    echo Or download the official installer directly from:
    echo   https://nodejs.org/
    echo.
    set /p INSTALL_CHOICE="Would you like to install Node.js LTS now via winget? (Y/N): "
    if /i "!INSTALL_CHOICE!"=="Y" (
        echo.
        echo Launching winget installer...
        winget install OpenJS.NodeJS.LTS
        echo.
        echo Please restart your terminal after installation finishes and run this command again.
    )
    echo.
    exit /b 1
)

REM Check if project has been built
if not exist "%~dp0dist\bin.js" (
    echo [INFO] First time run detected: building project...
    call npm run build
)

REM Run CLI
node "%~dp0dist\bin.js" %*
