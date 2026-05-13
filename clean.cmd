@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
if exist "_site" rmdir /s /q "_site"
cd /d "%~dp0api"
for /f "delims=" %%A in ('dir /b') do (
    if /i not "%%A"=="index.md" (
        if exist "%%A\*" (
            rmdir /s /q "%%A"
        ) else (
            del /q "%%A"
        )
    )
)
echo Cleanup completed. Deleted _site directory and all files in ./api except index.md
