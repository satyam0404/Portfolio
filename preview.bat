@echo off
echo ==============================================
echo   Launching Satyam's 3D Portfolio Locally
echo   Opening: http://localhost:5000/
echo ==============================================
start http://localhost:5000/
python -m http.server 5000
pause
