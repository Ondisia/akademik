# SECURITY AUDIT REPORT
## Sistem Akademik Sekolah (SMK)
**Run ID:** run-1 | **Date:** 2026-11-04 | **Profile:** standard  
**Source Ref:** `2466d40` | **Scope:** `backend/`, `frontend/src/`

---

## Ringkasan Eksekutif

Project ini memiliki **4 temuan CRITICAL**, **3 HIGH**, **6 MEDIUM**, dan **2 LOW**. Kerentanan paling berbahaya adalah **hilangnya autentikasi dan otorisasi pada sebagian besar endpoint API**, yang memungkinkan siapa pun mengakses data siswa, guru, nilai, absensi, dan tagihan tanpa login. SQL injection praktis aman karena semua query menggunakan parameterized `better-sqlite3`.

### Skor Keamanan: ⚠️ 3.2 / 10 (Berisiko Tinggi)

---

## Temuan CRITICAL (4)

| # | ID | File | Deskripsi | Dampak |
|---|---|---|---|---|
| 1 | F-001 | `backend/routes/students.js`, `teachers.js`, `grades.js`, `attendances.js`, `schedules.js`, `announcements.js` | **Tidak ada middleware auth** — semua endpoint CRUD terbuka untuk umum | Siapapun bisa membaca/mengubah/menghapus data siswa & guru |
| 2 | F-002 | `backend/routes/billings.js` | **GET /api/bills** tidak memfilter berdasarkan user role — siswa/orang tua bisa melihat semua tagihan | Data keuangan seluruh sekolah bocor ke satu pengguna |
| 3 | F-003 | Semua list endpoint | **Tidak ada user-scoped filtering** — query `SELECT *` tanpa WHERE user context | Siswa bisa melihat nilai & absensi seluruh sekolah |
| 4 | F-004 | `backend/routes/paymentRoutes.js` | **require path salah** — `../middlewares/auth` (plural) → crash runtime MODULE_NOT_FOUND | Endpoint pembayaran tidak berjalan sama sekali |

---

## Temuan HIGH (3)

| # | ID | File | Deskripsi | Rekomendasi |
|---|---|---|---|---|
| 5 | F-005 | `students.js:14`, `teachers.js:22`, `announcements.js:30` | LIKE wildcard injection melalui parameter search — `%` dan `_` tidak di-escape | Escape `%` dan `_` sebelum interpolasi ke pattern LIKE |
| 6 | F-006 | Semua POST/PUT endpoints | **Tidak ada validasi schema** — nama 10.000 karakter, score negatif, gender string acak | Tambah validasi field-level: regex, maxLength, enum, numeric range |
| 7 | F-007 | `POST /api/students/bulk`, `POST /api/teachers/bulk` | Bulk import tidak memvalidasi shape item & tidak ada rollback partial | Validasi per-item + max array size (500) + error reporting per-baris |

---

## Temuan MEDIUM (6)

| # | ID | Deskripsi | Lokasi |
|---|---|---|---|
| 8 | F-008 | JWT 24h tanpa mekanisme revokasi / refresh token | `auth.js`, `middleware/auth.js` |
| 9 | F-009 | Upload bukti bayar tidak cek magic bytes — MIME spoofing mungkin | `paymentRoutes.js` |
| 10 | F-010 | `/api/auth/me` aman sekarang tapi fragile — `SELECT *` tersirat di masa depan | `auth.js:48` |
| 11 | F-011 | CORS_ORIGIN dari env tanpa allowlist — nilai `*` akan diterima mentah | `server.js:8-9` |
| 12 | F-012 | Error message DB (SQLite) langsung dikembalikan ke client | `students.js:58`, `teachers.js`, dll |
| 13 | F-013 | DELETE tanpa check ownership — siswa bisa hapus data siswa lain | Semua DELETE routes |

**Frontend (3 temuan):**
| # | ID | Deskripsi |
|---|---|---|
| 14 | FE-001 | Token JWT di localStorage — rentan XSS jika ada script injection |
| 15 | FE-002 | `v-html="item.icon"` di AppLayout — potensi XSS jika icon dari user input |
| 16 | FE-003 | Role guard hanya client-side — tidak melindungi endpoint jika backend lemah |

---

## Prioritas Perbaikan

### 🔴 Priority 1 — Hit Sekarang (Critical)
1. **Tambah `authenticateToken` ke semua route file** (F-001)
2. **Tambah role middleware factory** (`createRoleGuard(...roles)`) dan apply per-endpoint
3. **User-scoped filtering** — siswa lihat sendiri, guru lihat kelasnya, orang tua lihat anaknya (F-003)
4. **Fix paymentRoutes.js require path** dan buat `middleware/roleCheck.js` (F-004)

### 🟠 Priority 2 — Minggu Ini (High)
5. Escape LIKE wildcards di semua search param (F-005)
6. Tambah validasi input di setiap POST/PUT (F-006)
7. Bulk import dengan validasi per-item (F-007)

### 🟡 Priority 3 — Bulan Ini (Medium)
8. Token revocation table + refresh token (F-008)
9. File upload validation + magic bytes check (F-009)
10. CORS origin allowlist + env validation (F-011)
11. Generic error handler middleware (F-012)
12. Move token ke `HttpOnly` cookie (FE-001)

---

## Temuan Positif (Tidak Bermasalah)

- ✅ SQL Injection: semua query menggunakan `?` parameterized (better-sqlite3)
- ✅ Password hashing: bcryptjs dengan salt rounds 10
- ✅ `.gitignore`: `.env`, `*.db`, `node_modules/` sudah di-cover
- ✅ CORS: default origin `localhost:5173` (aman untuk dev)
- ✅ No hardcoded secrets dalam source code (password seeding via env var)

---

## Arsitektur yang Direkomendasikan

```
┌─────────────┐     HTTPS/WSS      ┌──────────────────┐     SQLite      ┌─────────┐
│   Frontend   │ ───────────────→  │  Express Server   │ ─────────────→  │  school │
│   Vue 3 :5173│                  │  :3000            │                 │   .db   │
└─────────────┘                  └──────────────────┘                  └─────────┘
                                      │
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
          [authMiddleware]      [roleMiddleware]       [errorHandler]
           JWT verify             role check             sanitize DB errors
                │                     │                     │
          req.user = {id,        Students: filter by      Bills: owner check
                       email,      req.user.email         DELETE: ownership verify
                       role}
```
