<template>
  <div class="space-y-6 pb-20">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-900 tracking-tight">Manajemen Guru</h1>
        <p class="text-sm text-slate-500 mt-0.5">Kelola data tenaga pendidik dan bidang studi mereka.</p>
      </div>
      <div v-if="isAdmin" class="flex gap-2">
        <Button variant="secondary" @click="openImportModal">
          <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Impor Data
        </Button>
        <Button variant="primary" @click="openAddModal">
          <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Guru
        </Button>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="clean-card p-4 sm:p-6 flex flex-col lg:flex-row lg:items-end gap-4 sm:gap-6">
      <div class="flex-1">
        <Input
          v-model="searchQuery"
          label="Cari Guru"
          placeholder="Nama, NIUP, atau Mata Pelajaran..."
        />
      </div>
      <div class="w-full lg:w-64">
        <label class="clean-label">Mata Pelajaran</label>
        <select 
          v-model="filterSubject"
          class="clean-input appearance-none cursor-pointer"
        >
          <option value="">Semua Mata Pelajaran</option>
          <option v-for="s in uniqueSubjects" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div class="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
        <button 
          @click="viewMode = 'table'"
          class="p-2 rounded-md transition-all"
          :class="viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button 
          @click="viewMode = 'grid'"
          class="p-2 rounded-md transition-all"
          :class="viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Data Display -->
    <div v-if="filteredTeachers.length === 0" class="clean-card p-8 sm:p-12 text-center">
      <p class="text-slate-500 font-medium">Tidak ada data guru yang sesuai.</p>
    </div>

    <div v-else-if="viewMode === 'table'" class="clean-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-6 py-4 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Nama Guru</th>
              <th class="px-6 py-4 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Identitas / NIUP</th>
              <th class="px-6 py-4 font-bold text-slate-700 uppercase tracking-wider text-[10px] text-center">L/P</th>
              <th class="px-6 py-4 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Spesialisasi</th>
              <th v-if="isAdmin" class="px-6 py-4 font-bold text-slate-700 uppercase tracking-wider text-[10px] text-right">Opsi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="teacher in filteredTeachers" :key="teacher.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4">
                <span class="font-semibold text-slate-900">{{ teacher.name }}</span>
              </td>
              <td class="px-6 py-4 text-slate-600 font-medium">{{ teacher.niup }}</td>
              <td class="px-6 py-4 text-center">
                <span class="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black border border-slate-200">{{ teacher.gender }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="s in teacher.subjects" :key="s" class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{{ s }}</span>
                </div>
              </td>
              <td v-if="isAdmin" class="px-6 py-4 text-right">
                <div class="flex justify-end gap-1">
                  <button @click="openEditModal(teacher)" class="p-2 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-all">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="deleteTeacher(teacher.id)" class="p-2 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-all">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

    <!-- Grid Mode -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div v-for="teacher in filteredTeachers" :key="teacher.id" class="clean-card p-4 sm:p-6 group">
        <div class="flex justify-end mb-4">
          <div v-if="isAdmin" class="flex gap-1">
            <button @click="openEditModal(teacher)" class="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
            <button @click="deleteTeacher(teacher.id)" class="p-2 text-slate-400 hover:text-rose-600 transition-colors"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
          </div>
        </div>
        <h3 class="font-bold text-slate-900 truncate">{{ teacher.name }}</h3>
        <p class="text-xs text-slate-500 mt-0.5 truncate">NIUP: {{ teacher.niup }}</p>
        <div class="flex flex-wrap gap-1.5 mt-4">
          <span v-for="s in teacher.subjects" :key="s" class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{{ s }}</span>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span class="text-[10px] font-bold text-slate-500 uppercase">Aktif</span>
          </div>
          <button class="text-[10px] font-bold text-indigo-600 uppercase hover:underline py-1.5 -my-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">Detail Profil</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Modal
      :is-open="showModal"
      :title="editingTeacher ? 'Edit Data Guru' : 'Tambah Guru Baru'"
      subtitle="Pastikan data yang dimasukkan sesuai dengan dokumen resmi."
      confirm-text="Simpan Data"
      @close="closeModal"
      @confirm="saveTeacher"
    >
      <div class="space-y-4">
        <Input v-model="formData.name" label="Nama Lengkap" placeholder="Masukkan nama dan gelar" />
        <div class="grid grid-cols-2 gap-4">
          <Input v-model="formData.niup" label="NIUP" placeholder="Nomor Induk Unit Pendidikan" />
          <div>
            <label class="clean-label">Jenis Kelamin</label>
            <select v-model="formData.gender" class="clean-input appearance-none cursor-pointer">
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
        </div>
        <Input v-model="subjectsInput" label="Mata Pelajaran" placeholder="Gunakan koma sebagai pemisah" />
        <Input v-model="classesInput" label="Daftar Kelas" placeholder="Contoh: X RPL 1, XI TKJ 2" />
      </div>
    </Modal>

    <!-- Import Modal -->
    <Modal
      :is-open="showImportModal"
      title="Impor Data Guru Masal"
      confirm-text="Proses Impor"
      @close="closeImportModal"
      @confirm="processImport"
    >
      <div class="space-y-6">
        <div class="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <p class="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-1">Petunjuk Format</p>
          <p class="text-xs text-indigo-600 leading-relaxed">
            Copy kolom dari Excel (<b>Nama, NIUP, Bidang Studi, Kelas, Email</b>) lalu paste di bawah.
            Satu baris untuk satu guru. Pemisah otomatis terdeteksi (Tab atau Koma).
          </p>
        </div>

        <div>
          <label class="block text-[11px] font-black text-surface-400 uppercase tracking-widest mb-2 px-1">Tempel Data Guru</label>
          <textarea
            v-model="importRawData"
            rows="10"
            class="w-full px-5 py-4 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-mono"
            placeholder="Contoh:&#10;Drs. Ahmad Yani	197508...	Matematika	XII RPL 1, XII RPL 2	ahmad@email.com"
          ></textarea>
        </div>

        <div v-if="importPreview.length > 0" class="space-y-3">
          <p class="text-[11px] font-black text-surface-400 uppercase tracking-widest px-1">Pratinjau ({{ importPreview.length }} Guru)</p>
          <div class="max-h-48 overflow-y-auto border border-surface-200 rounded-xl divide-y divide-surface-100">
            <div v-for="(p, i) in importPreview" :key="i" class="px-4 py-2 text-[11px] flex justify-between items-center">
              <span class="font-bold text-surface-900">{{ p.name }}</span>
              <span class="text-surface-500">{{ p.niup }} | {{ p.subjects.join(', ') }}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useTeacherStore } from '../../stores/teacher'
