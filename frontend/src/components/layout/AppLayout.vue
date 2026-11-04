<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">
    <!-- Overlay for mobile -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" @click="isMobileMenuOpen = false"></div>
    
    <!-- Sidebar (Light Professional) -->
    <aside class="w-64 flex flex-col h-full bg-white border-r border-slate-200 z-50 transition-transform duration-300 fixed lg:static inset-y-0 left-0" :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'">
      <!-- Logo Section -->
      <div class="h-16 flex items-center px-6 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100 shadow-sm">
            <img src="../../assets/logo-nj.jpg" alt="SMK Nurul Jadid" class="w-full h-full object-cover" />
          </div>
          <span class="text-sm font-bold tracking-tight text-slate-900 uppercase">Akademik <span class="text-indigo-600">SMK</span></span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
          :class="[
            isActive(item.path) 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
          @click="isMobileMenuOpen = false"
        >
          <div class="w-5 h-5" v-html="item.icon"></div>
          {{ item.label }}
        </RouterLink>
      </nav>

      <!-- User Profile (Bottom) -->
      <div class="p-4 border-t border-slate-100 bg-slate-50/50">
        <div class="flex items-center gap-3 mb-4">
          <img :src="authStore.user?.avatar" class="w-9 h-9 rounded-full object-cover border border-slate-200" />
          <div class="min-w-0">
            <p class="text-xs font-semibold text-slate-900 truncate">{{ authStore.user?.name }}</p>
            <p class="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{{ authStore.user?.role }}</p>
          </div>
        </div>
        <button 
          @click="handleLogout"
          class="w-full h-10 flex items-center justify-center gap-2 px-3 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Bar -->
      <header class="h-16 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 shrink-0">
        <div class="flex items-center gap-4 min-w-0">
          <button @click="isMobileMenuOpen = true" aria-label="Buka menu navigasi" class="lg:hidden p-2 shrink-0 text-slate-500 hover:bg-slate-100 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30">
             <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
             </svg>
          </button>
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-widest truncate">{{ currentRouteLabel }}</span>
        </div>
        
        <div class="flex items-center gap-4 shrink-0">
          <div class="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span class="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">Live</span>
          </div>
          <div class="hidden sm:block h-8 w-px bg-slate-200"></div>
          <button aria-label="Notifikasi" class="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
        <div class="max-w-6xl mx-auto">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const isMobileMenuOpen = ref(false)

watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})

const navigationConfig = [
  { 
    label: 'Dashboard', 
    path: '/dashboard', 
    roles: ['admin', 'guru', 'siswa', 'orang_tua'],
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>'
  },
  { 
    label: 'Siswa', 
    path: '/students', 
    roles: ['admin', 'guru', 'orang_tua'],
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>'
  },
  { 
    label: 'Kelas', 
    path: '/classes', 
    roles: ['admin'],
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>'
  },
  { 
    label: 'Guru', 
    path: '/teachers', 
    roles: ['admin'],
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>'
  },
  { 
    label: 'Jadwal', 
    path: '/schedule', 
    roles: ['admin', 'guru', 'siswa', 'orang_tua'],
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>'
  },
  { 
    label: 'Absensi', 
    path: '/attendance', 
    roles: ['admin', 'guru', 'siswa', 'orang_tua'],
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>'
  },
  { 
    label: 'Nilai', 
    path: '/grades', 
    roles: ['admin', 'guru', 'siswa', 'orang_tua'],
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>'
  },
  { 
    label: 'Pengumuman', 
    path: '/announcements', 
    roles: ['admin', 'guru', 'siswa', 'orang_tua'],
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>'
  },
  {
    label: 'Komunikasi',
    path: '/communication',
    roles: ['admin', 'guru', 'siswa', 'orang_tua'],
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h6m-6 4h8M3 20l4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-2l-4 4H3z" /></svg>'  },
  {
    label: 'Tagihan',
    path: '/billing',
    roles: ['admin', 'guru', 'siswa', 'orang_tua'],
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V8c0-2.21 3.582-4 8-4s8 1.79 8 4v6c0 2.21-3.582 4-8 4z" /></svg>'  },
  {
    label: 'Ekskul',
    path: '/ekskul',
    roles: ['admin', 'guru'],
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>'
  },
  {
    label: 'Prestasi',
    path: '/prestasi',
    roles: ['admin', 'guru'],
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5v10a2 2 0 002 2h10a2 2 0 002-2V5m-2 0l3-3m-3 3l3 3" /></svg>'
  }
]

const navigationItems = computed(() => {
  const userRole = authStore.user?.role || ''
  return navigationConfig.filter(item => item.roles.includes(userRole))
})

const currentRouteLabel = computed(() => {
  return navigationConfig.find(item => item.path === route.path)?.label || 'Halaman'
})

const isActive = (path: string) => {
  return route.path === path
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
