@echo off
echo Starting ResuMatch Server...
echo.
call "%APPDATA%\Antigravity\bin\agy-node.cmd" "%~dp0server.js"
