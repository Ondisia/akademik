<template>
  <div class="space-y-10 pb-16">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Presensi Kehadiran</h1>
        <p class="text-slate-500 mt-1 flex items-center gap-2">
          <span class="flex h-2 w-2 rounded-full bg-indigo-500"></span>
          Pemantauan kehadiran siswa harian
        </p>
      </div>
      <Button v-if="canEdit" variant="primary" @click="saveAttendance" class="shadow-lg shadow-indigo-100 min-w-[140px]">
        <span class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-1.5-1.5M12 14l3-3m-3 4v-7" />
          </svg>
          Simpan Rekap
        </span>
      </Button>
      <Button v-if="canEdit" variant="outline" class="no-print" @click="exportAttendance">Ekspor CSV</Button>
    </div>

    <!-- Controls Bar -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-end bg-white p-4 sm:p-6 rounded-card border border-slate-200/60 shadow-sm">
      <div class="space-y-2">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Pilih Tanggal</label>
        <div class="relative">
          <input
            v-model="selectedDate"
            type="date"
            class="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
          />
          <svg class="w-5 h-5 text-slate-400 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      <div class="space-y-2">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Pilih Kelas</label>
        <div class="relative">
          <select
            v-model="selectedClass"
            class="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none"
          >
            <option value="">Semua Kelas</option>
            <option v-for="c in classesList" :key="c.id" :value="c.name">
              Kelas {{ c.name }}
            </option>
          </select>
          <svg class="w-5 h-5 text-slate-400 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>
      <div class="space-y-2">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Status Kehadiran</label>
        <select
          v-model="statusFilter"
          class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
        >
          <option value="">Semua Status</option>
          <option value="hadir">Hadir</option>
          <option value="izin">Izin</option>
          <option value="alfa">Alfa</option>
        </select>
      </div>
      
      <!-- Stats Quick View -->
      <div class="flex items-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
         <div class="flex-1 text-center py-2 px-1 bg-white rounded-xl shadow-sm border border-slate-200/50">
            <p class="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Hadir</p>
            <p class="text-sm font-extrabold text-slate-900 tabular-nums">{{ stats.present }}</p>
         </div>
         <div class="flex-1 text-center py-2 px-1 bg-white rounded-xl shadow-sm border border-slate-200/50">
            <p class="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Izin</p>
            <p class="text-sm font-extrabold text-slate-900 tabular-nums">{{ stats.permission }}</p>
         </div>
         <div class="flex-1 text-center py-2 px-1 bg-white rounded-xl shadow-sm border border-slate-200/50">
            <p class="text-[9px] font-bold text-rose-500 uppercase tracking-widest">Alfa</p>
            <p class="text-sm font-extrabold text-slate-900 tabular-nums">{{ stats.absent }}</p>
         </div>
      </div>
    </div>

    <!-- Attendance Table -->
    <div class="bg-white border border-slate-200/60 rounded-card shadow-sm overflow-hidden">
      <div class="flex items-center justify-between border-b border-slate-100 px-4 py-2 lg:hidden">
        <span class="text-[11px] font-bold uppercase tracking-widest text-slate-500">Geser tabel untuk kolom lain</span>
        <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100">
              <th class="px-4 sm:px-6 lg:px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-20">No</th>
              <th class="px-4 sm:px-6 lg:px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Nama Siswa</th>
              <th class="px-4 sm:px-6 lg:px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th class="px-4 sm:px-6 lg:px-8 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Keterangan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="(student, idx) in filteredStudents" :key="student.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-slate-500 font-mono text-sm tabular-nums">{{ String(idx + 1).padStart(2, '0') }}</td>
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <div class="flex items-center gap-4 min-w-0">
                  <div class="w-8 h-8 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[10px]">
                    {{ student.name.charAt(0) }}
                  </div>
                  <div class="min-w-0">
                    <div class="font-bold text-slate-900 text-sm max-w-xs truncate">{{ student.name }}</div>
                    <div class="text-[11px] text-indigo-500 font-bold uppercase tracking-wider mt-0.5">{{ student.class }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <select
                  :value="getAttendanceStatus(student.id)"
                  @change="setAttendanceStatus(student.id, ($event.target as HTMLSelectElement).value as any)"
                  :disabled="!canEdit"
                  class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all disabled:opacity-50 appearance-none min-w-[100px] cursor-pointer"
                  :class="{
                    'text-emerald-600 !bg-emerald-50 !border-emerald-100': getAttendanceStatus(student.id) === 'hadir',
                    'text-amber-600 !bg-amber-50 !border-amber-100': getAttendanceStatus(student.id) === 'izin',
                    'text-rose-600 !bg-rose-50 !border-rose-100': getAttendanceStatus(student.id) === 'alfa',
                  }"
                >
                  <option value="hadir">Hadir</option>
                  <option value="izin">Izin</option>
                  <option value="alfa">Alfa</option>
                </select>
              </td>
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <input
                  :value="getAttendanceNote(student.id)"
                  @input="setAttendanceNote(student.id, ($event.target as HTMLInputElement).value)"
                  type="text"
                  placeholder="Catatan..."
                  :disabled="!canEdit"
                  class="w-full max-w-[200px] px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all disabled:opacity-50"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <div class="group bg-white p-4 sm:p-6 rounded-card border border-slate-200/60 shadow-sm hover:border-emerald-300 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tingkat Kehadiran</span>
        </div>
        <p class="text-3xl font-extrabold text-slate-900 tabular-nums">{{ stats.present }}</p>
        <p class="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-2">Siswa Hadir</p>
      </div>

      <div class="group bg-white p-4 sm:p-6 rounded-card border border-slate-200/60 shadow-sm hover:border-amber-300 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Izin / Sakit</span>
        </div>
        <p class="text-3xl font-extrabold text-slate-900 tabular-nums">{{ stats.permission }}</p>
        <p class="text-xs font-bold text-amber-500 uppercase tracking-widest mt-2">Siswa Berhalangan</p>
      </div>

      <div class="group bg-white p-4 sm:p-6 rounded-card border border-slate-200/60 shadow-sm hover:border-rose-300 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tanpa Keterangan</span>
        </div>
        <p class="text-3xl font-extrabold text-slate-900 tabular-nums">{{ stats.absent }}</p>
        <p class="text-xs font-bold text-rose-500 uppercase tracking-widest mt-2">Siswa Absen</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useStudentStore } from '../../stores/student'
