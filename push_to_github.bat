@echo off
echo ==========================================
echo   ORYXEN - Pushing to ad1xm/oryxen
echo ==========================================
echo.
echo Current Identity:
git config user.name
git config user.email
echo.
echo IF THE WINDOW DOES NOT OPEN:
echo 1. It means you are already logged in as the wrong user.
echo 2. Run: "git credential-manager uninstall" (if needed) to reset.
echo.
echo Trying to push now... a window should pop up...
echo.
git push -u origin main
echo.
echo ==========================================
echo   Status:
echo   If you see "Success", it worked!
echo   If you see "Permission denied", you need to log out of the old account.
echo ==========================================
pause
