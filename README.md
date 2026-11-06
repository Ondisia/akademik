# Sistem Akademik SMK

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Vue-3-4FC08D?style=for-the-badge&logo=vue.js" alt="Vue 3"/>
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite" alt="SQLite"/>
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS"/>
</p>

<p align="center">
  <b>Aplikasi manajemen akademik sekolah</b> dengan backend Express.js + SQLite dan frontend Vue 3 + Tailwind CSS.<br/>
  Setiap peran sekolah hanya melihat dan mengubah data yang berwenang.
</p>

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Peran yang Didukung](#-peran-yang-didukung)
- [Akun Login Demo](#-akun-login-demo)
- [Hak Akses Singkat](#-hak-akses-singkat)
- [Cara Menjalankan](#-cara-menjalankan)
- [Relasi Data](#-relasi-data)
- [Struktur Proyek](#-struktur-proyek)
- [Pengujian](#-pengujian)
- [Dokumentasi Lengkap](#-dokumentasi-lengkap)
- [Catatan](#-catatan)

---

## 🚀 Fitur Utama

| Modul | Keterangan |
|-------|------------|
| **Manajemen Data** | Siswa, kelas, jurusan, guru, mata pelajaran, jadwal |
| **Nilai & Absensi** | Input nilai per mata pelajaran, presensi harian, rekapitulasi |
| **Ekskul & Prestasi** | Kegiatan ekstrakurikuler dan prestasi siswa |
| **Tagihan & Pembayaran** | SPP, status lunas/belum, unggah bukti bayar |
| **Pengumuman & Komunikasi** | Informasi sekolah dan pesan antar role |
| **Laporan** | Ekspor data ke CSV |
| **Pembatasan Peran** | Setiap role hanya akses data yang berwenang |

---

## 👥 Peran yang Didukung

<table>
  <tr>
    <th>Peran</th>
    <th>Nilai Role</th>
    <th>Tanggung jawab inti</th>
  </tr>
  <tr>
    <td>Administrator</td>
    <td><code>admin</code></td>
    <td>Akses penuh sistem</td>
  </tr>
  <tr>
    <td>Kepala Sekolah</td>
    <td><code>kepala_sekolah</code></td>
    <td>Pimpinan, monitoring semua modul</td>
  </tr>
  <tr>
    <td>Wakil Kepala Sekolah</td>
    <td><code>waka</code></td>
    <td>Pimpinan, monitoring semua modul</td>
  </tr>
  <tr>
    <td>Kepala Tata Usaha</td>
    <td><code>kepala_tu</code></td>
    <td>Tata usaha, keuangan, data siswa</td>
  </tr>
  <tr>
    <td>Staf Tata Usaha</td>
    <td><code>staff_tu</code></td>
    <td>Tata usaha, keuangan, data siswa</td>
  </tr>
  <tr>
    <td>Guru Mapel</td>
    <td><code>guru_mapel</code></td>
    <td>Nilai dan absensi pada mapel + kelas yang diampu</td>
  </tr>
  <tr>
    <td>Guru</td>
    <td><code>guru</code></td>
    <td>Role lama, dipertahankan untuk kompatibilitas</td>
  </tr>
  <tr>
    <td>Wali Kelas</td>
    <td><code>wali_kelas</code></td>
    <td>Siswa di kelasnya; lihat tagihan (tidak boleh tulis)</td>
  </tr>
  <tr>
    <td>Siswa</td>
    <td><code>siswa</code></td>
    <td>Data dan nilai/absensi sendiri</td>
  </tr>
  <tr>
    <td>Orang Tua</td>
    <td><code>orang_tua</code></td>
    <td>Data dan tagihan anaknya saja</td>
  </tr>
</table>

---

## 🔑 Akun Login Demo

Semua akun dibuat oleh `npm run seed`. Password peka huruf besar/kecil.

<table>
  <tr>
    <th>Peran</th>
    <th>Email</th>
    <th>Password</th>
    <th>Catatan</th>
  </tr>
  <tr>
    <td>Administrator</td>
    <td><code>admin@example.com</code></td>
    <td><code>Password123</code></td>
    <td>Akses penuh</td>
  </tr>
  <tr>
    <td>Kepala Sekolah</td>
    <td><code>kepsek@smk.id</code></td>
    <td><code>Password123</code></td>
    <td>Pimpinan</td>
  </tr>
  <tr>
    <td>Wakil Kepala Sekolah</td>
    <td><code>waka@smk.id</code></td>
    <td><code>Password123</code></td>
    <td>Pimpinan</td>
  </tr>
  <tr>
    <td>Wali Kelas</td>
    <td><code>wali1@smk.id</code></td>
    <td><code>Password123</code></td>
    <td>Kelas X RPL 1</td>
  </tr>
  <tr>
    <td>Guru Mapel</td>
    <td><code>guru1@smk.id</code></td>
    <td><code>Password123</code></td>
    <td>Informatika + Pemrograman Web, X RPL 1</td>
  </tr>
  <tr>
    <td>Guru</td>
    <td><code>guru@smk.id</code></td>
    <td><code>guru123</code></td>
    <td>Role lama</td>
  </tr>
  <tr>
    <td>Kepala Tata Usaha</td>
    <td><code>kepalatu@smk.id</code></td>
    <td><code>Password123</code></td>
    <td>Keuangan + data siswa</td>
  </tr>
  <tr>
    <td>Staf Tata Usaha</td>
    <td><code>stafftu@smk.id</code></td>
    <td><code>Password123</code></td>
    <td>Keuangan + data siswa</td>
  </tr>
  <tr>
    <td>Siswa</td>
    <td><code>siswa@smk.id</code></td>
    <td><code>siswa123</code></td>
    <td>Demo, data sendiri</td>
  </tr>
  <tr>
    <td>Orang Tua</td>
    <td><code>ortu@smk.id</code></td>
    <td><code>ortu123</code></td>
    <td>Anak: std-001 dan std-002</td>
  </tr>
</table>

Contoh uji login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wali1@smk.id","password":"Password123"}'
```

---

## 🔒 Hak Akses Singkat

Baca = boleh membuka halaman. Tulis = boleh tambah/ubah/hapus.

<table>
  <tr>
    <th>Fitur</th>
    <th>Baca</th>
    <th>Tulis</th>
  </tr>
  <tr>
    <td>Dashboard</td>
    <td>semua role</td>
    <td>admin, kepala_sekolah, waka</td>
  </tr>
  <tr>
    <td>Siswa</td>
    <td>admin, pimpinan, TU, wali_kelas (kelasnya), guru_mapel/guru (kelas diampu), siswa (diri), orang_tua (anak)</td>
    <td>admin, kepala_tu, staff_tu</td>
  </tr>
  <tr>
    <td>Kelas</td>
    <td>admin, pimpinan, TU, wali_kelas, guru_mapel, guru</td>
    <td>admin, kepala_tu, staff_tu</td>
  </tr>
  <tr>
    <td>Guru</td>
    <td>admin, pimpinan, TU, staff_tu</td>
    <td>admin</td>
  </tr>
  <tr>
    <td>Jadwal</td>
    <td>semua role</td>
    <td>admin, kepala_sekolah, waka</td>
  </tr>
  <tr>
    <td>Absensi</td>
    <td>semua role (data dibatasi)</td>
    <td>admin, pimpinan, guru_mapel/guru (kelas diampu), wali_kelas (kelasnya)</td>
  </tr>
  <tr>
    <td>Nilai</td>
    <td>semua role (data dibatasi)</td>
    <td>admin, pimpinan, guru_mapel/guru (mapel+kelas diampu), wali_kelas (kelasnya)</td>
  </tr>
  <tr>
    <td>Pengumuman</td>
    <td>semua role</td>
    <td>admin, kepala_sekolah, waka</td>
  </tr>
  <tr>
    <td>Komunikasi</td>
    <td>semua role</td>
    <td>admin, pimpinan, guru_mapel, wali_kelas, guru</td>
  </tr>
  <tr>
    <td>Tagihan</td>
    <td>admin, pimpinan, TU, wali_kelas (lihat), siswa (sendiri), orang_tua (anak)</td>
    <td>admin, kepala_tu, staff_tu</td>
  </tr>
  <tr>
    <td>Ekskul & Prestasi</td>
    <td>semua role</td>
    <td>admin, kepala_sekolah, waka</td>
  </tr>
</table>

> **Aturan penting:**
> - `guru_mapel` dan `guru` **tidak** boleh mengakses Tagihan (`GET /api/bills` → `403`).
> - `wali_kelas` hanya boleh **melihat** Tagihan siswanya, tidak boleh tulis.
> - `orang_tua` hanya boleh mengunggah bukti bayar untuk tagihan anaknya.
> - Detail lengkap: [`docs/roles-permissions.md`](docs/roles-permissions.md).

---

## 🗄️ Relasi Data

<table>
  <tr>
    <th>Tabel</th>
    <th>Isi</th>
  </tr>
  <tr>
    <td><code>parent_students(parent_id, student_id)</code></td>
    <td>Orang tua ↔ anak (banyak anak diperbolehkan)</td>
  </tr>
  <tr>
    <td><code>teacher_assignments(id, teacher_id, subject, class)</code></td>
    <td>Mapel + kelas yang diampu guru</td>
  </tr>
</table>

Kelola lewat API `/api/relations` (belum ada halaman UI).

---

## 📁 Struktur Proyek

```
akademik/
+-- backend/
|   +-- server.js              # Entry point Express
|   +-- database.js            # Skema SQLite + migrasi idempotent
|   +-- scope.js               # Aturan pembatasan data per peran
|   +-- middleware/            # JWT auth + roleCheck
|   +-- routes/                # auth, siswa, guru, nilai, absensi, tagihan, ...
|   +-- scripts/seedDemo.js    # Seed data demo (idempoten)
|   +-- smoke-run.cjs          # Uji otomatis peran + relasi (39 pemeriksaan)
|   +-- stress-test.js         # Uji beban
+-- frontend/
|   +-- src/
|   |   +-- router/index.ts    # Route + guard per peran
|   |   +-- stores/            # Pinia
|   |   +-- services/api.js    # Axios + interceptor JWT
|   |   +-- components/layout/AppLayout.vue  # Sidebar per kategori + peran
|   |   +-- features/          # Halaman per modul
|   +-- vite.config.ts         # Proxy /api ke :3000
+-- docs/
```

---

## ▶️ Cara Menjalankan

Butuh Node.js 18+.

### Terminal 1 — Backend

```bash
cd backend
npm install
cp .env.example .env        # isi JWT_SECRET
npm run seed                # data demo (idempoten)
npm run dev                 # http://localhost:3000
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Alternatif pakai skrip instalasi otomatis: `setup.bat` (Windows) / `setup.sh` (Linux/macOS).

Backend menolak start jika `backend/.env` tidak memiliki `JWT_SECRET`. Lihat `backend/.env.example`.

---

## 🧪 Pengujian

```bash
cd backend
node smoke-run.cjs      # uji otomatis peran + relasi (39 pemeriksaan)
node stress-test.js 80 25  # uji beban (butuh server berjalan)

cd ../frontend
npm run build           # type check + build produksi
```

---

## 📚 Dokumentasi Lengkap

<table>
  <tr>
    <th>File</th>
    <th>Isi</th>
  </tr>
  <tr>
    <td><a href="docs/roles-permissions.md"><code>roles-permissions.md</code></a></td>
    <td>Matriks hak akses lengkap, relasi, API relasi</td>
  </tr>
  <tr>
    <td><a href="docs/docs-full.md"><code>docs-full.md</code></a></td>
    <td>Dokumentasi lengkap: teknologi, fungsi, masalah lapangan</td>
  </tr>
  <tr>
    <td><a href="docs/docs-tech.md"><code>docs-tech.md</code></a></td>
    <td>Detail teknis</td>
  </tr>
  <tr>
    <td><a href="docs/docs-field-problems.md"><code>docs-field-problems.md</code></a></td>
    <td>Analisis masalah lapangan</td>
  </tr>
  <tr>
    <td><a href="docs/SECURITY-AUDIT.md"><code>SECURITY-AUDIT.md</code></a></td>
    <td>Audit keamanan</td>
  </tr>
  <tr>
    <td><a href="docs/UI-UX-AUDIT.md"><code>UI-UX-AUDIT.md</code></a></td>
    <td>Audit UI/UX</td>
  </tr>
  <tr>
    <td><a href="docs/STRESS-TEST-REPORT.md"><code>STRESS-TEST-REPORT.md</code></a></td>
    <td>Laporan uji beban</td>
  </tr>
  <tr>
    <td><a href="docs/TEAM-DOCS.md"><code>TEAM-DOCS.md</code></a></td>
    <td>Pembagian tim</td>
  </tr>
</table>

---

## ⚠️ Catatan

- `backend/.env`, `*.db`, `node_modules`, `dist`, dan file log **tidak** di-commit (lihat `.gitignore`).
- Akun `siswa@smk.id` adalah akun demo lama (id uuid, bukan `std-001`); nilainya kosong saat login. Untuk demo data siswa, gunakan akun admin atau wali kelas.

---

<p align="center">
  <sub>Sistem Akademik SMK · Backend Express + SQLite · Frontend Vue 3 + Tailwind CSS</sub>
</p>
