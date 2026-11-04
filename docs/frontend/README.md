# Sistem Akademik SMK - Frontend

Aplikasi web frontend untuk Sistem Manajemen Akademik Sekolah Menengah Kejuruan (SMK) yang modern, responsif, dan siap diintegrasikan dengan backend API.

## Fitur Utama

- **Authentication**: Login berbasis role (Admin, Guru, Siswa, Orang Tua)
- **Dashboard**: Ringkasan data, statistik, dan pengumuman terbaru
- **Manajemen Siswa**: CRUD lengkap dengan search dan filter
- **Manajemen Guru**: Data guru dan jadwal mengajar
- **Jadwal Pelajaran**: Tampilan jadwal per kelas
- **Absensi**: Pencatatan kehadiran siswa
- **Nilai & Rapor**: Input dan penampilan nilai siswa
- **Pengumuman**: Broadcast berita dan pengumuman penting
- **Chat/Komunikasi**: Interface untuk komunikasi antar pengguna
- **Kontak Bantuan**: Admin dapat mengatur 2 nomor WhatsApp dan 2 akun Instagram yang tampil di dashboard

## Tech Stack

- **Vue.js 3** - Framework JavaScript dengan Composition API
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Axios** - HTTP client (untuk integrasi API)

## Struktur Folder

```
src/
├── assets/               # Static assets
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   ├── Input.vue
│   │   ├── Badge.vue
│   │   └── Modal.vue
│   └── layout/
│       └── AppLayout.vue # Main layout wrapper
├── features/            # Feature modules
│   ├── auth/           # Authentication
│   ├── dashboard/      # Dashboard
│   ├── students/       # Students management
│   ├── teachers/       # Teachers management
│   ├── schedule/       # Schedule
│   ├── attendance/     # Attendance
│   ├── grades/         # Grades & Reports
│   ├── announcements/  # Announcements
│   └── communication/  # Chat & Communication
├── router/             # Vue Router config
├── stores/             # Pinia stores
│   ├── auth.ts        # Auth store
│   ├── student.ts     # Student store
│   └── dashboard.ts   # Dashboard store
├── composables/        # Reusable logic
│   └── useFormValidation.ts
├── types/             # TypeScript types
│   └── index.ts
├── App.vue            # Root component
├── main.ts            # Entry point
└── index.css          # Global styles
```

## Quick Start

### Prasyarat
- Node.js >= 16.x
- npm atau yarn

### Installation

```bash
# Clone atau download project
cd "d:\Sistem Akademik SMK"

# Install dependencies
npm install

# Setup Environment Variables
# Buat file .env dari .env.example
cp .env.example .env

# Jalankan development server
npm run dev
```

Aplikasi akan membuka di `http://localhost:5173`

### 🔧 Environment Variables

Buat file `.env` di root directory dengan mengcopy dari `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5173/api
VITE_APP_NAME=Sistem Akademik SMK
```
### Build untuk Production

```bash
npm run build
npm run preview
```

## 📝 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smk.com | admin123 |
| Guru | guru@smk.com | guru123 |
| Siswa | siswa@smk.com | siswa123 |
| Orang Tua | orangtua@smk.com | orangtua123 |

## Fitur Detail

### 1. Authentication
- Login dengan email & password
- Role-based access control
- Persist session menggunakan localStorage
- Automatic route protection

### 2. Dashboard
- **Statistik**: Jumlah siswa, guru, absensi hari ini
- **Pengumuman Terbaru**: List pengumuman dengan kategori
- **Quick Actions**: Akses cepat ke fitur utama

### 3. Students Management
- Lihat daftar semua siswa (tabel)
- Search berdasarkan nama/NISN/email
- Filter berdasarkan kelas
- Tambah siswa baru (modal form)
- Edit data siswa
- Hapus siswa dengan konfirmasi
- Validasi form input

### 4. Bantuan & Kontak
- Admin dapat mengatur 2 nomor WhatsApp dan 2 akun Instagram
- Kontak bantuan ditampilkan langsung di dashboard untuk semua user
- Tautan WA dan Instagram dibuka di tab baru

### 5. Reusable Components
- `Button` - Multiple variants (primary, secondary, danger, success)
- `Card` - Container untuk konten
- `Input` - Text input dengan validation
- `Badge` - Status indicator
- `Modal` - Dialog untuk add/edit

### 5. State Management (Pinia)
- `authStore` - User authentication & session
- `studentStore` - Student CRUD operations
- `dashboardStore` - Dashboard statistics
- `helpContactsStore` - Admin-managed support contact settings

### 6. Form Validation
- `useFormValidation` composable untuk validasi form
- Support: required, minLength, maxLength, pattern, custom rules
- Real-time error messages

## UI/UX Design

- **Modern & Clean Design**: Minimalist interface dengan Tailwind CSS
- **Responsive**: Mobile-first approach, works on all screen sizes
- **Accessibility**: Semantic HTML, proper ARIA labels
- **Dark Mode Ready**: Easy to implement dark theme
- **Loading States**: Proper feedback saat loading
- **Error Handling**: User-friendly error messages

## Data Flow

```
User Input → Component → Store (Pinia) → State → Component Re-render
```

- Data dikonsumsi dari backend API, tanpa mock JSON lokal yang disimpan di source tree
- Fokus pada akses kontrol dan otentikasi yang aman
- Siap untuk integrasi API real

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Security Features

- Password hashing simulasi (untuk demo)
- Session persistence dengan localStorage
- Route protection dengan navigation guards
- Type-safe dengan TypeScript strict mode
- Input validation di client-side

## Future Integration Points

### Backend API Integration
```typescript
// Replace mock data loading dengan API calls
const response = await fetch('/api/students')
const students = await response.json()
```

### WebSocket Integration
```typescript
// untuk fitur komunikasi real-time
import { useWebSocket } from 'vue-use-websocket'
```

### State Persistence
```typescript
// Gunakan localStorage plugins atau backend database
```

## Component Examples

### Button Component
```vue
<Button variant="primary" size="lg" @click="handleClick">
  Click Me
</Button>
```

### Form Validation
```typescript
const { errors, validateForm } = useFormValidation({
  email: { required: true, pattern: /^[^\s@]+@/ },
  password: { required: true, minLength: 8 }
})
```

## Troubleshooting

### Port sudah terpakai?
```bash
npm run dev -- --port 5174
```

### Dependencies issue?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build error?
```bash
npm run build -- --force
```

## 📖 Learn More

- [Vue.js 3 Docs](https://vuejs.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Pinia Store](https://pinia.vuejs.org/)
- [Vite Docs](https://vitejs.dev/)

## License

MIT License - Feel free to use this project for any purpose.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Tips

1. **Component Reusability**: Gunakan UI components untuk consistency
2. **Type Safety**: Selalu gunakan TypeScript types untuk data
3. **State Management**: Gunakan Pinia stores untuk shared state
4. **Form Validation**: Gunakan composable untuk validasi form
5. **Responsive Design**: Test di berbagai ukuran screen

---

**Built with ❤️ by Akademik SMK Team**
