# Sistem Akademik Sekolah (SQLite + Vue 3)

Aplikasi manajemen akademik sekolah dengan backend Express dan frontend Vue 3.

## 🚀 Cara Instalasi Kilat (Untuk Tim)

Cukup jalankan satu skrip otomatis berikut:

### Pengguna Windows:
1. Double click file **`setup.bat`** di folder root, atau jalankan di CMD/PowerShell:
   ```cmd
   setup.bat
   ```

### Pengguna Linux / macOS:
1. Jalankan di terminal:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

---

## 🏃 Cara Menjalankan Aplikasi

Setelah instalasi selesai, buka **dua terminal** terpisah:

### Terminal 1 (Backend):
```bash
cd backend
npm run dev
```
*(Server berjalan di `http://localhost:3000`)*

### Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
*(Aplikasi terbuka di `http://localhost:5173`)*

---

## 🔑 Akun Login Default
| Peran | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `Password123` |
| Guru | `guru@smk.id` | `guru123` |
| Siswa | `siswa@smk.id` | `siswa123` |
| Orang tua | `ortu@smk.id` | `ortu123` |

---

## 🌱 Seed Data Demo

Setelah instalasi, isi database dengan data contoh (12 siswa, 5 guru, jadwal, nilai, absensi, tagihan, pengumuman):

```bash
cd backend
npm run seed
```

Seed bersifat idempoten: aman dijalankan berulang, data yang sudah ada tidak diduplikasi.
