# Peta File Penting

## Backend (`backend/`)
| File | Fungsi |
|------|--------|
| `server.js` | Entry point Express, montir middleware dan routes |
| `app.js` | Inisialisasi Express app (cors, json, routes) |
| `database.js` | Koneksi SQLite + CREATE TABLE idempotent + migrasi kolom (`class`, `roles`) |
| `scope.js` | Aturan pembatasan data (scope) per role |
| `middleware/auth.js` | Verifikasi token JWT |
| `middleware/roleCheck.js` | Cek hak akses role |
| `routes/auth.js` | Login / register / me |
| `routes/students.js` | CRUD siswa |
| `routes/teachers.js` | CRUD guru |
| `routes/schedules.js` | Jadwal pelajaran |
| `routes/grades.js` | Nilai siswa |
| `routes/attendances.js` | Absensi |
| `routes/billings.js` | Tagihan & bukti bayar |
| `routes/announcements.js` | Pengumuman |
| `routes/ekskul.js` | Ekskul |
| `routes/prestasi.js` | Prestasi siswa |
| `routes/settings.js` | Pengaturan (kontak bantuan, dll.) |
| `routes/relations.js` | Relasi orang tua-siswa & guru-mapel-kelas |
| `scripts/seedDemo.js` | Seed data demo (idempoten) |
| `scripts/initDb.js`, `seedUsers.js`, `seedAdmin.js` | Inisialisasi DB & akun |
| `smoke-run.cjs` | Uji otomatis peran + relasi (39 pemeriksaan) |
| `stress-test.js` | Uji beban |
| `test-security.js` | Uji keamanan |

## Frontend (`frontend/src/`)
| File / Folder | Fungsi |
|---------------|--------|
| `main.ts` | Entry point Vue |
| `App.vue` | Root component |
| `router/index.ts` | Konfigurasi route + navigation guard (auth & role) |
| `services/api.js` | Axios instance + interceptor menyisipkan JWT |
| `stores/auth.ts` | State autentikasi (login, user, token, logout) |
| `stores/*.ts` | Pinia store per fitur (student, teacher, grade, billing, dll.) |
| `composables/useFormValidation.ts` | Validasi form |
| `composables/useApi.ts` | Helper pemanggilan API |
| `composables/useExport.ts` | Ekspor CSV |
| `components/ui/` | Button, Card, Input, Badge, Modal, AlertToast, StatCard |
| `components/layout/AppLayout.vue` | Layout utama, sidebar disesuaikan role |
| `features/auth/LoginPage.vue` | Halaman login |
| `features/dashboard/DashboardPage.vue` | Dashboard + statistik |
| `features/students/StudentsPage.vue` | Manajemen siswa |
| `features/teachers/TeachersPage.vue` | Manajemen guru |
| `features/schedule/SchedulePage.vue` | Jadwal |
| `features/attendance/AttendancePage.vue` | Absensi |
| `features/grades/GradesPage.vue` | Nilai |
| `features/billing/BillingPage.vue` | Tagihan |
| `features/announcements/AnnouncementsPage.vue` | Pengumuman |
| `features/ekskul/EkskulPage.vue` | Ekskul |
| `features/prestasi/PrestasiPage.vue` | Prestasi |
| `features/classes/ClassesPage.vue` | Kelas |
| `features/communication/CommunicationPage.vue` | Komunikasi |
| `features/dashboard/HelpContactsSettings.vue` | Pengaturan kontak bantuan |
| `types/index.ts` | TypeScript types |
| `vite.config.ts` | Vite + proxy `/api` → `:3000` |

## Konfigurasi & lain
| File | Fungsi |
|------|--------|
| `package.json` (root) | Skrip setup lintas platform |
| `setup.bat` / `setup.sh` | Instalasi otomatis Windows / Linux-macOS |
| `.env.example` | Contoh variabel lingkungan (backend butuh `JWT_SECRET`) |
| `.gitignore` | File yang tidak di-commit (`.env`, `*.db`, `node_modules`, `dist`, log) |
| `README.md` | Dokumentasi utama proyek |
