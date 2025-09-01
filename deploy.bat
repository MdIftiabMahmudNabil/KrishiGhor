@echo off
echo ========================================
echo KrishiGhor Deployment Preparation
echo ========================================

echo.
echo 1. Building project for production...
call build.bat

echo.
echo 2. Preparing Git repository...
git add .
git commit -m "Prepare for Render deployment - Fix build issues and optimize deployment"

echo.
echo 3. Pushing to remote repository...
git push origin main

echo.
echo ========================================
echo Deployment Preparation Complete!
echo ========================================
echo.
echo Next steps for Render deployment:
echo 1. Go to https://render.com
echo 2. Create a new Web Service
echo 3. Connect your GitHub repository
echo 4. Render will automatically detect the render.yaml
echo 5. Set your environment variables if needed
echo 6. Deploy!
echo.
echo Your project is now ready for Render deployment!
echo.
pause
