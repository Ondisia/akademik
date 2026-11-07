# Perintah Umum

## Backend (port 3000)
```bash
cd backend
npm install
cp .env.example .env        # isi JWT_SECRET di .env
npm run seed                # seed data demo (idempoten)
npm run dev                 # jalankan server http://localhost:3000
```

## Frontend (port 5173)
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

## Instalasi otomatis (semua)
- Windows: `setup.bat`
- Linux/macOS: `setup.sh`

## Pengujian backend
```bash
cd backend
node smoke-run.cjs          # uji otomatis peran + relasi (39 pemeriksaan)
node stress-test.js 80 25   # uji beban (butuh server berjalan)
node test-security.js       # uji keamanan
```

## Build frontend
```bash
cd frontend
npm run build               # type check + build produksi
npm run preview             # preview hasil build
```

## Catatan
- Backend gagal start jika `backend/.env` tidak memiliki `JWT_SECRET`.
- `backend/.env`, `*.db`, `node_modules`, `dist`, file log tidak di-commit.
- Akun demo dibuat oleh `npm run seed`. Lihat `README.md` bagian "Akun Login Demo".
