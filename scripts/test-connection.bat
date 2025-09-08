@echo off
echo.
echo ========================================
echo Devnovate Blog Platform - Database Test
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

echo Testing database connection...
echo.

REM Run the test script
node test-db-connection.js

echo.
echo Database test completed!
echo.
pause
