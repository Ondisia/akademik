# Sistem Akademik SMK

Aplikasi manajemen akademik sekolah: backend Express + SQLite, frontend Vue 3 + Tailwind.
Mendukung 10 peran sekolah dengan pembatasan data per fitur (pimpinan, tata usaha, guru mapel, wali kelas, siswa, orang tua).

## Cara menjalankan

Butuh Node.js 18+.

```bash
# 1. Backend
cd backend
npm install
npm run seed        # data demo (idempoten, aman diulang)
npm run dev         # http://localhost:3000

# 2. Frontend (terminal lain)
cd frontend
npm install
npm run dev         # http://localhost:5173
```

Atau pakai skrip instalasi otomatis: `setup.bat` (Windows) / `setup.sh` (Linux/macOS).

Backend memerlukan `backend/.env` berisi `JWT_SECRET` (lihat `backend/.env.example`). Tanpa itu server menolak start.

## Akun login

Semua akun dibuat oleh `npm run seed`. Password peka huruf besar/kecil.

| Peran | Email | Password | Kelas / Relasi |
|-------|-------|----------|----------------|
| Administrator | `admin@example.com` | `Password123` | akses penuh |
| Kepala Sekolah | `kepsek@smk.id` | `Password123` | pimpinan |
| Wakil Kepala Sekolah | `waka@smk.id` | `Password123` | pimpinan |
| Wali Kelas | `wali1@smk.id` | `Password123` | wali kelas **X RPL 1** |
| Guru Mapel | `guru1@smk.id` | `Password123` | Informatika & Pemrograman Web, X RPL 1 |
| Guru (role lama) | `guru@smk.id` | `guru123` | Informatika X RPL 1, Pemrograman Web XI RPL 1 |
| Kepala Tata Usaha | `kepalatu@smk.id` | `Password123` | keuangan + data siswa |
| Staf Tata Usaha | `stafftu@smk.id` | `Password123` | keuangan + data siswa |
| Siswa | `siswa@smk.id` | `siswa123` | akun demo, id bukan `std-001` sehingga daftar nilainya kosong |
| Orang Tua | `ortu@smk.id` | `ortu123` | orang tua dari Ahmad Fauzi (`std-001`) dan Bella Putri Lestari (`std-002`) |

Contoh uji cepat per peran:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wali1@smk.id","password":"Password123"}'
```

## Hak akses ringkas

Baca = boleh membuka halaman/endpoint. Tulis = boleh tambah/ubah/hapus.

| Fitur | Baca | Tulis |
|-------|------|-------|
| Dashboard | semua | admin, kepala_sekolah, waka |
| Siswa | admin, kepala_sekolah, waka, kepala_tu, staff_tu, wali_kelas (kelasnya), guru_mapel/guru (kelas diampu), siswa (diri), orang_tua (anaknya) | admin, kepala_tu, staff_tu |
| Kelas | admin, kepala_sekolah, waka, kepala_tu, staff_tu, wali_kelas, guru_mapel, guru | admin, kepala_tu, staff_tu |
| Guru | admin, kepala_sekolah, waka, kepala_tu, staff_tu | admin |
| Jadwal | semua | admin, kepala_sekolah, waka |
| Absensi | semua (data dibatasi per peran) | admin, kepala_sekolah, waka, guru_mapel/guru (kelas diampu), wali_kelas (kelasnya) |
| Nilai | semua (data dibatasi per peran) | admin, kepala_sekolah, waka, guru_mapel/guru (mapel + kelas diampu), wali_kelas (kelasnya) |
| Pengumuman | semua | admin, kepala_sekolah, waka |
| Komunikasi | semua | admin, kepala_sekolah, waka, guru_mapel, wali_kelas, guru |
| Tagihan | admin, kepala_sekolah, waka, kepala_tu, staff_tu, wali_kelas (lihat), siswa (miliknya), orang_tua (anaknya) | admin, kepala_tu, staff_tu |
| Ekskul | semua | admin, kepala_sekolah, waka |
| Prestasi | semua | admin, kepala_sekolah, waka |

Aturan khusus:

- `guru_mapel` dan `guru` **tidak** boleh mengakses Tagihan (`GET /api/bills` → `403`).
- `wali_kelas` boleh melihat Tagihan siswanya, tetapi tidak boleh menulis.
- `orang_tua` hanya bisa mengunggah bukti bayar untuk tagihan anaknya.
- `wali_kelas` tanpa kolom `class` tidak melihat data apa pun.

Detail lengkap: [`docs/roles-permissions.md`](docs/roles-permissions.md).

## Relasi data

| Tabel | Isi |
|-------|-----|
| `parent_students(parent_id, student_id)` | relasi orang tua ke anak (banyak anak diperbolehkan) |
| `teacher_assignments(id, teacher_id, subject, class)` | mapel dan kelas yang diampu guru |

Kelola lewat API `/api/relations` (baca: admin, kepala_sekolah, waka, kepala_tu, staff_tu). Belum ada halaman UI.

## Struktur proyek

```
akademik/
+-- backend/
|   +-- server.js              # Entry point Express
|   +-- database.js            # Skema SQLite + migrasi idempotent
|   +-- scope.js               # Aturan pembatasan data per peran
|   +-- middleware/            # auth (JWT) + roleCheck
|   +-- routes/                # auth, students, teachers, grades, ...
|   +-- scripts/seedDemo.js    # Seed data demo (idempoten)
|   +-- smoke-run.cjs          # Uji role/relasi (39 pemeriksaan)
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
node smoke-run.cjs                       # role + relasi, 39 pemeriksaan
node stress-test.js 80 25                # butuh server berjalan
cd ../frontend && npm run build          # type check + build produksi
```

## Dokumentasi lain

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

- `backend/.env`, `*.db`, `node_modules`, `dist`, dan file log tidak di-commit.
- Akun `siswa@smk.id` adalah akun demo lama dengan id uuid, bukan `std-001`; daftar nilai/absensi/tagihannya kosong saat login. Untuk demo data siswa, pakai akun admin/wali kelas.
