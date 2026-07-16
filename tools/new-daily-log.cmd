@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0new-daily-log.ps1" %*
