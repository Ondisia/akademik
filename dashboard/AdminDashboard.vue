<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar--open': sidebarOpen }">
      <div class="sidebar-inner">
        <div class="sidebar-brand">
          <router-link to="/" class="sidebar-logo">
            <img :src="logo" alt="Logo SMK" class="sidebar-logo-img" />
            <div>
              <span class="sidebar-brand-name">SMK Nurul Jadid</span>
              <span class="sidebar-brand-subtitle">Admin Portal</span>
            </div>
          </router-link>
        </div>

        <button class="sidebar-new-entry" @click="handleNewEntry">
          + Content Studio
        </button>

        <nav class="sidebar-nav">
          <router-link to="/dashboard" class="sidebar-item sidebar-item--active">
            <LayoutGrid :size="20" color="#1e3a8a" />
            <span>Dashboard</span>
          </router-link>
          <router-link to="/admin/content" class="sidebar-item">
            <Newspaper :size="20" color="#4b5563" />
            <span>Content Studio</span>
          </router-link>
          <router-link to="/admin/manage" class="sidebar-item">
            <Users :size="20" color="#4b5563" />
            <span>Kelola Admin</span>
          </router-link>
          <router-link to="/jurusan" class="sidebar-item">
            <GraduationCap :size="20" color="#4b5563" />
            <span>Jurusan</span>
          </router-link>
          <router-link to="/galeri" class="sidebar-item">
            <Image :size="20" color="#4b5563" />
            <span>Galeri</span>
          </router-link>
          <router-link to="/ppdb" class="sidebar-item">
            <UserPlus :size="20" color="#4b5563" />
            <span>PPDB Portal</span>
          </router-link>

          <div class="sidebar-spacer"></div>

          <router-link to="/" class="sidebar-item">
            <Globe :size="20" color="#4b5563" />
            <span>Lihat Website ↗</span>
          </router-link>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-wrapper">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-inner">
          <button class="header-menu-btn" @click="sidebarOpen = !sidebarOpen" aria-label="Toggle menu">
            <Menu :size="24" color="#1e293b" />
          </button>

          <div class="header-search">
            <Search :size="18" color="#9ca3af" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search pendaftar..."
              class="header-search-input"
              @input="handleSearch"
            />
          </div>

          <div class="header-user">
            <button @click="fetchData" class="header-notif-btn" :disabled="isLoading" title="Refresh Data">
              <RefreshCw :size="18" :class="{ 'spin-anim': isLoading }" color="#4b5563" />
            </button>
            <div class="header-divider"></div>
            <div class="header-user-info">
              <img :src="userAvatar" alt="Avatar" class="header-avatar" />
              <div class="header-user-text">
                <span class="header-user-name">{{ user.name || 'Administrator' }}</span>
                <span class="header-user-role">{{ user.email || 'Admin SMK' }}</span>
              </div>
            </div>
            <button @click="handleLogout" class="header-logout-btn" title="Logout">
              <LogOut :size="18" color="#ef4444" />
            </button>
          </div>
        </div>
      </header>

      <!-- Content Body -->
      <main class="dashboard-body">
        <div class="dashboard-container">
          <!-- Welcome Section -->
          <div class="welcome-section">
            <div class="welcome-text">
              <h1 class="welcome-title">Selamat Datang, Admin!</h1>
              <p class="welcome-subtitle">Kelola pendaftaran PPDB siswa, kemitraan industri, dan konten sekolah SMK Nurul Jadid.</p>
            </div>
            <div class="date-badge">
              <Calendar :size="16" color="#1e3a8a" />
              <span>{{ currentDate }}</span>
            </div>
          </div>

          <!-- Statistics Cards -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon-circle stat-icon-circle--blue">
                <Users :size="24" color="#1e3a8a" />
              </div>
              <div class="stat-content">
                <div class="stat-header">
                  <span class="stat-label">Total Pendaftar PPDB</span>
                  <span class="stat-badge stat-badge--green">{{ registrations.length }} Total</span>
                </div>
                <div class="stat-value">{{ registrations.length || animatedStats.newApplications }}</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon-circle stat-icon-circle--orange">
                <Loader2 :size="24" color="#9a3412" />
              </div>
              <div class="stat-content">
                <span class="stat-label">Menunggu Verifikasi</span>
                <div class="stat-value">{{ pendingCount }}</div>
                <span class="stat-subtext">Perlu Tindakan</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon-circle stat-icon-circle--green">
                <CheckCircle :size="24" color="#065f46" />
              </div>
              <div class="stat-content">
                <div class="stat-header">
                  <span class="stat-label">Pendaftar Disetujui</span>
                  <span class="stat-badge stat-badge--green">Lolos</span>
                </div>
                <div class="stat-value">{{ approvedCount }}</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon-circle stat-icon-circle--blue">
                <Building2 :size="24" color="#1e3a8a" />
              </div>
              <div class="stat-content">
                <span class="stat-label">Mitra Industri</span>
                <div class="stat-value">{{ industryCount }} Mitra</div>
              </div>
            </div>
          </div>

          <section class="admin-control-center section-card">
            <div class="section-header">
              <div>
                <span class="section-kicker">Pusat Pengaturan</span>
                <h2 class="section-title">Semua fitur admin dalam satu tempat</h2>
                <p class="section-subtitle">Pilih area yang ingin diatur tanpa berpindah-pindah menu.</p>
              </div>
              <router-link to="/admin/manage" class="dashboard-control-link">Buka pusat kelola</router-link>
            </div>
            <div class="admin-control-grid">
              <router-link v-for="control in adminControls" :key="control.label" :to="control.to" class="admin-control-card">
                <component :is="control.icon" :size="22" :class="`admin-control-icon ${control.tone}`" />
                <span class="admin-control-label">{{ control.label }}</span>
                <small>{{ control.description }}</small>
                <strong>{{ control.count }}</strong>
              </router-link>
            </div>
          </section>

          <!-- Pendaftaran PPDB Table -->
          <div class="section-card">
            <div class="section-header">
              <div>
                <h2 class="section-title">Data Pendaftaran PPDB Masuk</h2>
                <p class="section-subtitle">Verifikasi dan perbarui status pendaftaran calon siswa baru.</p>
              </div>
              <div class="table-filter-pills">
                <button
                  type="button"
                  class="filter-pill-btn"
                  :class="{ active: filterStatus === '' }"
                  @click="filterStatus = ''"
                >
                  Semua <span class="pill-count">{{ registrations.length }}</span>
                </button>
                <button
                  type="button"
                  class="filter-pill-btn"
                  :class="{ active: filterStatus === 'Menunggu' }"
                  @click="filterStatus = 'Menunggu'"
                >
                  Menunggu <span class="pill-count count-warning">{{ pendingCount }}</span>
                </button>
                <button
                  type="button"
                  class="filter-pill-btn"
                  :class="{ active: filterStatus === 'Disetujui' }"
                  @click="filterStatus = 'Disetujui'"
                >
                  Disetujui <span class="pill-count count-success">{{ approvedCount }}</span>
                </button>
                <button
                  type="button"
                  class="filter-pill-btn"
                  :class="{ active: filterStatus === 'Ditolak' }"
                  @click="filterStatus = 'Ditolak'"
                >
                  Ditolak <span class="pill-count count-danger">{{ rejectedCount }}</span>
                </button>
              </div>
            </div>

            <div v-if="errorMessage" class="error-banner">
              <AlertTriangle :size="18" />
              <span>{{ errorMessage }}</span>
            </div>

            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Nama Calon Siswa</th>
                    <th>NISN</th>
                    <th>Pilihan Jurusan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredRegistrations.length === 0">
                    <td colspan="6" class="empty-state">
                      <FileText :size="32" color="#94a3b8" />
                      <p>Belum ada data pendaftar yang sesuai kriteria.</p>
                    </td>
                  </tr>
                  <tr v-for="item in filteredRegistrations" :key="item.id">
                    <td class="text-sm text-gray">{{ formatDisplayDate(item.created_at || item.createdAt) }}</td>
                    <td>
                      <div class="student-info">
                        <strong>{{ item.nama || item.name }}</strong>
                        <span class="text-sm text-gray">{{ item.email || item.phone || '-' }}</span>
                      </div>
                    </td>
                    <td class="font-mono text-sm">{{ item.nisn || '-' }}</td>
                    <td>
                      <span class="program-tag">
                        {{ item.program || item.major || item.jurusan || '-' }}
                      </span>
                    </td>
                    <td>
                      <span
                        class="status-badge"
                        :class="statusBadgeClass(item.status)"
                      >
                        {{ displayStatusLabel(item.status) }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button
                          @click="openDetail(item)"
                          class="act-btn btn-detail"
                          title="Lihat Detail Pendaftaran"
                        >
                          Detail
                        </button>
                        <button
                          @click="changeStatus(item.id, 'Disetujui')"
                          class="act-btn btn-approve"
                          :disabled="isStatusApproved(item.status)"
                          title="Setujui Calon Siswa"
                        >
                          Setujui
                        </button>
                        <button
                          @click="changeStatus(item.id, 'Ditolak')"
                          class="act-btn btn-reject"
                          :disabled="isStatusRejected(item.status)"
                          title="Tolak Calon Siswa"
                        >
                          Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Student Detail Modal -->
          <div v-if="selectedRegistration" class="modal-backdrop" @click="selectedRegistration = null">
            <div class="modal-card" @click.stop>
              <div class="modal-header">
                <div>
                  <span class="modal-badge">Detail Pendaftaran Siswa</span>
                  <h3 class="modal-title">{{ selectedRegistration.nama || selectedRegistration.name }}</h3>
                </div>
                <button class="modal-close" @click="selectedRegistration = null">&times;</button>
              </div>

              <div class="modal-body">
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">NISN</span>
                    <strong class="detail-val font-mono">{{ selectedRegistration.nisn || '-' }}</strong>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Status Verifikasi</span>
                    <span class="status-badge" :class="statusBadgeClass(selectedRegistration.status)">
                      {{ displayStatusLabel(selectedRegistration.status) }}
                    </span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-val">{{ selectedRegistration.email || '-' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Nomor WhatsApp / HP</span>
                    <span class="detail-val">{{ selectedRegistration.phone || selectedRegistration.no_hp || '-' }}</span>
                  </div>
                  <div class="detail-item full-width">
                    <span class="detail-label">Pilihan Program / Jurusan</span>
                    <strong class="detail-val text-brand">{{ selectedRegistration.program || selectedRegistration.major || '-' }}</strong>
                  </div>
                  <div class="detail-item full-width" v-if="selectedRegistration.alamat || selectedRegistration.address">
                    <span class="detail-label">Alamat Calon Siswa</span>
                    <span class="detail-val">{{ selectedRegistration.alamat || selectedRegistration.address }}</span>
                  </div>
                  <div class="detail-item full-width" v-if="selectedRegistration.asal_sekolah || selectedRegistration.school_origin">
                    <span class="detail-label">Asal Sekolah (SMP/MTs)</span>
                    <span class="detail-val">{{ selectedRegistration.asal_sekolah || selectedRegistration.school_origin }}</span>
                  </div>
                  <div class="detail-item" v-if="selectedRegistration.created_at">
                    <span class="detail-label">Tanggal Masuk Pendaftaran</span>
                    <span class="detail-val">{{ formatDisplayDate(selectedRegistration.created_at) }}</span>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <div class="modal-actions-left">
                  <button
                    @click="changeStatusFromModal('Disetujui')"
                    class="act-btn btn-approve modal-btn"
                    :disabled="isStatusApproved(selectedRegistration.status)"
                  >
                    ✓ Setujui Pendaftaran
                  </button>
                  <button
                    @click="changeStatusFromModal('Ditolak')"
                    class="act-btn btn-reject modal-btn"
                    :disabled="isStatusRejected(selectedRegistration.status)"
                  >
                    ✕ Tolak Pendaftaran
                  </button>
                </div>
                <button class="button secondary" @click="selectedRegistration = null">Tutup</button>
              </div>
            </div>
          </div>

          <!-- Quick Actions & Upcoming Events -->
          <div class="bottom-grid">
            <!-- Quick Actions -->
            <div class="section-card">
              <h2 class="section-title">Quick Actions</h2>
              <div class="quick-actions">
                <button class="quick-action-btn" @click="handleQuickAction('add-news')">
                  <div class="quick-action-icon quick-action-icon--blue">
                    <FilePlus :size="20" color="#1e3a8a" />
                  </div>
                  <span>Content Studio</span>
                </button>
                <button class="quick-action-btn" @click="handleQuickAction('manage-admin')">
                  <div class="quick-action-icon quick-action-icon--purple">
                    <Users :size="20" color="#6b21a8" />
                  </div>
                  <span>Kelola Admin</span>
                </button>
                <button class="quick-action-btn" @click="handleQuickAction('export-ppdb')">
                  <div class="quick-action-icon quick-action-icon--blue">
                    <Download :size="20" color="#1e3a8a" />
                  </div>
                  <span>Export PPDB Data</span>
                </button>
              </div>
            </div>

            <!-- Upcoming Events -->
            <div class="section-card events-card">
              <h2 class="section-title section-title--white">Upcoming Events</h2>
              <div class="events-list">
                <div v-for="event in upcomingEvents" :key="event.id" class="event-item">
                  <div class="event-date-box">
                    <span class="event-month">{{ event.month }}</span>
                    <span class="event-day">{{ event.day }}</span>
                  </div>
                  <div class="event-info">
                    <h3 class="event-title">{{ event.title }}</h3>
                    <p class="event-desc">{{ event.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import logo from '../../../assets/logo.webp';
import { getRegistrations, updateRegistrationStatus, getDashboardStats } from '../../../api/endpoints';
import {
  LayoutGrid,
  GraduationCap,
  Newspaper,
  Image,
  UserPlus,
  Settings,
  Search,
  Bell,
  Calendar,
  LogOut,
  Menu,
  Users,
  UserCheck,
  FileText,
  FilePlus,
  Download,
  Pencil,
  Settings as GearIcon,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Building2,
  Globe
} from 'lucide-vue-next';

const router = useRouter();

const sidebarOpen = ref(false);
const searchQuery = ref('');
const filterProgram = ref('');
const filterStatus = ref('');
const user = ref({ name: 'Administrator', email: 'admin@smknuruljadid.edu' });
const registrations = ref([]);
const selectedRegistration = ref(null);
const industryCount = ref(0);
const isLoading = ref(false);
const errorMessage = ref('');

const stats = ref({
  totalStudents: 1240,
  activePrograms: 5,
  newApplications: 42,
  publishedNews: 128
});

const animatedStats = ref({
  totalStudents: 0,
  activePrograms: 0,
  newApplications: 0,
  publishedNews: 0
});

const recentActivities = ref([
  {
    id: 1,
    icon: Pencil,
    iconBg: 'blue',
    action: 'News Update',
    target: 'Prestasi Siswa 2024',
    date: '2 hrs ago',
    status: 'Published',
    statusType: 'success',
    statusIcon: CheckCircle,
    statusIconColor: '#15803d'
  },
  {
    id: 2,
    icon: GearIcon,
    iconBg: 'green',
    action: 'Program Edit',
    target: 'Teknik Komputer',
    date: '5 hrs ago',
    status: 'Updated',
    statusType: 'info',
    statusIcon: CheckCircle,
    statusIconColor: '#1d4ed8'
  },
  {
    id: 3,
    icon: UserPlus,
    iconBg: 'orange',
    action: 'New Admission',
    target: 'Batch 2025',
    date: 'Yesterday',
    status: 'Pending',
    statusType: 'warning',
    statusIcon: Clock,
    statusIconColor: '#7c3aed'
  }
]);

const upcomingEvents = ref([
  {
    id: 1,
    month: 'OCT',
    day: '15',
    title: 'Mid-Term Exams',
    description: 'All vocational programs'
  },
  {
    id: 2,
    month: 'OCT',
    day: '22',
    title: 'Industry Visit',
    description: 'Software Engineering'
  }
]);

const userAvatar = 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=100&h=100&fit=crop&crop=face';

const adminControls = [
  { label: 'Pendaftaran PPDB', description: 'Jadwal & verifikasi', to: '/admin/manage?tab=applications', icon: UserPlus, tone: 'control-blue', count: 'Kelola' },
  { label: 'Data Siswa', description: 'Tambah & perbarui', to: '/admin/manage?tab=students', icon: GraduationCap, tone: 'control-green', count: 'Kelola' },
  { label: 'Jurusan & Silabus', description: 'Program & kurikulum', to: '/admin/manage?tab=majors', icon: Building2, tone: 'control-orange', count: 'Kelola' },
  { label: 'Berita & Konten', description: 'Publikasi website', to: '/admin/manage?tab=news', icon: Newspaper, tone: 'control-purple', count: 'Kelola' },
  { label: 'Gambar Website', description: 'Banner & visual', to: '/admin/manage?tab=images', icon: Image, tone: 'control-blue', count: 'Kelola' },
  { label: 'Kategori', description: 'Kelompokkan konten', to: '/admin/manage?tab=categories', icon: Settings, tone: 'control-green', count: 'Kelola' },
  { label: 'Pengguna Admin', description: 'Akun & hak akses', to: '/admin/manage?tab=users', icon: Users, tone: 'control-purple', count: 'Kelola' },
  { label: 'Profil Sekolah', description: 'Identitas & informasi', to: '/admin/manage?tab=profile', icon: GearIcon, tone: 'control-orange', count: 'Kelola' },
];

const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

const isStatusPending = (status) => status === 'Menunggu' || status === 'pending' || status === 'verifikasi';
const isStatusApproved = (status) => status === 'Disetujui' || status === 'diterima' || status === 'approved';
const isStatusRejected = (status) => status === 'Ditolak' || status === 'ditolak' || status === 'rejected';

const displayStatusLabel = (status) => {
  if (isStatusApproved(status)) return 'Disetujui';
  if (isStatusRejected(status)) return 'Ditolak';
  return 'Menunggu';
};

const statusBadgeClass = (status) => {
  if (isStatusApproved(status)) return 'badge-approved';
  if (isStatusRejected(status)) return 'badge-rejected';
  return 'badge-pending';
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const pendingCount = computed(() => registrations.value.filter(r => isStatusPending(r.status)).length);
const approvedCount = computed(() => registrations.value.filter(r => isStatusApproved(r.status)).length);
const rejectedCount = computed(() => registrations.value.filter(r => isStatusRejected(r.status)).length);

const openDetail = (item) => {
  selectedRegistration.value = item;
};

const changeStatusFromModal = async (newStatus) => {
  if (!selectedRegistration.value) return;
  await changeStatus(selectedRegistration.value.id, newStatus);
  selectedRegistration.value.status = newStatus;
};

const filteredRegistrations = computed(() => {
  return registrations.value.filter(item => {
    const name = (item.nama || item.name || '').toLowerCase();
    const email = (item.email || '').toLowerCase();
    const nisn = (item.nisn || '');
    const q = searchQuery.value.toLowerCase();

    const matchSearch = !searchQuery.value || name.includes(q) || email.includes(q) || nisn.includes(q);
    const matchProgram = !filterProgram.value || item.program === filterProgram.value;
    const matchStatus = !filterStatus.value || displayStatusLabel(item.status) === filterStatus.value;

    return matchSearch && matchProgram && matchStatus;
  });
});

function animateValue(key, end, duration = 1500) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeOut);
    animatedStats.value[key] = current;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

let searchDebounce = null;
function handleSearch() {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    console.log('Search:', searchQuery.value);
  }, 300);
}

function handleNewEntry() {
  router.push('/admin/content');
}

function handleQuickAction(action) {
  if (action === 'add-news') router.push('/admin/content');
  else if (action === 'update-program') router.push('/admin/content');
  else if (action === 'manage-admin') router.push('/admin/manage');
  else if (action === 'export-ppdb') {
    window.alert('Data pendaftaran PPDB siap diekspor.');
  }
}

const changeStatus = async (id, newStatus) => {
  errorMessage.value = '';
  try {
    await updateRegistrationStatus(id, newStatus);
    const item = registrations.value.find(r => r.id === id || r.id == id);
    if (item) item.status = newStatus;
  } catch (error) {
    console.error('Gagal memperbarui status:', error);
    errorMessage.value = 'Gagal memperbarui status pendaftaran. Silakan coba lagi.';
  }
};

const handleLogout = () => {
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_email');
  localStorage.removeItem('admin_remember_email');
  sessionStorage.removeItem('admin_token');
  sessionStorage.removeItem('admin_email');
  router.push('/login');
};

const fetchData = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const [regRes, statsRes] = await Promise.allSettled([
      getRegistrations(),
      getDashboardStats()
    ]);

    if (regRes.status === 'fulfilled') {
      const res = regRes.value;
      if (Array.isArray(res.data)) {
        registrations.value = res.data;
      } else if (Array.isArray(res.data?.data?.data)) {
        registrations.value = res.data.data.data;
      } else if (Array.isArray(res.data?.data)) {
        registrations.value = res.data.data;
      } else {
        registrations.value = [];
      }
    }

    if (statsRes.status === 'fulfilled') {
      const statsData = statsRes.value?.data?.data;
      if (statsData) {
        industryCount.value = statsData.total_industry_partners ?? statsData.industry_partners ?? 0;
        if (statsData.total_students) stats.value.totalStudents = statsData.total_students;
        if (statsData.total_majors) stats.value.activePrograms = statsData.total_majors;
        if (statsData.total_registrations) stats.value.newApplications = statsData.total_registrations;
        if (statsData.total_news) stats.value.publishedNews = statsData.total_news;
      }
    }
  } catch (error) {
    console.error('Gagal mengambil data pendaftaran:', error);
    errorMessage.value = 'Gagal memuat data pendaftaran. Silakan coba lagi nanti.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || localStorage.getItem('admin_token');
  if (!token) {
    router.push('/login');
    return;
  }

  const storedEmail = localStorage.getItem('admin_email') || sessionStorage.getItem('admin_email');
  if (storedEmail) {
    user.value = { name: 'Administrator', email: storedEmail };
  }

  fetchData();
  
  animateValue('totalStudents', stats.value.totalStudents);
  animateValue('activePrograms', stats.value.activePrograms);
  animateValue('newApplications', stats.value.newApplications);
  animateValue('publishedNews', stats.value.publishedNews);
});
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #f9fafb;
  font-family: 'Inter', 'Plus Jakarta Sans', system-ui, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: #f3f4ff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 40;
  transition: transform 0.3s ease;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-brand {
  margin-bottom: 24px;
}

