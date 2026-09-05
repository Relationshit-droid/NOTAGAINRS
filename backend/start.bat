@echo off
REM Backend startup script for Windows

echo 🚀 Starting Relationshit! Backend API...

REM Check for .env file
if not exist .env (
    echo ⚠️  No .env file found. Copying from .env.example...
    copy .env.example .env
    echo 📝 Please edit .env with your configuration values
    echo    Required: GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_* vars
    echo    Required: GEMINI_API_KEY
)

REM Check for service account
if not exist service-account.json (
    if "%GOOGLE_APPLICATION_CREDENTIALS%"=="" (
        if "%FIREBASE_PROJECT_ID%"=="" (
            echo ⚠️  No Firebase credentials found!
            echo    Option 1: Place service-account.json in this directory
            echo    Option 2: Set GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
            echo    Option 3: Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
            echo.
            echo    Continuing in fallback mode (in-memory storage)...
        )
    )
)

REM Create virtual environment if needed
if not exist venv (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

echo 📦 Activating virtual environment...
call venv\Scripts\activate.bat

echo 📦 Installing/updating dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

echo 🔥 Starting FastAPI server on port 8001...
echo    API docs: http://localhost:8001/docs
echo    Health:   http://localhost:8001/api/health
echo.

uvicorn server:app --host 0.0.0.0 --port 8001 --reload