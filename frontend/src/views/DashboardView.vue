<template>
  <div class="dashboard-container">
    <div class="welcome-banner mb-6">
      <div class="welcome-text">
        <h1>Halo, {{ authStore.user?.name }}!</h1>
        <p class="text-muted">
          Selamat datang di Sistem Informasi Akademik Sekolah. Hari ini adalah
          hari yang baik untuk belajar.
        </p>
      </div>
      <div class="current-date">
        {{ currentDate }}
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <!-- Admin (Teacher) Stats -->
      <template v-if="authStore.isAdmin">
        <StatCard
          title="Total Siswa"
          :value="dashboardStore.stats.totalStudents"
          variant="primary"
        >
          <template #icon><UsersIcon :size="24" /></template>
        </StatCard>
        <StatCard
          title="Total Guru"
          :value="dashboardStore.stats.totalTeachers"
          variant="success"
        >
          <template #icon><GraduationCapIcon :size="24" /></template>
        </StatCard>
        <StatCard
          title="Total Kelas"
          :value="dashboardStore.stats.totalClasses"
          variant="info"
        >
          <template #icon><LayersIcon :size="24" /></template>
        </StatCard>
      </template>

      <!-- Student / Parent Stats -->
      <template v-else>
        <StatCard
          title="Rata-rata Nilai"
          :value="dashboardStore.stats.averageGrade"
          variant="success"
        >
          <template #icon><BookOpenIcon :size="24" /></template>
        </StatCard>
        <StatCard
          title="Persentase Kehadiran"
          :value="`${dashboardStore.stats.attendanceRate}%`"
          variant="primary"
        >
          <template #icon><CalendarCheckIcon :size="24" /></template>
        </StatCard>
        <StatCard
          title="Tagihan Tertunda"
          :value="dashboardStore.stats.pendingPayments"
          variant="danger"
        >
          <template #icon><CreditCardIcon :size="24" /></template>
        </StatCard>
      </template>
    </div>

    <!-- Visual Dashboard Layout Grid -->
    <div class="dashboard-grid">
      <!-- Main Content Left (Charts & Activities) -->
      <div class="dashboard-main">
        <div class="card mb-6">
          <div class="card-header">
            <h3>Statistik Akademik & Kehadiran</h3>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas ref="canvasRef"></canvas>
            </div>
          </div>
        </div>

        <div class="quick-actions-card card">
          <div class="card-header">
            <h3>Akses Cepat Menu</h3>
          </div>
          <div class="card-body">
            <div class="quick-actions-grid">
              <router-link to="/schedule" class="action-btn">
                <ClockIcon :size="24" class="action-icon" />
                <span>Jadwal Pelajaran</span>
              </router-link>
              <router-link to="/grades" class="action-btn">
                <PenToolIcon :size="24" class="action-icon" />
                <span>Nilai Akademik</span>
              </router-link>
              <router-link to="/attendance" class="action-btn">
                <CheckCircleIcon :size="24" class="action-icon" />
                <span>Kehadiran / Presensi</span>
              </router-link>
              <router-link to="/messages" class="action-btn">
                <MessageSquareIcon :size="24" class="action-icon" />
                <span>Kirim Pesan</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Right (Announcements & Events) -->
      <div class="dashboard-sidebar-right">
        <div class="card">
          <div class="card-header">
            <h3>Pengumuman Terbaru</h3>
            <router-link to="/announcements" class="text-xs font-semibold"
              >Lihat Semua</router-link
            >
          </div>
          <div class="card-body no-padding">
            <div
              v-if="dashboardStore.recentAnnouncements.length === 0"
              class="empty-announcements p-6"
            >
              <BellIcon :size="24" class="empty-icon" />
              <span>Tidak ada pengumuman terbaru saat ini.</span>
            </div>
            <div v-else class="announcements-list">
              <div
                v-for="ann in dashboardStore.recentAnnouncements"
                :key="ann.id"
                class="announcement-item"
              >
                <div class="announcement-meta">
                  <span class="badge badge-success text-xs">Pengumuman</span>
                  <span class="ann-time text-xs">{{
                    formatDate(ann.createdAt)
                  }}</span>
                </div>
                <h4 class="announcement-title mt-1">{{ ann.title }}</h4>
                <p class="announcement-excerpt text-muted text-sm">
                  {{ truncateText(ann.content, 80) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useDashboardStore } from "../stores/dashboardStore";
import StatCard from "../components/ui/StatCard.vue";
import Chart from "chart.js/auto";
import {
  Users as UsersIcon,
  GraduationCap as GraduationCapIcon,
  Layers as LayersIcon,
  BookOpen as BookOpenIcon,
  CalendarCheck as CalendarCheckIcon,
  CreditCard as CreditCardIcon,
  Clock as ClockIcon,
  PenTool as PenToolIcon,
  CheckCircle as CheckCircleIcon,
  MessageSquare as MessageSquareIcon,
  Bell as BellIcon,
} from "lucide-vue-next";

const authStore = useAuthStore();
const dashboardStore = useDashboardStore();

const canvasRef = ref(null);
let activeChart = null;

const currentDate = computed(() => {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const truncateText = (text, len) => {
  if (!text) return "";
  return text.length > len ? text.substring(0, len) + "..." : text;
};

// Mount Charts
const initChart = () => {
  if (!canvasRef.value) return;
  if (activeChart) {
    activeChart.destroy();
  }

  const ctx = canvasRef.value.getContext("2d");

  if (authStore.isAdmin) {
    // Menghitung data per kelas dari raw data
    const classes = dashboardStore.classesList || [];
    const labels = classes.map((c) => c.name);

    // Rata-rata nilai per kelas
    const gradesData = classes.map((c) => {
      const classStudents = dashboardStore.studentList
        .filter((s) => s.class_id === c.id)
        .map((s) => s.id);
      const classGrades = dashboardStore.rawGrades.filter((g) =>
        classStudents.includes(g.student_id),
      );
      if (classGrades.length === 0) return 0;
      const sum = classGrades.reduce((acc, g) => acc + Number(g.score), 0);
      return Math.round((sum / classGrades.length) * 10) / 10;
    });

    // Persentase kehadiran per kelas
    const attendanceData = classes.map((c) => {
      const classStudents = dashboardStore.studentList
        .filter((s) => s.class_id === c.id)
        .map((s) => s.id);
      const classAtt = dashboardStore.rawAttendances.filter((a) =>
        classStudents.includes(a.student_id),
      );
      if (classAtt.length === 0) return 0;
      const present = classAtt.filter((a) => a.status === "Hadir").length;
      return Math.round((present / classAtt.length) * 100);
    });

    activeChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels.length > 0 ? labels : ["Belum Ada Kelas"],
        datasets: [
          {
            label: "Rata-rata Nilai Ujian (%)",
            data: gradesData.length > 0 ? gradesData : [0],
            backgroundColor: "rgba(217, 119, 6, 0.65)", // Amber/Gold
            borderColor: "#d97706",
            borderWidth: 1.5,
            borderRadius: 4,
          },
          {
            label: "Persentase Kehadiran (%)",
            data: attendanceData.length > 0 ? attendanceData : [0],
            backgroundColor: "rgba(30, 58, 138, 0.65)", // Navy
            borderColor: "#1e3a8a",
            borderWidth: 1.5,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    });
  } else {
    // Hitung rata-rata nilai per bulan untuk siswa
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const currentMonth = new Date().getMonth();
    // Ambil 6 bulan terakhir
    const labels = [];
    const monthlyAverages = [];

    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      let y = new Date().getFullYear();
      if (m < 0) {
        m += 12;
        y -= 1;
      }
      labels.push(months[m]);

      const monthGrades = dashboardStore.rawGrades.filter((g) => {
        const d = new Date(g.grade_date || g.createdAt);
        return d.getMonth() === m && d.getFullYear() === y;
      });

      if (monthGrades.length > 0) {
        const sum = monthGrades.reduce((acc, g) => acc + Number(g.score), 0);
        monthlyAverages.push(Math.round(sum / monthGrades.length));
      } else {
        monthlyAverages.push(0); // atau biarkan 0 jika tidak ada nilai bulan itu
      }
    }

    activeChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Rata-rata Nilai Bulanan",
            data: monthlyAverages,
            backgroundColor: "rgba(30, 58, 138, 0.15)", // Navy
            borderColor: "#1e3a8a",
            borderWidth: 3,
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    });
  }
};

