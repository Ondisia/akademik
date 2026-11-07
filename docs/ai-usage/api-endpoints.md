# Pola Endpoint REST API

Base URL backend: `http://localhost:3000`. Semua endpoint diawali `/api/<resource>`. Frontend memanggil melalui proxy Vite `/api` di `vite.config.ts`.

## Pola umum per resource
- `GET /api/<resource>` — daftar data (dibatasi scope per role)
- `GET /api/<resource>/:id` — detail satu data
- `POST /api/<resource>` — buat data baru
- `PUT /api/<resource>/:id` — ubah data
- `DELETE /api/<resource>/:id` — hapus data

## Resource yang tersedia (di `backend/routes/`)
`auth`, `students`, `teachers`, `schedules`, `grades`, `attendances`, `billings`, `announcements`, `ekskul`, `prestasi`, `settings`, `relations`.

## Autentikasi
- `POST /api/auth/login` — login, kembalikan token JWT
- `GET /api/auth/me` — data user login (butuh token)
- Token dikirim via header: `Authorization: Bearer <token>` (Axios interceptor otomatis)

## Relasi (via `/api/relations`)
- Orang tua ↔ siswa: `parent_students`
- Guru ↔ mapel + kelas: `teacher_assignments`

## Catatan
- Setiap route dilindungi middleware `auth.js` (JWT) dan `roleCheck.js` (hak akses role).
- Data dibatasi oleh `scope.js` sesuai role pengguna.
- Detail hak akses lengkap: `docs/roles-permissions.md`.
