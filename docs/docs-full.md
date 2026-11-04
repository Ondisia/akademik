# SISTEM AKADEMIK SEKOLAH SMK
## Dokumentasi Lengkap - Tech Stack, Fungsi, & Permasalahan Lapangan

---

## 1. TEKNOLOGI YANG DIGUNAKAN

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (v5.x)
- **Database:** SQLite (better-sqlite3) dengan mode WAL dan foreign keys
- **Autentikasi:** JWT + bcryptjs
- **Utilitas:** dotenv (env), cors (CORS handling)

### Frontend
- **Framework:** Vue 3 (Composition API + `<script setup>`)
- **Bahasa:** TypeScript / JavaScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + PostCSS
- **State Management:** Pinia
- **Routing:** Vue Router (dengan Navigation Guards berbasis role)
- **HTTP Client:** Axios (dengan interceptor otomatis menyertakan token JWT)

### Development Tools
- Nodemon (backend hot reload), Vite HMR (frontend hot reload)
- Skrip instalasi otomatis: `setup.bat` (Windows) dan `setup.sh` (Linux/macOS)

---

## 2. FUNGSI SISTEM

| Modul | Keterangan |
|-------|------------|
| Autentikasi | Login & register berbasis role (admin, guru, siswa, orang tua); admin dari email khusus |
| Siswa & Kelas | CRUD siswa, kelas, jurusan |
| Guru & Mapel | CRUD guru, mata pelajaran, penugasan guru-mapel |
| Jadwal | Jadwal per kelas, guru, hari |
| Nilai | Input nilai tugas, UTS, UAS, praktik |
| Absensi | Presensi hadir/izin/sakit/alpha |
| Pengumuman | Buat/edit pengumuman oleh guru |
| Pembayaran | Tagihan SPP, status pembayaran, unggah bukti bayar |

---

## 3. ARSITEKTUR

```
Frontend (Vue 3 SPA)  --HTTP/JSON-->  Backend API (Express)  -->  SQLite DB
Port 5173                 REST API       Port 3000               school.db
```

**Penjelasan:**
- **Database Layer:** SQLite dengan WAL mode untuk konkurensi baca-tulis optimal. Skema dibuat otomatis saat backend pertama kali dijalankan.
- **API Server:** Express modular, setiap entitas punya route sendiri di `backend/routes/`. Semua endpoint sensitif dilindungi middleware JWT.
- **Frontend SPA:** Pinia stores mengelola state terpusat. Axios service layer memiliki interceptor otomatis menyisipkan token JWT. Vite proxy mengarahkan `/api` ke `localhost:3000`.

---

## 4. PERMASALAHAN DI LAPANGAN (SEKOLAH SMK INDONESIA)

### 4a. Fragmentasi Data Akademik
**Masalah:** Data siswa, guru, kelas, dan jadwal tersimpan terpisah di file Excel masing-masing wali kelas -> inkonsistensi data (jumlah siswa di buku induk != rekap absensi). Mutasi & kenaikan kelas manual memakan waktu berhari-hari. Beban administratif guru tinggi.

**Solusi:** Database terpusat SQLite dengan REST API, antarmuka web real-time untuk pencarian, filter, dan pembaruan data.

### 4b. Absensi Manual (Buku Kelas)
**Masalah:** Absensi kertas rawan hilang, rusak, atau dimanipulasi siswa (titip absen). Rekapitulasi bulanan butuh jam-jam kerja guru piket. Orang tua baru tahu anak bolos saat rapor akhir semester.

**Solusi:** Modul absensi digital harian, rekapitulasi otomatis persentase kehadiran, transparansi real-time untuk orang tua.

### 4c. Arsip Nilai Tercecer
**Masalah:** Nilai disimpan di lembaran kertas atau flashdisk Excel yang sering corrupt. SMK butuh penilaian kompleks (teori, praktik bengkel, portofolio, sikap) -> salah hitung bobot sering terjadi. Siswa & orang tua sulit pantau nilai selama semester.

**Solusi:** Modul input nilai terstruktur per mapel & siswa, transparansi nilai bagi siswa dan admin.

### 4d. Pembayaran SPP Manual
**Masalah:** Pencatatan buku kwitansi rangkap, risiko human error & uang selisih. Tunggakan SPP menumpuk tanpa deteksi dini. Gesekan sosial dengan orang tua karena tagihan kurang transparan.

**Solusi:** Modul tagihan & pembayaran terintegrasi, status lunas/belum transparan, riwayat pembayaran akurat untuk audit.

---

## 5. KESIMPULAN

Aplikasi ini menjawab 4 kebutuhan utama sekolah SMK:
1. **Sentralisasi data** - menghilangkan silo data antar-guru/wali kelas
2. **Efisiensi waktu** - memangkas rekapitulasi absensi, nilai, keuangan hingga 80%
3. **Transparansi** - akses informasi jelas bagi admin, guru, siswa, dan orang tua
4. **Deployment ringan** - SQLite + Node.js + Vue 3 bisa jalan di server terbatas tanpa biaya lisensi mahal

---

## 6. STRUKTUR PROYEK

```
Akademik-Sekolah-Dengan-DB/
+-- setup.bat / setup.sh     # Instalasi otomatis
+-- README.md                # Panduan cepat
+-- TEAM-DOCS.md             # Struktur tim 4 orang
+-- backend/
|   +-- server.js            # Entry point
|   +-- database.js          # Skema tabel SQLite
|   +-- middleware/auth.js    # JWT verification
|   +-- routes/
|   |   +-- auth.js, students.js, teachers.js
|   |   +-- grades.js, attendances.js, schedules.js
|   |   +-- billings.js, announcements.js, settings.js
|   +-- scripts/
|       +-- seedAdmin.js      # Seed admin default
+-- frontend/
    +-- src/
    |   +-- main.ts
    |   +-- router/index.ts   # Routes + guards
    |   +-- stores/           # Pinia state
    |   +-- services/api.js   # Axios + JWT interceptor
    |   +-- composables/
    |   +-- features/         # Modular pages
    |   +-- components/ui/
    +-- vite.config.ts        # Proxy /api to :3000
```

---

## 7. CARA INSTALASI & MENJALANKAN

```bash
# Instalasi satu klik
setup.bat              # Windows
./setup.sh             # Linux/macOS

# Jalankan backend (Terminal 1)
cd backend && npm run dev

# Jalankan frontend (Terminal 2)
cd frontend && npm run dev
```

**Login default:** `admin@example.com` / `Password123`
