<template>
  <div class="space-y-10 pb-20">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-surface-900 tracking-tight">Manajemen Siswa</h1>
        <p class="text-surface-500 mt-1 flex items-center gap-2 font-medium">
          <span class="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
          {{ studentStore.filteredStudents.length }} Siswa terverifikasi dalam database
        </p>
      </div>
      <div v-if="canEdit" class="flex gap-3">
        <Button variant="secondary" size="lg" @click="openImportModal">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Impor Data
        </Button>
        <Button variant="primary" size="lg" @click="openAddModal">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Registrasi Siswa
        </Button>
        <Button variant="outline" size="lg" class="no-print" @click="exportStudents">Ekspor CSV</Button>
        <Button variant="ghost" size="lg" class="no-print" @click="printPage">Cetak ke PDF</Button>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 items-end premium-card p-4 sm:p-6">
      <div class="lg:col-span-5">
        <Input
          :model-value="studentStore.searchQuery"
          type="text"
          label="Pencarian Global"
          placeholder="Cari identitas, NIUP, atau nama siswa..."
          @update:model-value="(val) => studentStore.setSearch(String(val))"
        />
      </div>
      <div>
        <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">
          Tingkat Kelas
        </label>
        <select
          v-model="levelFilter"
          class="w-full px-5 py-3.5 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
        >
          <option value="">Semua Tingkat</option>
          <option v-for="l in allLevels" :key="l" :value="l">
            Kelas {{ l }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">
          Program Keahlian
        </label>
        <select
          v-model="majorFilter"
          class="w-full px-5 py-3.5 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
        >
          <option value="">Semua Jurusan</option>
          <option v-for="m in allMajors" :key="m" :value="m">
            {{ m }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">Jenis Kelamin</label>
        <select
          v-model="genderFilter"
          class="w-full px-5 py-3.5 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
        >
          <option value="">Semua Gender</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>
      <div>
        <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">Status</label>
        <select
          v-model="statusFilter"
          class="w-full px-5 py-3.5 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
        >
          <option value="">Semua Status</option>
          <option value="siswa aktif">Siswa Aktif</option>
          <option value="siswa berhenti">Siswa Berhenti</option>
          <option value="siswa lulus">Siswa Lulus</option>
        </select>
      </div>
    </div>

    <!-- Content Area -->
    <div v-if="studentStore.filteredStudents.length === 0" class="premium-card p-8 sm:p-12 text-center">
       <div class="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-surface-200">
        <svg class="w-10 h-10 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 class="text-2xl font-black text-surface-900 tracking-tight">Data Tidak Terdeteksi</h3>
      <p class="text-surface-500 mt-2 font-medium">Sesuaikan parameter pencarian atau filter klaster Anda.</p>
    </div>

    <div v-else class="premium-card overflow-hidden">
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
              <th class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em]">Profil Siswa</th>
              <th class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em]">Identitas (NIUP)</th>
              <th class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em] text-center">Jenis Kelamin</th>
              <th class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em] text-center">Klaster</th>
              <th v-if="canEdit" class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100">
            <tr
              v-for="student in filteredStudentsList"
              :key="student.id"
              class="hover:bg-surface-50/80 transition-all duration-300 group"
            >
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <div class="min-w-0">
                  <div class="font-black text-surface-900 text-base tracking-tight leading-tight max-w-xs truncate group-hover:text-brand-600 transition-colors">{{ student.name }}</div>
                  <div class="text-[10px] font-bold uppercase tracking-widest mt-1" :class="{
                    'text-emerald-500': student.status === 'siswa aktif',
                    'text-rose-500': student.status === 'siswa berhenti',
                    'text-amber-500': student.status === 'siswa lulus'
                  }">{{ student.status }}</div>
                </div>
              </td>
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <span class="px-3 py-1.5 bg-surface-100 rounded-lg text-[11px] font-bold text-surface-600 border border-surface-200/60 font-mono tabular-nums">
                  {{ student.niup }}
                </span>
              </td>
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center">
                <span class="px-3 py-1.5 bg-surface-100 rounded-lg text-[11px] font-bold text-surface-600 border border-surface-200/60 uppercase tracking-wider">
                  {{ student.gender === 'L' ? 'Laki-laki' : 'Perempuan' }}
                </span>
              </td>
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center">
                <span class="inline-flex px-4 py-1.5 bg-brand-50 text-brand-600 text-[10px] font-black rounded-xl border border-brand-100 uppercase tracking-widest">
                  {{ student.class }}
                </span>
              </td>

              <td v-if="canEdit" class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-right">
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <button
                    @click="editStudent(student)"
                    class="p-2.5 bg-surface-100 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl border border-surface-200/60 transition-all"
                    title="Edit Profil"
                    aria-label="Edit profil siswa"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteStudent(student.id)"
                    class="p-2.5 bg-surface-100 text-surface-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl border border-surface-200/60 transition-all"
                    title="Hapus Record"
                    aria-label="Hapus data siswa"
                  >
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
    </div>

    <!-- Modal Form -->
    <Modal
      :is-open="showModal"
      :title="editingStudent ? 'Ubah Informasi Siswa' : 'Registrasi Siswa Baru'"
      subtitle="Silakan lengkapi data identitas siswa untuk pendaftaran ke dalam sistem."
      confirm-text="Simpan Record"
      @close="closeModal"
      @confirm="saveStudent"
    >
      <div class="space-y-6">
        <Input
          v-model="formData.name"
          label="Nama Lengkap Siswa"
          placeholder="Masukkan identitas resmi siswa"
          :error="formErrors.name"
          required
        />

        <Input
          v-model="formData.niup"
          label="Nomor Induk Unit Pendidikan (NIUP)"
          placeholder="Masukkan NIUP siswa"
          :error="formErrors.niup"
          required
        />

        <div>
          <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">Klaster Kelas</label>
          <select
            v-model="formData.class"
            class="w-full px-5 py-3.5 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
            required
          >
            <option v-for="c in studentStore.classes" :key="c" :value="c">{{ c }}</option>
          </select>
          <p v-if="formErrors.class" class="mt-2 text-[10px] text-rose-500 font-bold uppercase tracking-widest px-1">{{ formErrors.class }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">Jenis Kelamin</label>
            <select
              v-model="formData.gender"
              class="w-full px-5 py-3.5 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
              required
            >
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">Status Keanggotaan</label>
            <select
              v-model="formData.status"
              class="w-full px-5 py-3.5 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
              required
            >
              <option value="siswa aktif">Siswa Aktif</option>
              <option value="siswa berhenti">Siswa Berhenti</option>
              <option value="siswa lulus">Siswa Lulus</option>
            </select>
          </div>
        </div>



      </div>
    </Modal>
    <!-- Bulk Import Modal -->
    <Modal
      :is-open="showImportModal"
      title="Impor Masal Data Siswa"
      subtitle="Tempel data dari Excel atau CSV. Gunakan format: Nama, NIUP, Gender (L/P), Kelas, Jurusan"
      confirm-text="Impor Sekarang"
      @close="closeImportModal"
      @confirm="processImport"
    >
      <div class="space-y-6">
        <div class="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
          <p class="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">Petunjuk Format</p>
          <p class="text-xs text-amber-600 leading-relaxed">
            Copy kolom dari Excel (<b>Nama, NIUP, L/P, Kelas, Jurusan</b>) lalu paste di bawah.
            Satu baris untuk satu siswa. Pemisah otomatis terdeteksi (Tab atau Koma).
          </p>
        </div>

        <div>
          <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">Tempel Data Di Sini</label>
          <textarea
            v-model="importRawData"
            rows="10"
            class="w-full px-5 py-4 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-mono"
            placeholder="Contoh:&#10;Ahmad Dahlan	1222071	L	X RPL&#10;Siti Aminah	1222072	P	X TKJ"
          ></textarea>
        </div>

        <div v-if="importPreview.length > 0" class="space-y-3">
          <p class="text-[11px] font-black text-surface-500 uppercase tracking-widest px-1">Pratinjau ({{ importPreview.length }} Siswa)</p>
          <div class="max-h-48 overflow-y-auto border border-surface-200 rounded-xl divide-y divide-surface-100">
            <div v-for="(p, i) in importPreview" :key="i" class="px-4 py-2 text-[11px] flex justify-between items-center">
              <span class="font-bold text-surface-900">{{ p.name }}</span>
              <span class="text-surface-500">{{ p.niup }} | {{ p.gender }} | {{ p.class }}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useStudentStore } from '../../stores/student'
