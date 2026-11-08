@echo off
rem CI entry point for Windows. Called by .github/workflows/ci.yml
rem and can be run locally: ci.bat
setlocal
cd /d "%~dp0"

echo == [1/4] install dependencies ==
if exist package-lock.json (call npm ci) else (call npm install)
if errorlevel 1 exit /b 1

echo == [2/4] unit tests (Jest) ==
call npm test
if errorlevel 1 exit /b 1

echo == [3/4] build executable ==
call npm run build
if errorlevel 1 exit /b 1

echo == [4/4] run executable ==
build\hello.exe
if errorlevel 1 exit /b 1
echo CI OK
