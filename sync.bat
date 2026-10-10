@echo off
echo ==============================================
echo   Pushing Portfolio Updates to GitHub
echo ==============================================
git status
echo.
set /p commit_msg="Enter commit message (or press Enter for 'update portfolio'): "
if "%commit_msg%"=="" set commit_msg=update portfolio
echo.
echo Staging and committing changes...
git add .
git commit -m "%commit_msg%"
echo.
echo Pushing to GitHub (origin main)...
git push origin main
echo.
echo ==============================================
echo   SUCCESS! Your updates are live on GitHub:
echo   https://satyam0404.github.io/Portfolio/
echo ==============================================
pause
