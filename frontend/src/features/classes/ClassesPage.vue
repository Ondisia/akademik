<template>
  <div class="space-y-6 pb-20">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-900 tracking-tight">Manajemen Kelas</h1>
        <p class="text-sm text-slate-500 mt-0.5">Kelola klaster kelas dan program keahlian siswa.</p>
      </div>
      <Button v-if="canEdit" variant="primary" @click="openAddModal">
        <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Kelas
      </Button>
    </div>

    <!-- Filters Bar -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 items-end bg-white p-4 sm:p-6 rounded-card border border-slate-200/60 shadow-sm">
      <div class="md:col-span-3">
        <Input
          v-model="searchQuery"
          label="Cari Kelas"
          placeholder="Cari nama kelas atau wali kelas..."
        />
      </div>
      <div>
        <label class="clean-label">Program Keahlian</label>
        <select v-model="filterMajor" class="clean-input appearance-none cursor-pointer">
          <option value="">Semua Program</option>
          <option value="Multimedia (MM)">Multimedia (MM)</option>
          <option value="Rekayasa Perangkat Lunak (RPL)">Rekayasa Perangkat Lunak (RPL)</option>
          <option value="Teknik Komputer &amp; Jaringan (TKJ)">Teknik Komputer &amp; Jaringan (TKJ)</option>
          <option value="Tata Busana (TB)">Tata Busana (TB)</option>
          <option value="Teknik Pembangkit Tenaga Listrik (PJB CLASS)">Teknik Pembangkit Tenaga Listrik (PJB CLASS)</option>
          <option value="Desain Komunikasi Visual (DKV)">Desain Komunikasi Visual (DKV)</option>
          <option value="Desain &amp; Produksi Busana (DPB)">Desain &amp; Produksi Busana (DPB)</option>
          <option value="Agrobisnis Pengolahan Hasil Perikanan (APHPi)">Agrobisnis Pengolahan Hasil Perikanan (APHPi)</option>
          <option value="Perikanan">Perikanan</option>
        </select>
      </div>
    </div>

    <!-- Classes Grid -->
    <div v-if="filteredClasses.length === 0" class="clean-card p-8 sm:p-12 text-center">
      <p class="text-slate-500 font-medium">Data kelas tidak ditemukan.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <div
        v-for="cls in filteredClasses"
        :key="cls.id"
        class="clean-card group flex flex-col h-full"
      >
        <div class="p-4 sm:p-6 flex-1 flex flex-col">
          <div class="mb-4">
            <h3 class="text-xl font-bold text-slate-900 tracking-tight truncate group-hover:text-indigo-600 transition-colors">{{ cls.name }}</h3>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 truncate">{{ cls.major }}</p>
          </div>

          <div class="grid grid-cols-1 gap-3 mt-auto">
            <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Wali Kelas</p>
              <p class="text-xs font-semibold text-slate-700 mt-2 truncate">{{ cls.teacher }}</p>
            </div>
            <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Kapasitas</p>
              <p class="text-xs font-semibold text-slate-700 mt-2 tabular-nums">{{ cls.capacity }} Siswa Terdaftar</p>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="px-4 sm:px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-2">
          <RouterLink to="/schedule" class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1.5 py-1.5 -my-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
            Jadwal
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4 4H3" />
            </svg>
          </RouterLink>
          <div v-if="canEdit" class="flex gap-1">
            <button @click="openEditModal(cls)" class="p-2 text-slate-400 hover:text-indigo-600 rounded hover:bg-white transition-all">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button @click="deleteClass(cls.id)" class="p-2 text-slate-400 hover:text-rose-500 rounded hover:bg-white transition-all">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <Modal
      :is-open="showModal"
      :title="editingClass ? 'Edit Konfigurasi Kelas' : 'Tambah Kelas Baru'"
      subtitle="Silakan masukkan rincian klaster kelas untuk database akademik."
      confirm-text="Simpan Perubahan"
      @close="closeModal"
      @confirm="saveClass"
    >
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="clean-label">Tingkat Kelas</label>
            <select v-model="formData.level" class="clean-input appearance-none cursor-pointer">
              <option value="X">Kelas X</option>
              <option value="XI">Kelas XI</option>
              <option value="XII">Kelas XII</option>
            </select>
          </div>
          <div>
            <label class="clean-label">Suffix / Nomor (Opsional)</label>
            <Input v-model="formData.suffix" placeholder="Contoh: 1 atau A" />
          </div>
        </div>

        <div>
          <label class="clean-label">Program Keahlian (Jurusan)</label>
          <select v-model="formData.major" class="clean-input appearance-none cursor-pointer">
            <option v-for="m in majors" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="clean-label">Wali Kelas</label>
            <select v-model="formData.teacher" class="clean-input appearance-none cursor-pointer">
              <option value="">Pilih Wali Kelas...</option>
              <option v-for="t in teachers" :key="t.id" :value="t.name">
                {{ t.name }}
              </option>
            </select>
          </div>
          <Input
            v-model.number="formData.capacity"
            type="number"
            label="Kapasitas Siswa"
            placeholder="36"
            required
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { Class } from '../../types'
import { useStudentStore } from '../../stores/student'
import { useTeacherStore } from '../../stores/teacher'
import Button from '../../components/ui/Button.vue'
import Modal from '../../components/ui/Modal.vue'
import Input from '../../components/ui/Input.vue'
import { useAuthStore } from '../../stores/auth'

