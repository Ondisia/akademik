<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Welcome Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Selamat Datang, {{ authStore.user?.name }}</h1>
        <p class="text-sm text-slate-500 mt-1">Berikut adalah ikhtisar aktivitas akademik SMK hari ini.</p>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-xs font-semibold">{{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
      </div>
    </div>

    <!-- Key Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div v-for="stat in stats" :key="stat.label" class="clean-card p-4 sm:p-5 flex items-center gap-4">
        <div :class="['w-12 h-12 rounded-lg flex items-center justify-center shrink-0', stat.bgClass, stat.textClass]">
          <component :is="stat.icon" class="w-6 h-6" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-medium text-slate-500 uppercase tracking-wider truncate">{{ stat.label }}</p>
          <p class="text-xl font-bold text-slate-900 mt-0.5 tabular-nums truncate">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      <!-- Main Content Column -->
      <div class="lg:col-span-2 space-y-6 sm:space-y-8">
        <!-- Announcements -->
        <div class="clean-card overflow-hidden">
          <div class="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-2">
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Pengumuman Terbaru</h2>
            <RouterLink to="/announcements" class="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors py-2 -my-2 px-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">Lihat Semua</RouterLink>
          </div>
          <div class="divide-y divide-slate-50">
            <div v-for="announcement in dashboardStore.latestAnnouncements" :key="announcement.id" class="p-4 sm:p-6 hover:bg-slate-50/50 transition-colors">
              <div class="flex items-start gap-4">
                <div :class="['w-2 h-2 mt-2 rounded-full shrink-0', announcement.category === 'urgent' ? 'bg-rose-500' : announcement.category === 'warning' ? 'bg-amber-500' : 'bg-indigo-500']"></div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <h3 class="text-sm font-bold text-slate-900 truncate">{{ announcement.title }}</h3>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0" :class="announcement.category === 'urgent' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'">
                      {{ announcement.category }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 leading-relaxed line-clamp-2">{{ announcement.content }}</p>
                </div>
              </div>
            </div>
            <div v-if="dashboardStore.latestAnnouncements.length === 0" class="p-8 sm:p-12 text-center text-slate-500 text-sm italic">
              Tidak ada pengumuman hari ini.
            </div>
          </div>
        </div>

        <!-- Attendance Overview (Simple Bar Chart) -->
        <div class="clean-card p-4 sm:p-6">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Persentase Kehadiran Mingguan</h2>
            <div class="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-indigo-500"></div> Hadir</div>
              <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-slate-200"></div> Tidak Hadir</div>
            </div>
          </div>
          <div class="h-48 flex items-end justify-between gap-3 px-2">
            <div v-for="i in 7" :key="i" class="flex-1 flex flex-col items-center gap-3 group">
              <div class="w-full bg-slate-100 rounded-t-sm relative h-full overflow-hidden">
                <div class="absolute bottom-0 left-0 right-0 bg-indigo-500 transition-all duration-500" :style="{ height: Math.random() * 40 + 60 + '%' }"></div>
              </div>
              <span class="text-[10px] font-bold text-slate-500">Hari {{ i }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Side Column -->
      <div class="space-y-6 sm:space-y-8">
        <!-- Quick Actions -->
        <div class="clean-card p-4 sm:p-6">
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Aksi Cepat</h2>
          <div class="space-y-3">
            <RouterLink v-if="authStore.hasAnyRole(['admin'])" to="/teachers" class="flex items-center gap-3 p-3 min-h-14 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
              <div class="w-9 h-9 bg-slate-100 rounded flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <span class="text-xs font-bold text-slate-700">Manajemen Guru</span>
            </RouterLink>
            <RouterLink to="/attendance" class="flex items-center gap-3 p-3 min-h-14 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
              <div class="w-9 h-9 bg-slate-100 rounded flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <span class="text-xs font-bold text-slate-700">Input Presensi</span>
            </RouterLink>
            <RouterLink to="/grades" class="flex items-center gap-3 p-3 min-h-14 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
              <div class="w-9 h-9 bg-slate-100 rounded flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <span class="text-xs font-bold text-slate-700">Kelola Nilai</span>
            </RouterLink>
          </div>
        </div>

        <!-- Help/Support -->
        <div class="bg-indigo-600 rounded-card p-6 text-white shadow-lg shadow-indigo-200">
          <h3 class="font-bold text-sm uppercase tracking-wider mb-2">Butuh Bantuan?</h3>
          <p class="text-xs text-indigo-100 leading-relaxed mb-6">Jika Anda mengalami kendala teknis saat menggunakan sistem akademik ini, silakan hubungi tim dukungan kami.</p>

          <div class="space-y-3 mb-4">
            <template v-if="formattedWa.length">
              <div class="text-[10px] uppercase tracking-wider text-indigo-100 font-semibold">WhatsApp</div>
              <div class="grid grid-cols-1 gap-2">
                <a
                  v-for="(contact, index) in formattedWa"
                  :key="`wa-${index}`"
                  :href="`https://wa.me/${contact}`"
                  target="_blank"
                  class="block px-4 py-2 bg-white text-indigo-600 rounded font-bold text-[11px] uppercase tracking-widest hover:bg-indigo-50 transition-colors"
                >
                  WA {{ index + 1 }}
                </a>
              </div>
            </template>
            <template v-else>
              <div class="text-xs text-indigo-100/80">Kontak WhatsApp belum dikonfigurasi oleh admin.</div>
            </template>
          </div>

          <div class="space-y-3">
            <template v-if="formattedIg.length">
              <div class="text-[10px] uppercase tracking-wider text-indigo-100 font-semibold">Instagram</div>
              <div class="grid grid-cols-1 gap-2">
                <a
                  v-for="(username, index) in formattedIg"
                  :key="`ig-${index}`"
                  :href="`https://instagram.com/${username}`"
                  target="_blank"
                  class="block px-4 py-2 bg-white text-indigo-600 rounded font-bold text-[11px] uppercase tracking-widest hover:bg-indigo-50 transition-colors"
                >
                  IG {{ index + 1 }}
                </a>
              </div>
            </template>
            <template v-else>
              <div class="text-xs text-indigo-100/80">Akun Instagram belum dikonfigurasi oleh admin.</div>
            </template>
          </div>
        </div>

        <div v-if="authStore.hasAnyRole(['admin'])">
          <HelpContactsSettings />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted } from 'vue'
import { useDashboardStore } from '../../stores/dashboard'
import { useHelpContactsStore } from '../../stores/helpContacts'
import { useAuthStore } from '../../stores/auth'
import { RouterLink } from 'vue-router'
import HelpContactsSettings from './HelpContactsSettings.vue'

const dashboardStore = useDashboardStore()
const helpContactsStore = useHelpContactsStore()
const authStore = useAuthStore()

onMounted(async () => {
  await Promise.all([
    dashboardStore.fetchDashboardData(),
    helpContactsStore.fetchHelpContacts()
  ])
})

const formattedWa = computed(() =>
  helpContactsStore.wa
    .filter(contact => contact?.trim())
    .map(contact => contact.replace(/\D+/g, ''))
)

const formattedIg = computed(() =>
  helpContactsStore.ig
    .filter(username => username?.trim())
    .map(username => username.trim().replace(/^@/, ''))
)

const stats = computed(() => [
  { 
    label: 'Total Siswa', 
    value: dashboardStore.studentsCount, 
    icon: h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })]),
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-600'
  },
  { 
    label: 'Tenaga Pengajar', 
    value: dashboardStore.teachersCount, 
    icon: h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' })]),
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-600'
  },
  { 
    label: 'Hadir Hari Ini', 
    value: dashboardStore.attendanceTodayStats.present, 
    icon: h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })]),
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-600'
  },
  { 
    label: 'Alfa Hari Ini', 
    value: dashboardStore.attendanceTodayStats.absent, 
    icon: h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })]),
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-600'
  }
])
</script>
