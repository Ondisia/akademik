# Ringkasan Hak Akses Per Role

Baca = boleh membuka halaman. Tulis = boleh tambah/ubah/hapus.

| Peran | Nilai role | Tanggung jawab inti |
|-------|------------|---------------------|
| Administrator | `admin` | Akses penuh sistem |
| Kepala Sekolah | `kepala_sekolah` | Pimpinan, monitoring semua modul |
| Wakil Kepala Sekolah | `waka` | Pimpinan, monitoring semua modul |
| Kepala Tata Usaha | `kepala_tu` | Tata usaha, keuangan, data siswa |
| Staf Tata Usaha | `staff_tu` | Tata usaha, keuangan, data siswa |
| Guru Mapel | `guru_mapel` | Nilai dan absensi pada mapel + kelas yang diampu |
| Guru | `guru` | Role lama, kompatibilitas |
| Wali Kelas | `wali_kelas` | Siswa di kelasnya; lihat tagihan (tidak boleh tulis) |
| Siswa | `siswa` | Data dan nilai/absensi sendiri |
| Orang Tua | `orang_tua` | Data dan tagihan anaknya saja |

## Aturan penting
- `guru_mapel` dan `guru` tidak boleh mengakses Tagihan (`GET /api/bills` → `403`).
- `wali_kelas` hanya boleh melihat Tagihan siswanya, tidak boleh tulis.
- `orang_tua` hanya boleh mengunggah bukti bayar untuk tagihan anaknya.
- Dashboard baca: semua role. Tulis dashboard: `admin`, `kepala_sekolah`, `waka`.

## Detail lengkap
`docs/roles-permissions.md`.