onMounted(async () => {
  await dashboardStore.fetchDashboardData();
  nextTick(() => {
    initChart();
  });
});

// Re-init chart if user role changes or stats change
watch(
  () => dashboardStore.stats,
  () => {
    initChart();
  },
  { deep: true },
);
</script>

<style scoped>
.welcome-banner {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6) var(--spacing-8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  box-shadow: var(--shadow-sm);
}

.welcome-text h1 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-neutral-800);
}

.current-date {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: var(--color-primary-700);
  background-color: var(--color-primary-50);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-full);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.chart-container {
  height: 320px;
  position: relative;
  width: 100%;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);
}

@media (min-width: 640px) {
  .quick-actions-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  background-color: var(--color-neutral-50);
  border: 1px solid var(--color-border);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-700);
  gap: var(--spacing-2);
  text-align: center;
  transition: var(--transition-fast);
}

.action-btn:hover {
  background-color: var(--color-primary-50);
  border-color: var(--color-primary-300);
  color: var(--color-primary-700);
  transform: translateY(-2px);
}

.action-icon {
  font-size: var(--font-size-2xl);
}

.no-padding {
  padding: 0 !important;
}

.announcements-list {
  display: flex;
  flex-direction: column;
}

.announcement-item {
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  transition: var(--transition-fast);
}

.announcement-item:last-child {
  border-bottom: none;
}

.announcement-item:hover {
  background-color: var(--color-neutral-50);
}

.announcement-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ann-time {
  color: var(--color-neutral-400);
}

.announcement-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-neutral-800);
}

.announcement-excerpt {
  margin-top: var(--spacing-1);
  line-height: 1.4;
}

.empty-announcements {
  text-align: center;
  color: var(--color-neutral-400);
  font-size: var(--font-size-sm);
}

.empty-icon {
  display: block;
  margin-bottom: var(--spacing-2);
}
</style>
