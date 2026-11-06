<template>
  <div class="space-y-10 pb-16">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-surface-900 tracking-tight">Manajemen Nilai</h1>
        <p class="text-surface-500 mt-1 flex items-center gap-2 font-medium">
          <span class="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
          Rekapitulasi pencapaian akademik siswa SMK
        </p>
      </div>
      <Button v-if="canEdit" variant="primary" size="lg" @click="openAddModal">
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Input Nilai
      </Button>
      <Button v-if="canEdit" variant="outline" size="lg" class="no-print" @click="exportGrades">Ekspor CSV</Button>
      <Button v-if="canEdit" variant="ghost" size="lg" class="no-print" @click="printPage">Cetak ke PDF</Button>
    </div>

    <!-- Filters Bar -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 premium-card p-4 sm:p-6">
      <div class="space-y-2">
        <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest px-1">Pilih Kelas</label>
        <div class="relative">
          <select
            v-model="selectedClass"
            @change="filterGrades"
            class="w-full pl-12 pr-5 py-3.5 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">Semua Kelas</option>
            <option v-for="c in classesList" :key="c.id" :value="c.name">
              Kelas {{ c.name }}
            </option>
          </select>
          <svg class="w-5 h-5 text-surface-400 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>
      <div class="space-y-2">
        <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest px-1">Mata Pelajaran</label>
        <div class="relative">
          <select
            v-model="selectedSubject"
            @change="filterGrades"
            class="w-full pl-12 pr-5 py-3.5 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">Semua Mata Pelajaran</option>
            <option value="Matematika">Matematika</option>
            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
            <option value="Teknologi Informasi">Teknologi Informasi</option>
            <option value="Fisika">Fisika</option>
            <option value="Kimia">Kimia</option>
            <option value="Bahasa Inggris">Bahasa Inggris</option>
          </select>
          <svg class="w-5 h-5 text-surface-400 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Grades Table -->
    <div class="premium-card overflow-hidden">
      <div class="flex items-center justify-between border-b border-surface-100 px-4 py-2 lg:hidden">
        <span class="text-[11px] font-bold uppercase tracking-widest text-surface-500">Geser tabel untuk kolom lain</span>
        <svg class="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-surface-50 border-b border-surface-200/60">
              <th class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em]">Informasi Siswa</th>
              <th class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em]">Mata Pelajaran</th>
              <th class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em] text-center">Skor</th>
              <th class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em] text-center">Predikat</th>
              <th class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em] text-center">Tanggal Input</th>
              <th v-if="canEdit" class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100">
            <tr v-for="grade in filteredGrades" :key="grade.id" class="hover:bg-surface-50/80 transition-all duration-300 group">
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <div class="min-w-0">
                  <div class="font-black text-surface-900 text-[15px] tracking-tight leading-tight max-w-xs truncate">{{ grade.studentName }}</div>
                  <div class="text-[10px] text-brand-600 font-bold uppercase tracking-widest mt-1">{{ getStudentClass(grade.studentId) }}</div>
                </div>
              </td>
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <span class="block max-w-xs truncate text-[13px] text-surface-600 font-bold">{{ grade.subject }}</span>
              </td>
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-sm border shadow-sm tabular-nums" :class="getScoreClass(grade.score)">
                  {{ grade.score }}
                </div>
              </td>
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center">
                 <span class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border"
                  :class="{
                    'bg-emerald-50 text-emerald-600 border-emerald-100': grade.score >= 90,
                    'bg-sky-50 text-sky-600 border-sky-100': grade.score >= 80 && grade.score < 90,
                    'bg-amber-50 text-amber-600 border-amber-100': grade.score >= 70 && grade.score < 80,
                    'bg-orange-50 text-orange-600 border-orange-100': grade.score >= 60 && grade.score < 70,
                    'bg-rose-50 text-rose-600 border-rose-100': grade.score < 60,
                  }"
                 >
                  Grade {{ getGrade(grade.score) }}
                 </span>
              </td>
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center text-surface-500 text-[12px] font-medium tabular-nums">
                {{ new Date(grade.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}
              </td>
              <td v-if="canEdit" class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-right">
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <button @click="openEditModal(grade)" aria-label="Ubah data nilai" class="p-2.5 bg-surface-100 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl border border-surface-200/60 transition-all">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="deleteGrade(grade.id)" aria-label="Hapus data nilai" class="p-2.5 bg-surface-100 text-surface-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl border border-surface-200/60 transition-all">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredGrades.length === 0" class="p-8 sm:p-12 text-center">
        <div class="bg-surface-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-surface-200">
          <svg class="w-10 h-10 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 class="text-xl font-black text-surface-900 tracking-tight">Data nilai tidak ditemukan</h3>
        <p class="text-surface-500 mt-1 font-medium">Belum ada nilai yang diinput untuk kriteria ini</p>
      </div>
    </div>

    <!-- Grade Distribution -->
    <div class="space-y-6">
      <h2 class="text-xl font-black text-surface-900 tracking-tight px-2">Distribusi Capaian Akademik</h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
        <div class="group premium-card p-4 sm:p-6 hover:border-emerald-300 text-center">
          <p class="text-3xl font-black text-emerald-600 group-hover:scale-110 transition-transform tabular-nums">{{ gradeDistribution.A }}</p>
          <div class="mt-4 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest inline-block">Grade A</div>
          <p class="text-[9px] font-bold text-surface-500 mt-2 uppercase tracking-tighter">Sangat Memuaskan</p>
        </div>
        <div class="group premium-card p-4 sm:p-6 hover:border-sky-300 text-center">
          <p class="text-3xl font-black text-sky-600 group-hover:scale-110 transition-transform tabular-nums">{{ gradeDistribution.B }}</p>
          <div class="mt-4 px-3 py-1 bg-sky-50 text-sky-600 text-[10px] font-black rounded-lg border border-sky-100 uppercase tracking-widest inline-block">Grade B</div>
          <p class="text-[9px] font-bold text-surface-500 mt-2 uppercase tracking-tighter">Memuaskan</p>
        </div>
        <div class="group premium-card p-4 sm:p-6 hover:border-amber-300 text-center">
          <p class="text-3xl font-black text-amber-600 group-hover:scale-110 transition-transform tabular-nums">{{ gradeDistribution.C }}</p>
          <div class="mt-4 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-lg border border-amber-100 uppercase tracking-widest inline-block">Grade C</div>
          <p class="text-[9px] font-bold text-surface-500 mt-2 uppercase tracking-tighter">Cukup</p>
        </div>
        <div class="group premium-card p-4 sm:p-6 hover:border-orange-300 text-center">
          <p class="text-3xl font-black text-orange-600 group-hover:scale-110 transition-transform tabular-nums">{{ gradeDistribution.D }}</p>
          <div class="mt-4 px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black rounded-lg border border-orange-100 uppercase tracking-widest inline-block">Grade D</div>
          <p class="text-[9px] font-bold text-surface-500 mt-2 uppercase tracking-tighter">Kurang</p>
        </div>
        <div class="group premium-card p-4 sm:p-6 hover:border-rose-300 text-center">
          <p class="text-3xl font-black text-rose-600 group-hover:scale-110 transition-transform tabular-nums">{{ gradeDistribution.E }}</p>
          <div class="mt-4 px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black rounded-lg border border-rose-100 uppercase tracking-widest inline-block">Grade E</div>
          <p class="text-[9px] font-bold text-surface-500 mt-2 uppercase tracking-tighter">Sangat Kurang</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Modal
      :is-open="showModal"
      :title="editingGrade ? 'Ubah Data Nilai Siswa' : 'Input Nilai Akademik Baru'"
      subtitle="Silakan masukkan rincian nilai untuk siswa yang dipilih."
      confirm-text="Simpan Nilai"
      @close="closeModal"
      @confirm="saveGrade"
    >
      <div class="space-y-6">
        <div>
          <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">Pilih Siswa</label>
          <select
            v-model="formData.studentId"
            @change="onStudentChange"
            class="w-full px-5 py-3.5 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">Cari Nama Siswa...</option>
            <option v-for="student in students" :key="student.id" :value="student.id">
              {{ student.name }} ({{ student.class }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">Mata Pelajaran</label>
          <select
            v-model="formData.subject"
            class="w-full px-5 py-3.5 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
          >
            <option value="Matematika">Matematika</option>
            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
            <option value="Teknologi Informasi">Teknologi Informasi</option>
            <option value="Fisika">Fisika</option>
            <option value="Kimia">Kimia</option>
            <option value="Bahasa Inggris">Bahasa Inggris</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            v-model.number="formData.score"
            type="number"
            label="Skor Nilai (0-100)"
            placeholder="0-100"
            required
          />

          <Input
            v-model="formData.date"
            type="date"
            label="Tanggal Penilaian"
            required
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useGradeStore } from '../../stores/grade'
import { useStudentStore } from '../../stores/student'
import type { Grade } from '../../types'
import Button from '../../components/ui/Button.vue'
import Modal from '../../components/ui/Modal.vue'
import Input from '../../components/ui/Input.vue'
import { useExport } from '../../composables/useExport'

const authStore = useAuthStore()
const gradeStore = useGradeStore()
const studentStore = useStudentStore()

const canEdit = computed(() => ['admin', 'kepala_sekolah', 'waka', 'guru_mapel', 'wali_kelas', 'guru'].includes(authStore.user?.role || ''))
const { exportToCsv } = useExport()

const selectedClass = ref('')
const selectedSubject = ref('')

onMounted(async () => {
  if (studentStore.students.length === 0) {
    await studentStore.fetchStudents()
  }
  if (gradeStore.grades.length === 0) {
    await gradeStore.fetchGrades()
  }
})

const classesList = computed(() => {
  return studentStore.classes.map(name => ({ id: name, name }))
})

const students = computed(() => studentStore.students)

const filteredGrades = computed(() => {
  return gradeStore.grades.filter(grade => {
    const studentClass = getStudentClass(grade.studentId)
    const matchClass = !selectedClass.value || studentClass === selectedClass.value
    const matchSubject = !selectedSubject.value || grade.subject === selectedSubject.value
    return matchClass && matchSubject
  })
})

const showModal = ref(false)
const editingGrade = ref<Grade | null>(null)
const formData = reactive({
  studentId: '',
  studentName: '',
  subject: 'Matematika',
  score: 0,
  date: new Date().toISOString().split('T')[0]
})

const getStudentClass = (studentId: string) => {
  const student = studentStore.getStudentById(studentId)
  return student?.class || '-'
}

const getGrade = (score: number): string => {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'E'
}

const getScoreClass = (score: number) => {
  if (score >= 90) return 'bg-emerald-50 text-emerald-600 border-emerald-100'
  if (score >= 80) return 'bg-sky-50 text-sky-600 border-sky-100'
  if (score >= 70) return 'bg-amber-50 text-amber-600 border-amber-100'
  if (score >= 60) return 'bg-orange-50 text-orange-600 border-orange-100'
  return 'bg-rose-50 text-rose-600 border-rose-100'
}

const gradeDistribution = computed(() => {
  const allGrades = filteredGrades.value
  return {
    A: allGrades.filter(g => g.score >= 90).length,
    B: allGrades.filter(g => g.score >= 80 && g.score < 90).length,
    C: allGrades.filter(g => g.score >= 70 && g.score < 80).length,
    D: allGrades.filter(g => g.score >= 60 && g.score < 70).length,
    E: allGrades.filter(g => g.score < 60).length
  }
})

const filterGrades = () => {
  // Now handled by computed property
}

const openAddModal = () => {
  editingGrade.value = null
  formData.studentId = ''
  formData.studentName = ''
  formData.subject = 'Matematika'
  formData.score = 0
  formData.date = new Date().toISOString().split('T')[0]
  showModal.value = true
}

const openEditModal = (grade: Grade) => {
  editingGrade.value = grade
  formData.studentId = grade.studentId
  formData.studentName = grade.studentName
  formData.subject = grade.subject
  formData.score = grade.score
  formData.date = grade.date
  showModal.value = true
}

const onStudentChange = () => {
  const student = studentStore.getStudentById(formData.studentId)
  if (student) {
    formData.studentName = student.name
  }
}

const closeModal = () => {
  showModal.value = false
}

const saveGrade = async () => {
  if (!formData.studentId) {
    alert('Pilih siswa terlebih dahulu')
    return
  }

  let success = false
  if (editingGrade.value) {
    success = await gradeStore.updateGrade(editingGrade.value.id, formData)
  } else {
    success = await gradeStore.addGrade(formData)
  }
  
  if (success) {
    closeModal()
  } else {
    alert(`Gagal menyimpan nilai: ${gradeStore.error}`)
  }
}

const printPage = () => {
  window.print()
}

const deleteGrade = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus data nilai ini?')) {
    const success = await gradeStore.deleteGrade(id)
    if (!success) {
      alert(`Gagal menghapus nilai: ${gradeStore.error}`)
    }
  }
}

const exportGrades = () => {
  const headers = ['Siswa', 'Kelas', 'Mata Pelajaran', 'Skor', 'Predikat', 'Tanggal Input']
  const rows = filteredGrades.value.map(g => [
    g.studentName,
    getStudentClass(g.studentId),
    g.subject,
    g.score,
    `Grade ${getGrade(g.score)}`,
    new Date(g.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  ])
  exportToCsv(headers, rows, 'ekspor-nilai')
}
</script>
