import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginPage from '../features/auth/LoginPage.vue'
import DashboardPage from '../features/dashboard/DashboardPage.vue'
import StudentsPage from '../features/students/StudentsPage.vue'
import TeachersPage from '../features/teachers/TeachersPage.vue'
import SchedulePage from '../features/schedule/SchedulePage.vue'
import AttendancePage from '../features/attendance/AttendancePage.vue'
import GradesPage from '../features/grades/GradesPage.vue'
import AnnouncementsPage from '../features/announcements/AnnouncementsPage.vue'
import CommunicationPage from '../features/communication/CommunicationPage.vue'
import BillingPage from '../features/billing/BillingPage.vue'
import ClassesPage from '../features/classes/ClassesPage.vue'
import EkskulPage from '../features/ekskul/EkskulPage.vue'
import PrestasiPage from '../features/prestasi/PrestasiPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    component: LoginPage,
    meta: { requiresAuth: false, layout: 'auth' }
  },
  {
    path: '/dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true, roles: ['admin', 'guru', 'siswa', 'orang_tua'] }
  },
  {
    path: '/classes',
    component: ClassesPage,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/students',
    component: StudentsPage,
    meta: { requiresAuth: true, roles: ['admin', 'guru', 'orang_tua'] }
  },
  {
    path: '/teachers',
    component: TeachersPage,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/schedule',
    component: SchedulePage,
    meta: { requiresAuth: true, roles: ['admin', 'guru', 'siswa', 'orang_tua'] }
  },
  {
    path: '/attendance',
    component: AttendancePage,
    meta: { requiresAuth: true, roles: ['admin', 'guru', 'siswa', 'orang_tua'] }
  },
  {
    path: '/grades',
    component: GradesPage,
    meta: { requiresAuth: true, roles: ['admin', 'guru', 'siswa', 'orang_tua'] }
  },
  {
    path: '/communication',
    component: CommunicationPage,
    meta: { requiresAuth: true, roles: ['admin', 'guru', 'siswa', 'orang_tua'] }
  },
  {
    path: '/billing',
    component: BillingPage,
    meta: { requiresAuth: true, roles: ['admin', 'guru', 'siswa', 'orang_tua'] }
  },
  {
    path: '/announcements',
    component: AnnouncementsPage,
    meta: { requiresAuth: true, roles: ['admin', 'guru', 'siswa', 'orang_tua'] }
  },
  {
    path: '/ekskul',
    component: EkskulPage,
    meta: { requiresAuth: true, roles: ['admin', 'guru'] }
  },
  {
    path: '/prestasi',
    component: PrestasiPage,
    meta: { requiresAuth: true, roles: ['admin', 'guru'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guards
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    await authStore.initAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard')
  } else if (to.meta.roles && !((to.meta.roles as string[]).includes(authStore.user?.role || ''))) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
