# Skema Database SQLite (`school.db`)

Mode: WAL (`journal_mode = WAL`), `foreign_keys = ON`. Migrasi idempotent di `backend/database.js`.

## Tabel

| Tabel | Kolom utama | Keterangan |
|-------|-------------|------------|
| `users` | id, name, email, password, role, avatar, class, roles | Akun pengguna. `roles` JSON array untuk multi-role. `class` untuk scoping wali kelas. |
| `students` | id, name, niup, gender, class, status | Data siswa. |
| `teachers` | id, name, niup, gender, subjects, classes | Data guru. `subjects` dan `classes` JSON array. |
| `announcements` | id, title, content, author, category, created_at | Pengumuman. |
| `grades` | id, student_id, student_name, subject, score, date | Nilai siswa. |
| `attendances` | id, student_id, student_name, date, status, note | Absensi (hadir/izin/sakit/alfa). |
| `schedules` | id, class, time, subject, teacher, room | Jadwal pelajaran. |
| `bills` | id, student_id, student_name, amount, period, description, status, payment_proof, proof_filename, created_at, updated_at | Tagihan. FK ke `students(id)`. |
| `settings` | key, value | Pengaturan sistem. |
| `ekskul` | id, nama, pembina, jadwal, deskripsi, created_at | Ekstrakurikuler. |
| `parent_students` | parent_id, student_id (PK komposit) | Relasi orang tua ↔ anak. |
| `teacher_assignments` | id, teacher_id, subject, class (UNIQUE) | Mapel + kelas yang diampu guru. |
| `prestasi` | id, student_id, student_name, class, kategori, juara, event, tahun, deskripsi | Prestasi siswa. |

## Migrasi otomatis
Jika kolom `class` atau `roles` belum ada pada tabel `users`, ditambahkan melalui `ALTER TABLE` saat inisialisasi.
