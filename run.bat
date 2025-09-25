@echo off
echo Starting HTML Email Editor Application...

REM Start backend server in a new window
start cmd /k "echo Starting Flask backend... & python app.py"

REM Wait for Flask to start
timeout /t 3 /nobreak > nul

REM Start frontend development server in a new window
start cmd /k "cd frontend && echo Installing frontend dependencies... & npm install --legacy-peer-deps && echo Starting frontend development server... & npm run dev"

echo.
echo HTML Email Editor is starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window (the application will continue running)
pause > nul