.sidebar-logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.sidebar-logo-img {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
}

.sidebar-brand-name {
  display: block;
  font-weight: 700;
  font-size: 1rem;
  color: #1e3a8a;
}

.sidebar-brand-subtitle {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
}

.sidebar-new-entry {
  width: 100%;
  height: 50px;
  background: #1e3a8a;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-bottom: 24px;
}

.sidebar-new-entry:hover {
  background: #16264d;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  color: #4b5563;
  transition: all 0.2s ease;
}

.sidebar-item:hover {
  background: #e5e7eb;
}

.sidebar-item--active {
  background: #e0e7ff;
  color: #1e3a8a;
  font-weight: 700;
}

.sidebar-spacer {
  flex: 1;
}

/* Main Wrapper */
.main-wrapper {
  flex: 1;
  margin-left: 280px;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* Header */
.dashboard-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 32px;
  position: sticky;
  top: 0;
  z-index: 30;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.header-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.header-search {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.header-search-input {
  width: 100%;
  height: 45px;
  padding: 0 16px 0 44px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  background: #f8f7ff;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.header-search-input:focus {
  border-color: #3b82f6;
}

.header-search svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-notif-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.notif-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
}

.header-divider {
  width: 1px;
  height: 24px;
  background: #d1d5db;
}

.header-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
}