import type { Teacher } from '../../types'
import Button from '../../components/ui/Button.vue'
import Modal from '../../components/ui/Modal.vue'
import Input from '../../components/ui/Input.vue'

const authStore = useAuthStore()
const teacherStore = useTeacherStore()
const isAdmin = computed(() => authStore.hasAnyRole(['admin']))

onMounted(async () => {
  if (teacherStore.teachers.length === 0) {
    await teacherStore.fetchTeachers()
  }
})

const searchQuery = ref('')
const filterSubject = ref('')
const viewMode = ref<'table' | 'grid'>('table')

const uniqueSubjects = computed(() => {
  const subs = new Set<string>()
  teacherStore.teachers.forEach(t => {
    if (t.subjects && Array.isArray(t.subjects)) {
      t.subjects.forEach(s => subs.add(s))
    }
  })
  return Array.from(subs).sort()
})

const filteredTeachers = computed(() => {
  return teacherStore.teachers.filter(t => {
    const matchesSearch = !searchQuery.value || 
      t.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      t.niup.includes(searchQuery.value) ||
      (t.subjects && Array.isArray(t.subjects) && t.subjects.some(s => s.toLowerCase().includes(searchQuery.value.toLowerCase())))
    const matchesSubject = !filterSubject.value || (t.subjects && Array.isArray(t.subjects) && t.subjects.includes(filterSubject.value))
    return matchesSearch && matchesSubject
  })
})

const showModal = ref(false)
const editingTeacher = ref<Teacher | null>(null)
const classesInput = ref('')
const subjectsInput = ref('')
const formData = reactive({ name: '', niup: '', gender: 'L' as 'L' | 'P' })

