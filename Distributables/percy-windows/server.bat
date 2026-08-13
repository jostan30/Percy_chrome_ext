@echo off
setlocal

set APP=server.exe
set PIDFILE=server.pid
set LOGFILE=server.log

if "%1"=="" goto usage
if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="status" goto status
goto usage

:start
if exist %PIDFILE% (
    echo Server appears to be running.
    echo If not, delete server.pid and try again.
    exit /b
)

echo Starting server...

start "" /B cmd /c "%APP% >> %LOGFILE% 2>&1"

REM Give the process a moment to start
timeout /t 2 /nobreak >nul

for /f "tokens=2" %%a in ('tasklist /fi "imagename eq %APP%" /fo list ^| find "PID:"') do (
    echo %%a>%PIDFILE%
    echo Server started. PID: %%a
    exit /b
)

echo Failed to start server.
exit /b

:stop
if not exist %PIDFILE% (
    echo Server is not running.
    exit /b
)

set /p PID=<%PIDFILE%
taskkill /PID %PID% /F

del %PIDFILE%

echo Server stopped.
exit /b

:status
if not exist %PIDFILE% (
    echo Server is not running.
    exit /b
)

set /p PID=<%PIDFILE%

tasklist /FI "PID eq %PID%" | find "%PID%" >nul

if errorlevel 1 (
    echo Server is not running.
) else (
    echo Server is running. PID: %PID%
)

exit /b

:restart
call %0 stop
timeout /t 1 /nobreak >nul
call %0 start
exit /b

:usage
echo Usage:
echo    server.bat start
echo    server.bat stop
echo    server.bat restart
echo    server.bat status