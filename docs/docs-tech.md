# Dokumentasi Teknis Sistem Akademik Sekolah (Akademik-Sekolah-Dengan-DB)

Dokumentasi ini merangkum tech stack, fungsionalitas sistem, dan arsitektur teknis dari proyek **Akademik-Sekolah-Dengan-DB**.

---

## 1. Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (v5.x)
- **Database:** SQLite (`better-sqlite3`) dengan mode WAL (Write-Ahead Logging) aktif dan dukungan foreign keys.
- **Autentikasi & Keamanan:** JSON Web Token (JWT) untuk manajemen sesi, `bcryptjs` untuk hashing password.
- **Utilitas:** `dotenv` untuk pengelolaan environment variables, `cors` untuk pengelolaan CORS.

### Frontend
- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Bahasa:** TypeScript / JavaScript
- **Build Tool / Bundler:** Vite
- **Styling:** Tailwind CSS + PostCSS / Autoprefixer
- **State Management:** Pinia
- **Routing:** Vue Router (dengan Navigation Guards untuk autentikasi dan otorisasi berdasarkan role)
- **HTTP Client:** Axios (dengan interceptor otomatis menyertakan token JWT pada header `Authorization`)

### Development Tools
- **Hot Reload:** Nodemon (Backend), Vite HMR (Frontend)
- **Manajemen Skrip Otomatis:** Skrip instalasi lintas platform (`setup.bat` untuk Windows dan `setup.sh` untuk Linux/macOS).

---

## 2. Kegunaan dan Fungsi Sistem

Sistem Akademik Sekolah ini dirancang untuk mendigitalkan dan mengintegrasikan manajemen operasional sekolah menengah (SMK). Fitur utama meliputi:

1. **Autentikasi & Manajemen Pengguna (Auth):**
   - Login berbasis peran (Role-Based Access Control - RBAC).
   - Akun default administrator tersedia untuk pengelolaan awal (`admin@example.com` / `Password123`).
   
2. **Manajemen Data Siswa & Guru:**
   - Pencatatan data siswa (NISN/NIUP, kelas, jenis kelamin, status keaktifan).
   - Pencatatan data guru, mata pelajaran yang diampu, serta daftar kelas.

3. **Akademik & Penilaian:**
   - Manajemen Jadwal Pelajaran per kelas, waktu, ruangan, dan guru pengajar.
   - Pencatatan Nilai Siswa per mata pelajaran.
   - Pencatatan Absensi (Kehadiran: Hadir, Izin, Sakit, Alpha) beserta catatan tambahan.

4. **Keuangan & Pembayaran (Billing):**
   - Pengelolaan tagihan pembayaran siswa (SPP/iuran sekolah) beserta status (requested, paid, dll.).
   - Unggah bukti pembayaran.

5. **Komunikasi & Pengumuman:**
   - Modul pengumuman sekolah untuk menyebarkan informasi penting kepada warga sekolah.
   - Pengaturan kontak darurat dan informasi sekolah.

---

## 3. Arsitektur Teknis

Arsitektur aplikasi ini menggunakan pola **Decoupled Client-Server (REST API)** yang bersih:

```
┌──────────────┐          HTTP / JSON          ┌──────────────────┐          SQLite PRAGMA WAL         ┌─────────────────┐
│  Frontend    │ ─────────────────────────────>│   Backend API    │ ─────────────────────────────────> │   Database      │
│  (Vue 3 SPA) │ <─────────────────────────────│   (Express.js)   │ <───────────────────────────────── │   (school.db)   │
└──────────────┘                               └──────────────────┘                                    └─────────────────┘
```

### Penjelasan Komponen Arsitektur:

1. **Lapisan Penyimpanan Data (Database Layer):**
   - Menggunakan **SQLite** melalui library berperforma tinggi `better-sqlite3`.
   - Konfigurasi database mengaktifkan mode WAL (`journal_mode = WAL`) untuk konkurensi baca-tulis yang optimal serta mengaktifkan integritas relasional (`foreign_keys = ON`).
   - Skrip inisialisasi (`backend/database.js` & `backend/scripts/`) secara otomatis membuat tabel-tabel utama (`users`, `students`, `teachers`, `announcements`, `grades`, `attendances`, `schedules`, `bills`, `settings`).

2. **Lapisan Layanan Backend (API Server):**
   - Dibangun menggunakan **Express.js**, terstruktur dengan pola modular (Routes dipisah per entitas di folder `backend/routes/`).
   - Melindungi rute sensitif menggunakan middleware verifikasi token JWT (`backend/middleware/auth.js`).
   - Berkomunikasi dengan klien melalui respons berformat JSON.

3. **Lapisan Antarmuka Pengguna (Frontend SPA):**
   - Dibangun sebagai Single Page Application (SPA) menggunakan **Vue 3** dan **TypeScript**.
   - **Vite Proxy:** Mengonfigurasi proxy pada `vite.config.ts` untuk mengarahkan request `/api` dari port frontend (`5173`) ke backend (`3000`) guna menghindari masalah CORS saat pengembangan lokal.
   - **Pinia Stores:** Mengelola state aplikasi secara terpusat (autentikasi, data siswa, nilai, absensi, tagihan, dll.).
   - **Axios Service Layer:** Menyediakan klien HTTP terpusat dengan interceptor yang secara otomatis menyisipkan token JWT dari penyimpanan lokal/store ke setiap permintaan API yang membutuhkan autentikasi.
