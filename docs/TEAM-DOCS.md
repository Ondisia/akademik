#📋 TEAM STRUCTURE & DOCUMENTATION
# Sistem Akademik Sekolah - SMK

## 1. PEMBAGIAN PERAN TIM (4 ORANG)

### 👤 Ketua / Lead Developer
- Mengatur arah pengembangan dan prioritas task
- Mengelola repository (branching, code review, merge PR)
- Menangani konfigurasi server & deployment

### 👤 Backend & Database Developer
- Mengembangkan REST API Express.js (backend/routes/)
- Mengelola skema SQLite & autentikasi JWT
- Mengoptimalkan query dan keamanan endpoint

### 👤 Frontend & UI/UX Developer
- Mengembangkan antarmuka Vue 3 & Tailwind CSS
- Menghubungkan Pinia store dengan API backend
- Memastikan tampilan responsif & user-friendly

### 👤 Debugging & Maintenance Developer
- Menerima & menyelesaikan bug report dari tim
- Memperbaiki error di frontend (stores/, composables/)
- Memperbaiki error backend (routes, middleware, database)
- Memastikan kompatibilitas frontend-backend

## 2. CARA INSTALASI (SATU KLIK)

### Windows:
  setup.bat

### Linux/macOS:
  chmod +x setup.sh && ./setup.sh

### Jalankan Aplikasi:
  # Terminal 1 - Backend
  cd backend && npm run dev

  # Terminal 2 - Frontend
  cd frontend && npm run dev

## 3. AKUN LOGIN DEFAULT
| Role | Email | Password |
| Admin | admin@example.com | Password123 |

## 4. STRUKTUR PROYEK TERBARU
Akademik-Sekolah-Dengan-DB/
├── setup.bat          # Installer otomatis (Windows)
├── setup.sh           # Installer otomatis (Linux/macOS)
├── README.md          # Dokumentasi utama
├── TEAM-DOCS.md       # Dokumentasi tim ini
├── backend/
│   ├── server.js      # Entry point Express
│   ├── database.js    # Skema tabel SQLite
│   ├── middleware/auth.js  # JWT authentication
│   ├── routes/
│   │   ├── auth.js, students.js, teachers.js
│   │   ├── grades.js, attendances.js, schedules.js
│   │   ├── billings.js, announcements.js, settings.js
│   └── scripts/
│       └── seedAdmin.js  # Seed akun admin
└── frontend/
    ├── src/
    │   ├── main.ts     # Entry point Vue
    │   ├── router/index.ts  # Routes & guards
    │   ├── stores/     # Pinia state management
    │   ├── services/api.js  # Axios + JWT interceptor
    │   ├── composables/
    │   │   ├── useApi.ts
    │   │   └── useFormValidation.ts
    │   ├── features/   # Modular page components
    │   │   ├── auth/LoginPage.vue
    │   │   ├── dashboard/DashboardPage.vue
    │   │   ├── students/StudentsPage.vue
    │   │   └── ...
    │   └── components/ui/ # Reusable UI components
    └── vite.config.ts  # Vite proxy /api to backend

## 5. TECH STACK
Backend: Node.js + Express 5 + SQLite + JWT
Frontend: Vue 3 + TypeScript + Tailwind CSS + Pinia
Dev Tools: Vite (build tool), Nodemon (hot reload)

## 6. WORKFLOW GIT TIM
1. Buat branch baru untuk setiap fitur
2. Kerjakan sesuai role masing-masing
3. Pull request to main -> review oleh Ketua
4. Merge setelah approved
