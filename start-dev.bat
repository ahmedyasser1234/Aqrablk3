@echo off
echo Starting Backend...
start "AqrabBackend" cmd /k "cd backend && npm run start"

echo Starting Frontend...
start "AqrabFrontend" cmd /k "npm run dev"

echo Both servers are starting in separate windows.