import { useAttendanceStore } from '../../stores/attendance'
import Button from '../../components/ui/Button.vue'
import { useExport } from '../../composables/useExport'

const authStore = useAuthStore()
const studentStore = useStudentStore()
const attendanceStore = useAttendanceStore()
const { exportToCsv } = useExport()
const canEdit = computed(() => ['admin', 'guru'].includes(authStore.user?.role || ''))

const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedClass = ref('')
const statusFilter = ref('')

// Temporary state for the UI before saving
const attendanceStatusMap = ref<Map<string, 'hadir' | 'izin' | 'alfa'>>(new Map())
const attendanceNotesMap = ref<Map<string, string>>(new Map())

const filteredStudents = computed(() => {
  let list = studentStore.students
  if (selectedClass.value) {
    list = list.filter(s => s.class === selectedClass.value)
  }
  if (statusFilter.value) {
    list = list.filter(s => getAttendanceStatus(s.id) === statusFilter.value)
  }
  return list
})

const classesList = computed(() => {
  return studentStore.classes.map(name => ({ id: name, name }))
})

const stats = computed(() => {
  let present = 0, permission = 0, absent = 0
  
  filteredStudents.value.forEach(s => {
    const status = getAttendanceStatus(s.id)
    if (status === 'hadir') present++
    else if (status === 'izin') permission++
    else if (status === 'alfa') absent++
  })

  return { present, permission, absent }
})

// Sync local map with store data when date changes
const syncWithStore = () => {
  attendanceStatusMap.value.clear()
  attendanceNotesMap.value.clear()
  
  const recordsForDate = attendanceStore.attendances.filter(a => a.date === selectedDate.value)
  
  recordsForDate.forEach(record => {
    attendanceStatusMap.value.set(record.studentId, record.status)
    if (record.note) attendanceNotesMap.value.set(record.studentId, record.note)
  })
}

watch(selectedDate, syncWithStore)

onMounted(async () => {
  if (studentStore.students.length === 0) {
    await studentStore.fetchStudents()
  }
  if (attendanceStore.attendances.length === 0) {
    await attendanceStore.fetchAttendances()
  }
  syncWithStore()
})

const getAttendanceStatus = (studentId: string) => {
  return attendanceStatusMap.value.get(studentId) || 'hadir'
}

const setAttendanceStatus = (studentId: string, status: 'hadir' | 'izin' | 'alfa') => {
  attendanceStatusMap.value.set(studentId, status)
}

const getAttendanceNote = (studentId: string) => {
  return attendanceNotesMap.value.get(studentId) || ''
}

const setAttendanceNote = (studentId: string, note: string) => {
  attendanceNotesMap.value.set(studentId, note)
}

const exportAttendance = () => {
  const headers = ['Tanggal', 'Nama Siswa', 'Kelas', 'Status Kehadiran']
  const rows = filteredStudents.value.map(s => [
    selectedDate.value,
    s.name,
    s.class,
    getAttendanceStatus(s.id)
  ])
  exportToCsv(headers, rows, 'ekspor-absensi')
}

const saveAttendance = async () => {
  const recordsToSave = filteredStudents.value.map(student => {
    const existingRecord = attendanceStore.attendances.find(
      a => a.studentId === student.id && a.date === selectedDate.value
    )
    
    return {
      ...(existingRecord ? { id: existingRecord.id } : {}),
      studentId: student.id,
      studentName: student.name,
      date: selectedDate.value,
      status: getAttendanceStatus(student.id),
      note: getAttendanceNote(student.id)
    }
  })

  const success = await attendanceStore.saveBulkAttendance(recordsToSave)
  
  if (success) {
    alert(`Absensi untuk tanggal ${selectedDate.value} berhasil disimpan!`)
  } else {
    alert(`Gagal menyimpan absensi: ${attendanceStore.error}`)
  }
}
</script>

