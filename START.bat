@echo off
title Garbage Collection Platform
cls
echo ========================================================
echo   GARBAGE COLLECTION - COMMUNITY CLEAN CITY PLATFORM
echo   Tagline: Spot it. Post it. Clean it together.
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking project files...
if not exist "node_modules" (
    echo [INFO] Installing required dependencies...
    call npm install
)

if not exist ".next" (
    echo [INFO] Compiling production build...
    call npm run build
)

echo [2/3] Checking if server is already running on port 3000...
powershell -NoProfile -Command "try { $res = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2; if ($res.StatusCode -eq 200) { exit 0 } } catch { exit 1 }"

if %ERRORLEVEL% EQU 0 (
    echo [OK] Server is already active!
    echo [3/3] Opening browser at http://localhost:3000...
    start http://localhost:3000
    echo.
    echo Platform is open in your browser.
    echo Press any key to exit this launcher window.
    pause >nul
    exit /b
)

echo [3/3] Launching Garbage Collection server...
echo.
echo Opening http://localhost:3000 in your browser in 2 seconds...
echo (Keep this window open while using the app. Close it or press Ctrl+C to stop.)
echo.

start /b powershell -NoProfile -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'"

call npm run start
