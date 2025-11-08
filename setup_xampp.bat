@echo off
echo ====================================
echo XAMPP Setup Script for Placement Portal
echo ====================================
echo.

echo Step 1: Checking if XAMPP is running...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL service is running
) else (
    echo [WARNING] MySQL service is not running. Please start XAMPP Control Panel and start MySQL
    pause
)

echo.
echo Step 2: Setting up environment file...
copy .env.xampp .env
if %ERRORLEVEL% == 0 (
    echo [OK] Environment file configured
) else (
    echo [ERROR] Failed to copy environment file
    pause
)

echo.
echo Step 3: Installing Python dependencies...
cd backend
echo Installing required packages...
pip install -r requirements.txt
cd ..

echo.
echo Step 4: Creating uploads directory...
if not exist "backend\uploads" mkdir "backend\uploads"
if not exist "backend\uploads\resumes" mkdir "backend\uploads\resumes"
if not exist "backend\uploads\offer_letters" mkdir "backend\uploads\offer_letters"
if not exist "backend\uploads\reports" mkdir "backend\uploads\reports"
if not exist "backend\uploads\company_logos" mkdir "backend\uploads\company_logos"
if not exist "backend\uploads\profile_images" mkdir "backend\uploads\profile_images"
echo [OK] Upload directories created

echo.
echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Open XAMPP Control Panel
echo 2. Start Apache and MySQL services
echo 3. Open http://localhost/phpmyadmin
echo 4. Import database/schema.sql into placement_portal database
echo 5. Run: cd backend && python app.py
echo 6. In new terminal: cd frontend && npm start
echo.
echo Access your application at: http://localhost:3000
echo.