// Import State
const showImportModal = ref(false)
const importRawData = ref('')
const importPreview = ref<Teacher[]>([])

watch(importRawData, (val) => {
  if (!val.trim()) {
    importPreview.value = []
    return
  }

  const lines = val.trim().split('\n')
  if (lines.length === 0) return

  // Detect headers from the first line
  const firstLine = lines[0].toLowerCase()
  let niupIdx = 0, nameIdx = 1, genderIdx = 6, subjectIdx = 16

  if (firstLine.includes('niup') || firstLine.includes('nama')) {
    const headers = lines[0].split('\t')
    if (headers.length < 2) lines[0].split(',')
    
    headers.forEach((h, i) => {
      const head = h.toLowerCase().trim()
      if (head === 'niup') niupIdx = i
      if (head === 'nama' || head === 'nama_lengkap') nameIdx = i
      if (head.includes('kelamin') || head === 'jenis_kelamin') genderIdx = i
      // Prioritize 'materi_ajar' or the last column containing 'materi'
      if (head === 'materi_ajar' || (head.includes('materi') && !head.includes('total'))) subjectIdx = i
    })
    // Remove the header line from processing
    lines.shift()
  }

  const parsed = lines.map(line => {
    let parts = line.split('\t')
    if (parts.length < 2) parts = line.split(',')
    
    if (parts.length >= 2) {
      const niup = parts[niupIdx]?.trim() || ''
      const name = parts[nameIdx]?.trim() || ''
      
      const genderRaw = parts[genderIdx]?.trim().toUpperCase() || ''
      const gender = genderRaw === 'P' || genderRaw.startsWith('PEREMPUAN') ? 'P' : 'L'
      
      const subjectRaw = parts[subjectIdx]?.trim() || ''
      // Remove quotes and split by comma, semicolon, or newline
      const subjects = subjectRaw.replace(/"/g, '').split(/[,\n;]/).map(s => s.trim()).filter(Boolean)
      
      return {
        id: `teacher-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        niup,
        gender,
        subjects,
        classes: [] as string[]
      }
    }
    return null
  }).filter((p): p is Teacher => p !== null)

  importPreview.value = parsed
})

const openAddModal = () => {
  editingTeacher.value = null
  formData.name = ''; formData.niup = ''; formData.gender = 'L';
  classesInput.value = ''; subjectsInput.value = '';
  showModal.value = true
}

const openEditModal = (teacher: Teacher) => {
  editingTeacher.value = teacher
  formData.name = teacher.name; formData.niup = teacher.niup; formData.gender = teacher.gender;
  classesInput.value = (teacher.classes || []).join(', '); 
  subjectsInput.value = (teacher.subjects || []).join(', ');
  showModal.value = true
}

const closeModal = () => { showModal.value = false }

const saveTeacher = async () => {
  const tClasses = classesInput.value.split(',').map(c => c.trim()).filter(c => c !== '')
  const tSubjects = subjectsInput.value.split(',').map(s => s.trim()).filter(s => s !== '')
  
  let success = false
  if (editingTeacher.value) {
    success = await teacherStore.updateTeacher(editingTeacher.value.id, { 
      ...formData, 
      classes: tClasses, 
      subjects: tSubjects 
    })
  } else {
    success = await teacherStore.addTeacher({ 
      ...formData, 
      classes: tClasses, 
      subjects: tSubjects 
    })
  }

  if (success) {
    closeModal()
  } else {
    alert(`Gagal menyimpan data guru: ${teacherStore.error}`)
  }
}

const deleteTeacher = async (id: string) => {
  if (confirm('Hapus data guru ini?')) {
    const success = await teacherStore.deleteTeacher(id)
    if (!success) {
      alert(`Gagal menghapus guru: ${teacherStore.error}`)
    }
  }
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

  // Not implementing bulk add for now since it's not strictly required and we don't have a bulk API yet
  // Ideally, we'd add a bulkAdd method to teacherStore and /teachers/bulk endpoint
  alert('Fitur impor dari Excel belum didukung secara penuh pada versi API saat ini.')
  closeImportModal()
}
</script>