.header-user-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.header-user-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: #1e293b;
}

.header-user-role {
  font-size: 0.75rem;
  color: #6b7280;
}

.header-logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

/* Body */
.dashboard-body {
  flex: 1;
  padding: 32px;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Welcome */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.welcome-title {
  font-size: clamp(1.5rem, 3vw, 2.625rem);
  font-weight: 700;
  color: #1e3a8a;
  margin: 0 0 8px;
}

.welcome-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.date-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #eef2ff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e3a8a;
  white-space: nowrap;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.admin-control-center {
  padding: 28px;
}

.section-kicker {
  display: block;
  margin-bottom: 6px;
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dashboard-control-link {
  color: #1d4ed8;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.admin-control-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 22px;
}

.admin-control-card {
  min-height: 132px;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
  color: #1f2937;
  text-decoration: none;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 5px 10px;
  align-items: center;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.admin-control-card:hover {
  border-color: #93c5fd;
  box-shadow: 0 8px 18px rgba(30, 64, 175, 0.1);
  transform: translateY(-2px);
}

.admin-control-icon {
  grid-row: span 2;
  padding: 9px;
  width: 40px;
  height: 40px;
  border-radius: 11px;
}

.control-blue { color: #1d4ed8; background: #dbeafe; }
.control-green { color: #047857; background: #d1fae5; }
.control-orange { color: #c2410c; background: #ffedd5; }
.control-purple { color: #7e22ce; background: #f3e8ff; }

.admin-control-label {
  font-size: 0.9rem;
  font-weight: 800;
}

.admin-control-card small {
  grid-column: 2;
  color: #6b7280;
  font-size: 0.75rem;
}

.admin-control-card strong {
  color: #2563eb;
  font-size: 0.75rem;
}

.stat-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  min-height: 140px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.stat-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-circle--blue {
  background: #e0e7ff;
}

.stat-icon-circle--green {
  background: #d1fae5;
}

.stat-icon-circle--orange {
  background: #ffedd5;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.stat-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.stat-badge--green {
  background: #dcfce7;
  color: #15803d;
}

.stat-badge--orange {
  background: #f59e0b;
  color: #ffffff;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #1e3a8a;
  line-height: 1.2;
}

.stat-subtext {
  font-size: 12px;
  color: #6b7280;
}

/* Section Card */
.section-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 1rem;
  flex-wrap: wrap;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.section-title--white {
  color: #ffffff;
}

.section-link {
  font-size: 14px;
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

/* Table */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  color: #1e293b;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  vertical-align: middle;
}

.activity-icon--blue {
  background: #dbeafe;
}

.activity-icon--green {
  background: #d1fae5;
}

.activity-icon--orange {
  background: #ffedd5;
}

.activity-action {
  font-weight: 500;
}

.activity-target {
  color: #6b7280;
  font-style: italic;
}

.activity-date {
  color: #9ca3af;
  font-size: 13px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge--success {
  background: #dcfce7;
  color: #15803d;
}

.status-badge--info {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-badge--warning {
  background: #f3e8ff;
  color: #7c3aed;
}

/* Bottom Grid */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1e293b;
  transition: background 0.2s ease;
}

.quick-action-btn:hover {
  background: #f9fafb;
}

.quick-action-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-action-icon--blue {
  background: #e0e7ff;
}

.quick-action-icon--purple {
  background: #f3e8ff;
}

/* Events */
.events-card {
  background: #1e3a8a;
  color: #ffffff;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.event-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.event-date-box {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px 12px;
  text-align: center;
  min-width: 60px;
}

.event-month {
  display: block;
  font-size: 12px;
  font-weight: 600;
  opacity: 0.8;
}

.event-day {
  display: block;
  font-size: 24px;
  font-weight: 700;
}

.event-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 4px;
}

.event-desc {
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0;
}

/* Responsive */
@media (max-width: 1279px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .admin-control-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .section-header {
    flex-wrap: wrap;
  }
}

@media (max-width: 1023px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar--open {
    transform: translateX(0);
  }

  .main-wrapper {
    margin-left: 0;
  }

  .header-menu-btn {
    display: block;
  }

  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .header-user-text {
    display: none;
  }

  .header-divider {
    display: none;
  }

  .modal-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .modal-actions-left {
    flex-direction: column;
  }

  .modal-btn {
    width: 100%;
    justify-content: center;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 639px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
    min-height: unset;
  }

  .stat-value {
    font-size: 28px;
  }

  .admin-control-center {
    padding: 16px;
  }

  .admin-control-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .admin-control-card {
    min-height: unset;
    padding: 14px;
  }

  .welcome-section {
    flex-direction: column;
    gap: 12px;
  }

  .date-badge {
    font-size: 0.8rem;
  }

  .dashboard-header {
    padding: 12px 16px;
  }

  .header-search {
    max-width: none;
  }

  .dashboard-body {
    padding: 16px;
  }

  .section-card {
    padding: 20px 16px;
  }

  .table-filter-pills {
    gap: 6px;
  }

  .filter-pill-btn {
    padding: 5px 10px;
    font-size: 0.75rem;
  }
}

/* Filter Pills */
.table-filter-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  padding: 6px 14px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }

  &.active {
    background: #1e3a8a;
    border-color: #1e3a8a;
    color: #ffffff;

    .pill-count {
      background: rgba(255, 255, 255, 0.25);
      color: #ffffff;
    }
  }
}

.pill-count {
  display: inline-block;
  padding: 1px 7px;
  border-radius: 9999px;
  font-size: 0.75rem;
  background: #e2e8f0;
  color: #475569;

  &.count-warning {
    background: #fef3c7;
    color: #b45309;
  }
  &.count-success {
    background: #dcfce7;
    color: #15803d;
  }
  &.count-danger {
    background: #fee2e2;
    color: #b91c1c;
  }
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 16px;
}

/* Action buttons */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 6px;
}

.act-btn {
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

.btn-detail {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  &:hover:not(:disabled) {
    background: #e2e8f0;
    color: #0f172a;
  }
}

.btn-approve {
  background: #16a34a;
  color: #ffffff;
  &:hover:not(:disabled) {
    background: #15803d;
  }
}

.btn-reject {
  background: #ef4444;
  color: #ffffff;
  &:hover:not(:disabled) {
    background: #dc2626;
  }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.badge-pending {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.badge-approved {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.badge-rejected {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.student-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.student-info strong {
  color: #0f172a;
  font-weight: 600;
}

.program-tag {
  display: inline-block;
  padding: 4px 8px;
  background: #eef2ff;
  color: #3730a3;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 40px 16px;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spin-anim {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 100;
  animation: fadeIn 0.2s ease;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-badge {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #2563eb;
  display: block;
  margin-bottom: 4px;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #94a3b8;
  cursor: pointer;
  line-height: 1;
  padding: 4px;

  &:hover {
    color: #0f172a;
  }
}

.modal-body {
  padding: 24px;
  flex: 1;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
}

.detail-val {
  font-size: 0.9375rem;
  color: #0f172a;
}

.text-brand {
  color: #1e3a8a;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

.modal-actions-left {
  display: flex;
  gap: 8px;
}

.modal-btn {
  padding: 8px 16px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
</style>