import { useFormValidation } from '../../composables/useFormValidation'
import type { Student } from '../../types'
import Input from '../../components/ui/Input.vue'
import Button from '../../components/ui/Button.vue'
import Modal from '../../components/ui/Modal.vue'
import { useExport } from '../../composables/useExport'
import { useAuthStore } from '../../stores/auth'

const studentStore = useStudentStore()
const authStore = useAuthStore()
const { exportToCsv } = useExport()

const canEdit = computed(() => ['admin', 'kepala_tu', 'staff_tu'].includes(authStore.user?.role || ''))

onMounted(async () => {
  if (studentStore.students.length === 0) {
    await studentStore.fetchStudents()
  }
})

const showModal = ref(false)
const editingStudent = ref<Student | null>(null)

const showImportModal = ref(false)
const importRawData = ref('')
const importPreview = ref<any[]>([])

const genderFilter = ref('')
const statusFilter = ref('')
const levelFilter = ref('')
const majorFilter = ref('')

const allLevels = computed(() => {
  const uniqueLevels = new Set(
    studentStore.students
      .filter(s => s && s.class)
      .map(s => s.class.split(' ')[0])
  )
  return Array.from(uniqueLevels).filter(Boolean).sort()
})

const allMajors = computed(() => {
  const uniqueMajors = new Set(
    studentStore.students
      .filter(s => s && s.class)
      .map(s => s.class.split(' ').slice(1).join(' '))
  )
  return Array.from(uniqueMajors).filter(Boolean).sort()
})

