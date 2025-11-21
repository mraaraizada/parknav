@echo off
echo ========================================
echo Starting Movie Predictor Frontend (Vite + React)
echo ========================================
echo.

cd frontend

if not exist "node_modules" (
    echo Installing Node.js dependencies...
    call npm install
    echo.
)

echo Starting Vite dev server on http://localhost:3000
echo.

call npm run dev

