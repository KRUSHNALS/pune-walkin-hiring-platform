@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Script for Windows
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "DIR=%~dp0"
set "MAVEN_TOOL=%DIR%..\tools\apache-maven-3.9.9\bin\mvn.cmd"

if exist "%MAVEN_TOOL%" (
    call "%MAVEN_TOOL%" %*
    exit /b %ERRORLEVEL%
)

where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    call mvn %*
    exit /b %ERRORLEVEL%
)

echo Error: Maven executable not found at %MAVEN_TOOL% or on PATH.
exit /b 1
