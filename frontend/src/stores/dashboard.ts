import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Announcement } from '../types'
import { useStudentStore } from './student'
import { useTeacherStore } from './teacher'
import { useAttendanceStore } from './attendance'
import { useAnnouncementStore } from './announcement'

export const useDashboardStore = defineStore('dashboard', () => {
  const loading = ref(false)

  // We can inject other stores to access their data
  const studentStore = useStudentStore()
  const teacherStore = useTeacherStore()
  const attendanceStore = useAttendanceStore()
  const announcementStore = useAnnouncementStore()

  const studentsCount = computed(() => studentStore.students.length)
  const teachersCount = computed(() => teacherStore.teachers.length)

  const attendanceTodayStats = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayAttendances = attendanceStore.attendances.filter(
      (a: any) => a.date === today
    )

    return {
      total: todayAttendances.length,
      present: todayAttendances.filter((a: any) => a.status === 'hadir').length,
      absent: todayAttendances.filter((a: any) => a.status === 'alfa').length,
      permission: todayAttendances.filter((a: any) => a.status === 'izin').length
    }
  })

  const latestAnnouncements = computed(() => {
    return [...announcementStore.announcements]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5) as Announcement[]
  })

  const fetchDashboardData = async () => {
    loading.value = true
    // Fetch everything we need for the dashboard in parallel
    await Promise.all([
      studentStore.fetchStudents(),
      teacherStore.fetchTeachers(),
      attendanceStore.fetchAttendances(),
      announcementStore.fetchAnnouncements()
    ])
    loading.value = false
  }

  return {
    loading,
    studentsCount,
    teachersCount,
    attendanceTodayStats,
    latestAnnouncements,
    fetchDashboardData
  }
})
