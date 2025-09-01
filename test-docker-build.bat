@echo off
echo ========================================
echo Testing Docker Build for KrishiGhor
echo ========================================

echo.
echo This script will test the Docker build locally
echo to identify any remaining issues before deployment.
echo.

echo 1. Testing main Dockerfile...
docker build --no-cache --progress=plain -t krishighor:test . 2>&1 | tee build-main.log

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Main Dockerfile build SUCCESSFUL!
    echo.
    echo 2. Testing minimal Dockerfile...
    docker build --no-cache --progress=plain -f Dockerfile.minimal -t krishighor:minimal . 2>&1 | tee build-minimal.log
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ Minimal Dockerfile build SUCCESSFUL!
        echo.
        echo 🎉 All Dockerfiles are working correctly!
        echo Your project is ready for Render deployment.
    ) else (
        echo.
        echo ❌ Minimal Dockerfile build FAILED!
        echo Check build-minimal.log for details.
    )
) else (
    echo.
    echo ❌ Main Dockerfile build FAILED!
    echo Check build-main.log for details.
    echo.
    echo Trying minimal Dockerfile as fallback...
    docker build --no-cache --progress=plain -f Dockerfile.minimal -t krishighor:minimal . 2>&1 | tee build-minimal.log
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ Minimal Dockerfile build SUCCESSFUL!
        echo Consider using Dockerfile.minimal for deployment.
    ) else (
        echo.
        echo ❌ All Dockerfile builds FAILED!
        echo Check both log files for details.
    )
)

echo.
echo ========================================
echo Build Test Complete
echo ========================================
echo.
echo Log files created:
echo - build-main.log (main Dockerfile)
echo - build-minimal.log (minimal Dockerfile)
echo.
pause
