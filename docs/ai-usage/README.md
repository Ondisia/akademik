# Panduan AI — Sistem Akademik SMK

Folder ini berisi dokumentasi ringkas untuk mempermudah AI memahami, mengubah, dan mengembangkan proyek ini.

## Isi folder

| File | Isi |
|------|-----|
| `context-summary.md` | Ringkasan proyek untuk konteks AI |
| `file-map.md` | Peta file penting dan fungsinya |
| `commands.md` | Perintah umum (install, run, test, build) |
| `database-schema.md` | Skema tabel SQLite |
| `api-endpoints.md` | Pola endpoint REST API |
| `roles-permissions-summary.md` | Ringkasan hak akses per role |

## Cara gunakan sebagai konteks AI

Sertakan `docs/ai-usage/context-summary.md` dan `docs/ai-usage/file-map.md` sebagai bagian awal prompt saat bertanya tentang kode ini. Tambahkan file lain sesuai topik yang dibahas (mis. `database-schema.md` untuk pertanyaan DB, `api-endpoints.md` untuk pertanyaan route).

## Catatan

- Backend: Express.js + SQLite (`better-sqlite3`), port 3000
- Frontend: Vue 3 + TypeScript + Vite + Tailwind, port 5173
- Proxy Vite: `/api` di frontend diarahkan ke backend `:3000`
- Autentikasi: JWT, disimpan di localStorage, dikirim via header `Authorization`
