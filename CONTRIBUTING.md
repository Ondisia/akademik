# Panduan Kolaborasi GitHub

Panduan ini menjelaskan cara berkontribusi ke proyek **Sistem Akademik SMK** melalui mekanisme fork & pull request.

---

## 1. Fork Repository

1. Buka halaman repository utama di GitHub.
2. Klik tombol **Fork** (pojok kanan atas).
3. Pilih akun/organisasi tujuan fork, lalu klik **Create fork**.

---

## 2. Clone Fork ke Lokal

```bash
git clone https://github.com/<username-kamu>/akademik.git
cd akademik
```

Tambahkan remote `upstream` agar bisa sinkron dengan repo utama:

```bash
git remote add upstream https://github.com/<username-owner>/akademik.git
```

Verifikasi:

```bash
git remote -v
# origin    https://github.com/<username-kamu>/akademik.git (fetch/push)
# upstream  https://github.com/<username-owner>/akademik.git (fetch/push)
```

---

## 3. Buat Branch Baru

Jangan pernah langsung commit ke `main`. Buat branch khusus untuk setiap fitur/perbaikan:

```bash
git checkout -b feat/nama-fitur
# atau untuk bugfix:
git checkout -b fix/nama-bug
```

---

## 4. Lakukan Perubahan & Commit

```bash
# setelah selesai coding
git add .
git commit -m "feat: deskripsi singkat perubahan"
```

Gunakan format pesan commit yang jelas:
- `feat:` — fitur baru
- `fix:` — perbaikan bug
- `docs:` — perubahan dokumentasi
- `refactor:` — refaktor kode tanpa mengubah fungsi

---

## 5. Push ke Fork

```bash
git push origin feat/nama-fitur
```

---

## 6. Buat Pull Request (PR)

1. Buka fork kamu di GitHub.
2. Klik tombol **Compare & pull request** yang muncul otomatis.
3. Isi judul dan deskripsi PR dengan jelas:
   - Apa yang diubah?
   - Kenapa perlu diubah?
   - Cara menguji perubahan ini?
4. Klik **Create pull request**.

---

## 7. Menunggu Review & Merge

- Owner/maintainer akan mereview PR kamu.
- Jika ada komentar atau permintaan perubahan, lakukan perbaikan di branch yang sama lalu push ulang — PR akan otomatis terupdate.
- Setelah disetujui, owner akan melakukan **merge**.
- Kamu akan mendapat notifikasi email dari GitHub saat PR di-merge, ditolak, atau ada komentar baru.

> ⚠️ **Aktifkan notifikasi GitHub** di Settings → Notifications agar tidak melewatkan update status PR.

---

## 8. Sinkronisasi Setelah Merge

> 🔔 **Penting:** Setelah PR di-merge (milik kamu atau kontributor lain), **selalu sinkronkan fork kamu** sebelum mulai pekerjaan baru.

```bash
# Ambil perubahan terbaru dari repo utama
git fetch upstream

# Pindah ke branch main
git checkout main

# Gabungkan perubahan upstream ke main lokal
git merge upstream/main

# Push ke fork kamu di GitHub
git push origin main
```

Lalu buat branch baru dari `main` yang sudah terupdate untuk pekerjaan berikutnya.

---

## ⏰ Rutinitas yang Disarankan

| Kapan | Aksi |
|-------|------|
| Setiap mulai kerja | `git fetch upstream` → cek apakah ada perubahan baru |
| Setelah PR di-merge | Sinkronisasi `main` seperti langkah 8 |
| Sebelum push | `git pull --rebase upstream main` untuk hindari konflik |
| Setiap hari (jika aktif) | Cek tab **Pull Requests** di GitHub untuk status review |

---

## Catatan Tambahan

- Jangan hapus branch di fork sebelum PR benar-benar di-merge.
- Jika terjadi **conflict**, selesaikan secara lokal sebelum push ulang.
- Untuk diskusi fitur besar, buka **Issue** terlebih dahulu sebelum membuat PR.
