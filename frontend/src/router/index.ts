import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { UserRole } from '../types'
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

const ALL_ROLES: UserRole[] = ['admin', 'kepala_sekolah', 'waka', 'guru_mapel', 'wali_kelas', 'kepala_tu', 'staff_tu', 'guru', 'siswa', 'orang_tua']

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
    meta: { requiresAuth: true, roles: ALL_ROLES }
  },
  {
    path: '/classes',
    component: ClassesPage,
    meta: { requiresAuth: true, roles: ['admin', 'kepala_sekolah', 'waka', 'kepala_tu', 'staff_tu', 'wali_kelas', 'guru_mapel'] }
  },
  {
    path: '/students',
    component: StudentsPage,
    meta: { requiresAuth: true, roles: ['admin', 'kepala_sekolah', 'waka', 'kepala_tu', 'staff_tu', 'wali_kelas', 'guru_mapel', 'siswa', 'orang_tua'] }
  },
  {
    path: '/teachers',
    component: TeachersPage,
    meta: { requiresAuth: true, roles: ['admin', 'kepala_sekolah', 'waka', 'kepala_tu', 'staff_tu'] }
  },
  {
    path: '/schedule',
    component: SchedulePage,
    meta: { requiresAuth: true, roles: ALL_ROLES }
  },
  {
    path: '/attendance',
    component: AttendancePage,
    meta: { requiresAuth: true, roles: ALL_ROLES }
  },
  {
    path: '/grades',
    component: GradesPage,
    meta: { requiresAuth: true, roles: ALL_ROLES }
  },
  {
    path: '/communication',
    component: CommunicationPage,
    meta: { requiresAuth: true, roles: ALL_ROLES }
  },
  {
    path: '/billing',
    component: BillingPage,
    meta: { requiresAuth: true, roles: ['admin', 'kepala_sekolah', 'waka', 'kepala_tu', 'staff_tu', 'wali_kelas', 'siswa', 'orang_tua'] }
  },
  {
    path: '/announcements',
    component: AnnouncementsPage,
    meta: { requiresAuth: true, roles: ALL_ROLES }
  },
  {
    path: '/ekskul',
    component: EkskulPage,
    meta: { requiresAuth: true, roles: ALL_ROLES }
  },
  {
    path: '/prestasi',
    component: PrestasiPage,
    meta: { requiresAuth: true, roles: ALL_ROLES }
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
  } else if (to.meta.roles && !((to.meta.roles as string[]).some((r) => authStore.hasAnyRole([r as UserRole])))) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
