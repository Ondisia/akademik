@echo off
echo === SISTEM AKADEMIK SEKOLAH - AUTOMATIC SETUP ===

echo [1/4] Installing Backend dependencies...
cd backend
call npm install
node scripts/seedAdmin.js
cd ..

echo [2/4] Installing Frontend dependencies...
cd frontend
call npm install
cd ..

echo [3/4] Creating environment files...
if not exist backend\.env (
    copy backend\.env.example backend\.env
)
if not exist frontend\.env (
    copy frontend\.env.example frontend\.env
)

echo [4/4] Setup completed successfully!
echo.
echo TO START THE APP:
echo 1. Backend:  cd backend ^&^& npm run dev
echo 2. Frontend: cd frontend ^&^& npm run dev
echo.
pause
