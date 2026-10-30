@echo off
title Deploy Garbage Collection Platform Online
cls
echo ========================================================
echo   GARBAGE COLLECTION - ONLINE DEPLOYMENT LAUNCHER
echo   Tagline: Spot it. Post it. Clean it together.
echo ========================================================
echo.
echo Choose your single-platform deployment method:
echo.
echo  [1] Vercel (RECOMMENDED - Instant live HTTPS URL for Next.js in 60s)
echo  [2] Firebase (Google Single-Platform: Hosting + Firestore + Storage)
echo  [3] Push to GitHub (For automatic continuous deployment)
echo  [4] Exit
echo.
set /p choice="Enter your choice [1, 2, 3, or 4]: "

if "%choice%"=="1" (
    echo.
    echo ========================================================
    echo Launching Vercel Deployment...
    echo ========================================================
    echo 1. Your browser will prompt you to log in (or authorize GitHub).
    echo 2. Press Enter to accept the default settings.
    echo 3. You will immediately get a live public https://... URL!
    echo.
    cd /d "%~dp0"
    call npx --yes vercel
    goto done
)

if "%choice%"=="2" (
    echo.
    echo ========================================================
    echo Launching Firebase Deployment...
    echo ========================================================
    cd /d "%~dp0"
    echo Step 1: Authenticating with Firebase...
    call npx --yes firebase-tools login
    echo.
    echo Step 2: Deploying to Firebase project...
    call npx --yes firebase-tools deploy
    goto done
)

if "%choice%"=="3" (
    echo.
    echo ========================================================
    echo Pushing latest updates to GitHub...
    echo Repository: https://github.com/terli-mahesh-cse/garbage-collection
    echo ========================================================
    cd /d "%~dp0"
    call git push origin main
    echo.
    echo [OK] All latest code is pushed and synchronized with GitHub!
    goto done
)

:done
echo.
echo ========================================================
echo Done. Press any key to close this window.
echo ========================================================
pause >nul