const studentStore = useStudentStore()
const teacherStore = useTeacherStore()
const authStore = useAuthStore()

const canEdit = computed(() => authStore.hasAnyRole(['admin', 'kepala_tu', 'staff_tu']))
const classes = ref<Class[]>([])
const searchQuery = ref('')
const filterMajor = ref('')
const showModal = ref(false)
const editingClass = ref<Class | null>(null)

const filteredClasses = computed(() => {
  return classes.value.filter(cls => {
    const matchesSearch = !searchQuery.value || 
      cls.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesMajor = !filterMajor.value || cls.major === filterMajor.value
    return matchesSearch && matchesMajor
  })
})

const formData = reactive({
  level: 'X',
  major: 'Rekayasa Perangkat Lunak (RPL)',
  suffix: '1',
  teacher: '',
  capacity: 36
})

const majors = [
  "Multimedia (MM)",
  "Rekayasa Perangkat Lunak (RPL)",
  "Teknik Komputer & Jaringan (TKJ)",
  "Tata Busana (TB)",
  "Teknik Pembangkit Tenaga Listrik (PJB CLASS)",
  "Desain Komunikasi Visual (DKV)",
  "Desain & Produksi Busana (DPB)",
  "Agrobisnis Pengolahan Hasil Perikanan (APHPi)",
  "Perikanan"
]

const teachers = computed(() => teacherStore.teachers)

onMounted(async () => {
  if (studentStore.students.length === 0) {
    await studentStore.fetchStudents()
  }
  if (teacherStore.teachers.length === 0) {
    await teacherStore.fetchTeachers()
  }

  if (classes.value.length === 0) {
    classes.value = studentStore.classes.map(name => ({
      id: `class-${name.replace(/\s+/g, '-')}`,
      name,
      major: name.split(' ').slice(1).join(' '),
      teacher: teacherStore.teachers.find(t => t.classes.includes(name))?.name || '',
      capacity: studentStore.students.filter(s => s.class === name).length
    }))
  }
})

const openAddModal = () => {
  editingClass.value = null
  formData.level = 'X'
  formData.major = 'Rekayasa Perangkat Lunak (RPL)'
  formData.suffix = '1'
  formData.teacher = ''
  formData.capacity = 36
  showModal.value = true
}

const openEditModal = (cls: Class) => {
  editingClass.value = cls
  Object.assign(formData, cls)
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveClass = () => {
  const generatedName = `${formData.level} ${formData.major} ${formData.suffix}`.trim().replace(/\s+/g, ' ')
  const finalData = {
    name: generatedName,
    major: formData.major,
    teacher: formData.teacher,
    capacity: formData.capacity
  }

  if (editingClass.value) {
    const index = classes.value.findIndex(c => c.id === editingClass.value?.id)
    if (index !== -1) {
      classes.value[index] = { ...editingClass.value, ...finalData }
    }
  } else {
    classes.value.push({
      id: `class-${Date.now()}`,
      ...finalData
    })
  }
  closeModal()
}

const deleteClass = (id: string) => {
  if (confirm('Hapus data kelas ini?')) {
    classes.value = classes.value.filter(c => c.id !== id)
  }
}
</script>
