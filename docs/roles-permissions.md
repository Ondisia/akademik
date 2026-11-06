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

## Batasan yang diketahui

- Relasi orang tua–anak belum ada; `orang_tua` sementara melihat semua data.
- Pemetaan guru mapel–mata pelajaran belum ada; `guru_mapel` sementara melihat semua nilai/absensi.
- Uji cepat: `node backend/smoke-run.cjs` (menjalankan server sementara + `smoke-roles.mjs`).
