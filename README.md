# Sistem Akademik SMK

Aplikasi manajemen akademik sekolah berbasis web. Backend Express.js + SQLite, frontend Vue 3 + Tailwind CSS, dengan pembatasan akses data per peran sekolah.

## Fitur utama

- **Manajemen data** — siswa, kelas, guru, mata pelajaran, jadwal
- **Nilai & absensi** — input nilai per mata pelajaran, presensi harian, rekapitulasi
- **Ekskul & prestasi** — kegiatan ekstrakurikuler dan prestasi siswa
- **Tagihan & pembayaran** — SPP, status lunas/belum, unggah bukti bayar
- **Pengumuman & komunikasi** — informasi sekolah dan pesan antar角色
- **Laporan** — ekspor data ke CSV
- **Pembatasan peran** — setiap peran hanya melihat dan mengubah data yang berwenang

## Peran yang didukung

| Peran | Singkatan | Tanggung jawab inti |
|-------|-----------|---------------------|
| Administrator | `admin` | Akses penuh sistem |
| Kepala Sekolah | `kepala_sekolah` | Pimpinan, monitoring semua modul |
| Wakil Kepala Sekolah | `waka` | Pimpinan, monitoring semua modul |
| Kepala Tata Usaha | `kepala_tu` | Tata usaha, keuangan, data siswa |
| Staf Tata Usaha | `staff_tu` | Tata usaha, keuangan, data siswa |
| Guru Mapel | `guru_mapel` | Nilai dan absensi pada mata pelajaran + kelas yang diampu |
| Guru | `guru` | Role guru lama (dipertahankan) |
| Wali Kelas | `wali_kelas` | Siswa di kelasnya; lihat tagihan (tidak boleh tulis) |
| Siswa | `siswa` | Data dan nilai/absensi sendiri |
| Orang Tua | `orang_tua` | Data dan tagihan anaknya saja |

## Cara menjalankan

Butuh Node.js 18+.

```bash
# 1. Backend (Terminal 1)
cd backend
npm install
cp .env.example .env        # isi JWT_SECRET
npm run seed                # data demo (idempoten)
npm run dev                 # http://localhost:3000

# 2. Frontend (Terminal 2)
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Alternatif pakai skrip instalasi otomatis: `setup.bat` (Windows) / `setup.sh` (Linux/macOS).

Backend menolak start jika `backend/.env` tidak memiliki `JWT_SECRET`. Lihat `backend/.env.example`.

## Akun login demo

Semua akun dibuat oleh `npm run seed`. Password peka huruf besar/kecil.

| Peran | Email | Password | Catatan |
|-------|-------|----------|---------|
| Administrator | `admin@example.com` | `Password123` | Akses penuh |
| Kepala Sekolah | `kepsek@smk.id` | `Password123` | Pimpinan |
| Wakil Kepala Sekolah | `waka@smk.id` | `Password123` | Pimpinan |
| Wali Kelas | `wali1@smk.id` | `Password123` | Kelas X RPL 1 |
| Guru Mapel | `guru1@smk.id` | `Password123` | Informatika + Pemrograman Web, X RPL 1 |
| Guru | `guru@smk.id` | `guru123` | Role lama |
| Kepala Tata Usaha | `kepalatu@smk.id` | `Password123` | Keuangan + data siswa |
| Staf Tata Usaha | `stafftu@smk.id` | `Password123` | Keuangan + data siswa |
| Siswa | `siswa@smk.id` | `siswa123` | Demo, data sendiri |
| Orang Tua | `ortu@smk.id` | `ortu123` | Anak: Ahmad Fauzi (`std-001`) dan Bella Putri Lestari (`std-002`) |

Contoh uji login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wali1@smk.id","password":"Password123"}'
```

## Hak akses singkat

Baca = boleh membuka halaman. Tulis = boleh tambah/ubah/hapus.

| Fitur | Baca | Tulis |
|-------|------|-------|
| Dashboard | semua role | admin, kepala_sekolah, waka |
| Siswa | admin, pimpinan, TU, wali_kelas (kelasnya), guru_mapel/guru (kelas diampu), siswa (diri), orang_tua (anak) | admin, kepala_tu, staff_tu |
| Kelas | admin, pimpinan, TU, wali_kelas, guru_mapel, guru | admin, kepala_tu, staff_tu |
| Guru | admin, pimpinan, TU, staff_tu | admin |
| Jadwal | semua role | admin, kepala_sekolah, waka |
| Absensi | semua role (data dibatasi) | admin, pimpinan, guru_mapel/guru (kelas diampu), wali_kelas (kelasnya) |
| Nilai | semua role (data dibatasi) | admin, pimpinan, guru_mapel/guru (mapel+kelas diampu), wali_kelas (kelasnya) |
| Pengumuman | semua role | admin, kepala_sekolah, waka |
| Komunikasi | semua role | admin, pimpinan, guru_mapel, wali_kelas, guru |
| Tagihan | admin, pimpinan, TU, wali_kelas (lihat), siswa (sendiri), orang_tua (anak) | admin, kepala_tu, staff_tu |
| Ekskul & Prestasi | semua role | admin, kepala_sekolah, waka |

Aturan penting:

- `guru_mapel` dan `guru` **tidak** boleh mengakses Tagihan (`GET /api/bills` → `403`).
- `wali_kelas` hanya boleh **melihat** Tagihan siswanya, tidak boleh tulis.
- `orang_tua` hanya boleh mengunggah bukti bayar untuk tagihan anaknya.
- Detail lengkap: [`docs/roles-permissions.md`](docs/roles-permissions.md).

## Relasi data

| Tabel | Isi |
|-------|-----|
| `parent_students(parent_id, student_id)` | Orang tua ↔ anak (banyak anak diperbolehkan) |
| `teacher_assignments(id, teacher_id, subject, class)` | Mapel + kelas yang diampu guru |

Kelola lewat API `/api/relations` (belum ada halaman UI).

## Struktur proyek

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

## Pengujian

```bash
cd backend
node smoke-run.cjs      # uji otomatis peran + relasi (39 pemeriksaan)
node stress-test.js 80 25  # uji beban (butuh server berjalan)

cd ../frontend
npm run build           # type check + build produksi
```

## Dokumentasi

| File | Isi |
|------|-----|
| [`docs/roles-permissions.md`](docs/roles-permissions.md) | Matriks hak akses lengkap, relasi, API relasi |
| [`docs/docs-full.md`](docs/docs-full.md) | Dokumentasi lengkap: teknologi, fungsi, masalah lapangan |
| [`docs/docs-tech.md`](docs/docs-tech.md) | Detail teknis |
| [`docs/docs-field-problems.md`](docs/docs-field-problems.md) | Analisis masalah lapangan |
| [`docs/SECURITY-AUDIT.md`](docs/SECURITY-AUDIT.md) | Audit keamanan |
| [`docs/UI-UX-AUDIT.md`](docs/UI-UX-AUDIT.md) | Audit UI/UX |
| [`docs/STRESS-TEST-REPORT.md`](docs/STRESS-TEST-REPORT.md) | Laporan uji beban |
| [`docs/TEAM-DOCS.md`](docs/TEAM-DOCS.md) | Pembagian tim |

## Catatan

- `backend/.env`, `*.db`, `node_modules`, `dist`, dan file log **tidak** di-commit (lihat `.gitignore`).
- Akun `siswa@smk.id` adalah akun demo lama (id uuid, bukan `std-001`); nilainya kosong saat login. Untuk demo data siswa, gunakan akun admin atau wali kelas.