const filteredStudentsList = computed(() => {
  return studentStore.filteredStudents.filter(s => {
    const matchGender = !genderFilter.value || s.gender === genderFilter.value
    const matchStatus = !statusFilter.value || s.status === statusFilter.value
    const matchLevel = !levelFilter.value || s.class.startsWith(levelFilter.value + ' ')
    const matchMajor = !majorFilter.value || s.class.includes(majorFilter.value)
    return matchGender && matchStatus && matchLevel && matchMajor
  })
})

const formData = reactive({
  name: '',
  niup: '',
  class: '',
  status: 'siswa aktif' as 'siswa aktif' | 'siswa berhenti' | 'siswa lulus',
  gender: 'L' as 'L' | 'P'
})

// Watch raw data to generate preview
watch(importRawData, (val) => {
  if (!val.trim()) {
    importPreview.value = []
    return
  }

  const lines = val.trim().split('\n')
  const parsed = lines.map(line => {
    // Try tab first (Excel paste), then comma, then semicolon
    let parts = line.split('\t')
    if (parts.length < 2) parts = line.split(',')
    if (parts.length < 2) parts = line.split(';')
    
    if (parts.length >= 4) {
      const name = parts[0]?.trim()
      const niup = parts[1]?.trim()
      const gender = parts[2]?.trim().toUpperCase().startsWith('P') ? 'P' : 'L'
      let className = parts[3]?.trim()
      
      // If there's a 5th column (Major/Jurusan), combine it
      if (parts.length >= 5 && parts[4]?.trim()) {
        className = `${className} ${parts[4].trim()}`
      }

      return {
        name,
        niup,
        gender,
        class: className,
        status: 'siswa aktif'
      }
    }
    return null
  }).filter(p => p !== null)

  importPreview.value = parsed
})

const { errors: formErrors, validateForm, clearErrors } = useFormValidation({
  name: { required: true },
  niup: { required: true },
  class: { required: true },
  status: { required: true },
  gender: { required: true }
})

const openAddModal = () => {
  editingStudent.value = null
  clearForm()
  showModal.value = true
}

const clearForm = () => {
  clearErrors()
  formData.name = ''
  formData.niup = ''
  formData.class = ''
  formData.status = 'siswa aktif'
  formData.gender = 'L'
}

const editStudent = (student: Student) => {
  editingStudent.value = student
  Object.assign(formData, student)
  showModal.value = true
}

const saveStudent = async () => {
  if (!validateForm(formData)) {
    return
  }

  let success = false
  if (editingStudent.value) {
    success = await studentStore.updateStudent(editingStudent.value.id, formData)
  } else {
    success = await studentStore.addStudent(formData as any)
  }

  if (success) {
    closeModal()
  } else {
    alert(`Gagal menyimpan data siswa: ${studentStore.error}`)
  }
}

const deleteStudent = async (id: string) => {
  if (confirm('Konfirmasi: Hapus record siswa ini secara permanen dari database?')) {
    const success = await studentStore.deleteStudent(id)
    if (!success) {
      alert(`Gagal menghapus data siswa: ${studentStore.error}`)
    }
  }
}

const closeModal = () => {
  showModal.value = false
  clearForm()
}

const printPage = () => {
  window.print()
}

const exportStudents = () => {
  const headers = ['Nama', 'NIUP', 'Kelas', 'Jenis Kelamin', 'Status']
  const rows = filteredStudentsList.value.map(s => [
    s.name,
    s.niup,
    s.class,
    s.gender === 'L' ? 'Laki-laki' : 'Perempuan',
    s.status
  ])
  exportToCsv(headers, rows, 'ekspor-siswa')
}

const openImportModal = () => {
  importRawData.value = ''
  importPreview.value = []
  showImportModal.value = true
}

const closeImportModal = () => {
  showImportModal.value = false
}

const processImport = async () => {
  if (importPreview.value.length === 0) {
    alert('Tidak ada data valid yang terdeteksi.')
    return
  }

  alert('Fitur impor dari Excel belum didukung secara penuh pada versi API saat ini.')
  closeImportModal()
}
</script>
