# Role & Matriks Hak Akses

## Daftar role

| Role | Deskripsi |
|------|-----------|
| `admin` | Administrator sistem |
| `kepala_sekolah` | Pimpinan sekolah |
| `waka` | Wakil kepala sekolah |
| `guru_mapel` | Guru mata pelajaran |
| `wali_kelas` | Wali kelas (punya atribut `class`) |
| `kepala_tu` | Kepala tata usaha |
| `staff_tu` | Staf tata usaha |
| `guru` | Role guru lama (dipertahankan) |
| `siswa` | Siswa |
| `orang_tua` | Orang tua/wali siswa |

## Matriks fitur

Baca = boleh membuka halaman/endpoint. Tulis = boleh tambah/ubah/hapus.

| Fitur | Baca | Tulis |
|-------|------|-------|
| Dashboard | semua role | admin, kepala_sekolah, waka |
| Siswa | admin, kepala_sekolah, waka, kepala_tu, staff_tu, wali_kelas, guru_mapel, guru, siswa (diri sendiri), orang_tua | admin, kepala_tu, staff_tu |
| Kelas | admin, kepala_sekolah, waka, kepala_tu, staff_tu, wali_kelas, guru_mapel, guru | admin, kepala_tu, staff_tu |
| Guru | admin, kepala_sekolah, waka, kepala_tu, staff_tu | admin |
| Jadwal | semua role | admin, kepala_sekolah, waka |
| Absensi | semua role (wali_kelas & siswa dibatasi datanya) | admin, kepala_sekolah, waka, guru_mapel, wali_kelas, guru |
| Nilai | semua role (wali_kelas & siswa dibatasi datanya) | admin, kepala_sekolah, waka, guru_mapel, wali_kelas, guru |
| Pengumuman | semua role | admin, kepala_sekolah, waka |
| Komunikasi | semua role | admin, kepala_sekolah, waka, guru_mapel, wali_kelas, guru |
| Tagihan | admin, kepala_sekolah, waka, kepala_tu, staff_tu, wali_kelas (lihat saja), siswa (tagihan sendiri), orang_tua | admin, kepala_tu, staff_tu |
| Ekskul | semua role | admin, kepala_sekolah, waka |
| Prestasi | semua role | admin, kepala_sekolah, waka |

Catatan penting:

- `guru_mapel` dan `guru` **tidak boleh** mengakses Tagihan (`GET /api/bills` → 403).
- `wali_kelas` boleh melihat Tagihan siswanya, tetapi tidak boleh menulis.
- `wali_kelas` hanya melihat siswa, nilai, absensi, dan tagihan pada kelas yang tercatat di kolom `users.class`.
- `siswa` hanya melihat data dirinya sendiri.

## Akun demo

Semua password `Password123` kecuali yang tertulis lain.

| Email | Role | Kelas |
|-------|------|-------|
| admin@example.com | admin | - |
| kepsek@smk.id | kepala_sekolah | - |
| waka@smk.id | waka | - |
| wali1@smk.id | wali_kelas | X RPL 1 |
| guru1@smk.id | guru_mapel | - |
| kepalatu@smk.id | kepala_tu | - |
| stafftu@smk.id | staff_tu | - |
| guru@smk.id | guru (password `guru123`) | - |
| siswa@smk.id | siswa (password `siswa123`) | - |
| ortu@smk.id | orang_tua (password `ortu123`) | - |

Relasi demo yang sudah terisi:

| Relasi | Isi |
|--------|-----|
| Orang tua → anak | `ortu@smk.id` → `std-001` (Ahmad Fauzi), `std-002` (Bella Putri Lestari) |
| Guru → mapel/kelas | `guru1@smk.id` → Informatika X RPL 1, Pemrograman Web X RPL 1 |
| Guru → mapel/kelas | `guru@smk.id` → Informatika X RPL 1, Pemrograman Web XI RPL 1 |

## Relasi data

Dua tabel relasi dipakai untuk pembatasan data:

| Tabel | Isi | Efek |
|-------|-----|------|
| `parent_students(parent_id, student_id)` | relasi orang tua ke anak | `orang_tua` hanya melihat siswa, nilai, absensi, dan tagihan anaknya |
| `teacher_assignments(id, teacher_id, subject, class)` | mapel dan kelas yang diampu guru | `guru_mapel`/`guru` hanya melihat siswa di kelas yang diampu, nilai pada mapel yang diampu, dan hanya boleh menulis nilai/absensi pada pasangan mapel+kelas tersebut |

Aturan tulis:

- `guru_mapel`/`guru`: menulis nilai hanya untuk mapel & kelas yang diampu; menulis absensi hanya untuk kelas yang diampu. Di luar itu `403`.
- `wali_kelas`: menulis nilai/absensi hanya untuk kelasnya. `GET /api/bills` tetap boleh, tulis tagihan `403`.
- `orang_tua`: hanya boleh mengunggah bukti bayar untuk tagihan anaknya, selain itu `403`.
- `wali_kelas` tanpa kolom `class` tidak melihat data apa pun (`1 = 0`), bukan semua data.

## Mengelola relasi

Belum ada halaman UI; kelola lewat API (butuh token admin):

```
GET    /api/relations/parents
POST   /api/relations/parents              { "parentEmail": "...", "studentId": "std-001" }
DELETE /api/relations/parents/:parentId/:studentId

GET    /api/relations/teacher-assignments
POST   /api/relations/teacher-assignments  { "teacherEmail": "...", "subject": "Informatika", "class": "X RPL 1" }
DELETE /api/relations/teacher-assignments/:id
```

Hak akses: baca untuk `admin`, `kepala_sekolah`, `waka`, `kepala_tu`, `staff_tu`; tulis relasi orang tua untuk `admin`, `kepala_tu`; tulis penugasan guru untuk `admin`, `kepala_sekolah`.

## Batasan yang diketahui

- Halaman UI untuk mengelola relasi orang tua–anak dan penugasan guru belum ada.
- `siswa@smk.id` adalah akun demo dengan id uuid, bukan `std-001`, sehingga datanya kosong saat login.
- Uji cepat: `node backend/smoke-run.cjs` (server sementara + 39 pemeriksaan role/relasi).
