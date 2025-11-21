@echo off
echo ========================================
echo Starting Movie Predictor Backend (FastAPI)
echo ========================================
echo.

cd backend
echo Installing Python dependencies...
pip install -r requirements.txt
echo.

echo Starting FastAPI server on http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.

python main.py

