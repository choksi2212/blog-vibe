@echo off
echo.
echo ========================================
echo Devnovate Blog Platform - Database Setup
echo ========================================
echo.

REM Check if .env.local exists
if not exist "..\.env.local" (
    echo ERROR: .env.local file not found!
    echo Please create a .env.local file with your MongoDB connection string.
    echo.
    pause
    exit /b 1
)

echo Starting database setup...
echo.

REM Run the setup script
node run-all-setup.js

echo.
echo Database setup completed!
echo.
echo Next steps:
echo 1. Test the connection: npm run test:db
echo 2. Start the development server: npm run dev
echo 3. Visit http://localhost:3000
echo.
pause
