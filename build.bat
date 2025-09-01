@echo off
echo Building KrishiGhor for production...

echo.
echo 1. Installing PHP dependencies...
composer install --no-dev --optimize-autoloader

echo.
echo 2. Installing Node.js dependencies...
npm install

echo.
echo 3. Building CSS assets...
npm run build:css

echo.
echo 4. Build complete!
echo.
echo To deploy to Render:
echo 1. Commit and push your changes
echo 2. Connect your repository to Render
echo 3. Deploy using the render.yaml configuration
echo.
echo Your project is now ready for deployment!
pause
