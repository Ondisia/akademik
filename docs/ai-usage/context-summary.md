# Konteks Proyek untuk AI

## Proyek
Sistem Akademik SMK — manajemen akademik sekolah menengah kejuruan.

## Arsitektur
Decoupled client-server REST API.

- Frontend (Vue 3 SPA, `:5173`) → HTTP/JSON → Backend (Express.js, `:3000`) → SQLite (`school.db`, WAL mode, foreign keys ON)

## Stack utama
- Backend: Node.js, Express v5, better-sqlite3, JWT (jsonwebtoken), bcryptjs, dotenv, cors
- Frontend: Vue 3 (Composition API, `<script setup>`), TypeScript strict, Vite, Tailwind CSS, Pinia, Vue Router, Axios

## Fitur inti
Manajemen siswa, guru, kelas, jadwal, nilai, absensi, pengumuman, ekskul & prestasi, tagihan/pembayaran, komunikasi, dashboard, pengaturan kontak bantuan.

## Peran (role)
`admin`, `kepala_sekolah`, `waka`, `kepala_tu`, `staff_tu`, `guru_mapel`, `guru`, `wali_kelas`, `siswa`, `orang_tua`. Setiap role hanya lihat/ubah data yang berwenang (RBAC). Detail: `docs/roles-permissions.md`.

## Relasi data (via `/api/relations`, belum ada UI)
- `parent_students(parent_id, student_id)`
- `teacher_assignments(id, teacher_id, subject, class)`

## File kunci
- `backend/server.js`, `backend/app.js` — entry Express
- `backend/database.js` — skema SQLite + migrasi idempotent
- `backend/scope.js` — aturan pembatasan data per role
- `backend/middleware/auth.js`, `backend/middleware/roleCheck.js` — JWT + role guard
- `backend/routes/` — route per entitas
- `backend/scripts/seedDemo.js` — seed data demo
- `frontend/src/router/index.ts` — route + guard per role
- `frontend/src/services/api.js` — Axios + interceptor JWT
- `frontend/src/stores/` — Pinia stores
- `frontend/src/features/` — halaman per modul
- `frontend/src/components/layout/AppLayout.vue` — sidebar per kategori + role

## Jalankan
Backend: `cd backend && npm install && cp .env.example .env && npm run seed && npm run dev`
Frontend: `cd frontend && npm install && npm run dev`
Uji: `cd backend && node smoke-run.cjs` (39 pemeriksaan), `cd frontend && npm run build`
