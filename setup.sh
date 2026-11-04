#!/bin/bash
echo "=== SISTEM AKADEMIK SEKOLAH - AUTOMATIC SETUP ==="

echo "[1/4] Installing Backend dependencies..."
cd backend
npm install
node scripts/seedAdmin.js
cd ..

echo "[2/4] Installing Frontend dependencies..."
cd frontend
npm install
cd ..

echo "[3/4] Creating environment files..."
[ ! -f backend/.env ] && cp backend/.env.example backend/.env
[ ! -f frontend/.env ] && cp frontend/.env.example frontend/.env

echo "[4/4] Setup completed successfully!"
echo ""
echo "TO START THE APP:"
echo "1. Backend:  cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
