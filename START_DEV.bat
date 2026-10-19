@echo off
title Garbage Collection Platform (Dev Mode)
cls
echo ========================================================
echo   GARBAGE COLLECTION - DEVELOPMENT MODE (HOT RELOAD)
echo ========================================================
echo.

cd /d "%~dp0"

echo Opening http://localhost:3000 in your browser...
start /b powershell -NoProfile -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"

call npm run dev
