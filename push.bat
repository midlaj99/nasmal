@echo off
title Push Nasmal to GitHub (midlaj99)
echo ========================================================
echo   Pushing Nasmal Tourism to GitHub as midlaj99
echo   User:  midlaj99 ^<muhammedmidlaj561@gmail.com^>
echo   Repo:  https://github.com/devjalal/nasmal.git
echo ========================================================
echo.

cd /d "%~dp0"

echo 1. Configuring Git identity...
git config user.name "midlaj99"
git config user.email "muhammedmidlaj561@gmail.com"
echo.

echo 2. Checking git status...
git status
echo.

echo 3. Staging changes...
git add .
echo.

echo 4. Committing as midlaj99...
git commit --author="midlaj99 <muhammedmidlaj561@gmail.com>" -m "feat: complete backend hardening, security headers, WAF, 3-strike lockout, OTP reset, dynamic package details, and performance optimizations"
echo.

echo 5. Ensuring main branch...
git branch -M main
echo.

echo 6. Pushing to origin main...
git push -u origin main
echo.

echo ========================================================
echo   Done! Check your repository:
echo   https://github.com/devjalal/nasmal
echo ========================================================
pause
