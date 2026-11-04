<template>
  <div class="space-y-10 pb-16">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-surface-900 tracking-tight">Manajemen Prestasi</h1>
        <p class="text-surface-500 mt-1 flex items-center gap-2 font-medium">
          <span class="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
          Rekap prestasi siswa di bidang non-akademik
        </p>
      </div>
      <div v-if="canEdit" class="flex gap-3">
        <Button variant="primary" size="lg" class="no-print" @click="openAddModal">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Prestasi
        </Button>
        <Button variant="outline" size="lg" class="no-print" @click="exportPrestasi">Ekspor CSV</Button>
        <Button variant="ghost" size="lg" class="no-print" @click="printPage">Cetak ke PDF</Button>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-end premium-card p-4 sm:p-6">
      <div>
        <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">
          Kelas
        </label>
        <select
          v-model="kelasFilter"
          class="w-full px-5 py-3.5 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
        >
          <option value="">Semua Kelas</option>
          <option v-for="k in kelasOptions" :key="k" :value="k">{{ k }}</option>
        </select>
      </div>
      <div>
        <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">
          Juara
        </label>
        <select
          v-model="juaraFilter"
          class="w-full px-5 py-3.5 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
        >
          <option value="">Semua Juara</option>
          <option v-for="j in juaraOptions" :key="j" :value="j">{{ j }}</option>
        </select>
      </div>
      <div>
        <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">
          Tahun
        </label>
        <select
          v-model="tahunFilter"
          class="w-full px-5 py-3.5 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
        >
          <option value="">Semua Tahun</option>
          <option v-for="t in tahunOptions" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredPrestasis.length === 0" class="premium-card p-8 sm:p-12 text-center">
      <div class="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-surface-200">
        <svg class="w-10 h-10 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5v10a2 2 0 002 2h10a2 2 0 002-2V5m-2 0l3-3m-3 3l3 3" />
        </svg>
      </div>
      <h3 class="text-2xl font-black text-surface-900 tracking-tight">Data Tidak Ditemukan</h3>
      <p class="text-surface-500 mt-2 font-medium">Sesuaikan filter kelas, juara, atau tahun.</p>
    </div>

    <!-- Prestasi Table -->
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
              <th class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em]">Siswa</th>
              <th class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em] text-center tabular-nums">Kelas</th>
              <th class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em]">Kategori</th>
              <th class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em] text-center">Juara</th>
              <th class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em]">Event</th>
              <th class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em] text-center tabular-nums">Tahun</th>
              <th v-if="canEdit" class="px-4 sm:px-6 lg:px-8 py-5 text-[11px] font-black text-surface-500 uppercase tracking-[0.2em] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100">
            <tr
              v-for="prestasi in filteredPrestasis"
              :key="prestasi.id"
              class="hover:bg-surface-50/80 transition-all duration-300 group"
            >
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <div class="min-w-0">
                  <div class="font-black text-surface-900 text-base tracking-tight leading-tight max-w-xs truncate">
                    {{ prestasi.siswa }}
                  </div>
                </div>
              </td>
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center tabular-nums">
                {{ prestasi.kelas }}
              </td>
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <span class="text-surface-600 font-medium">{{ prestasi.kategori }}</span>
              </td>
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center">
                <span class="px-3 py-1.5 bg-brand-50 text-brand-600 text-[10px] font-bold rounded-xl border border-brand-100 uppercase tracking-wider">
                  {{ prestasi.juara }}
                </span>
              </td>
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                <span class="block max-w-xs truncate text-surface-600 font-medium">{{ prestasi.event }}</span>
              </td>
              <td class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-center tabular-nums">
                {{ prestasi.tahun }}
              </td>
              <td v-if="canEdit" class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-right">
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <button
                    @click="openEditModal(prestasi)"
                    class="p-2.5 bg-surface-100 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl border border-surface-200/60 transition-all"
                    title="Ubah Prestasi"
                    aria-label="Ubah data prestasi"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deletePrestasi(prestasi.id)"
                    class="p-2.5 bg-surface-100 text-surface-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl border border-surface-200/60 transition-all"
                    title="Hapus Prestasi"
                    aria-label="Hapus data prestasi"
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
      :title="editingPrestasi ? 'Ubah Data Prestasi' : 'Tambah Prestasi Baru'"
      subtitle="Lengkapi data prestasi siswa untuk rekap pencapaian non-akademik."
      confirm-text="Simpan Prestasi"
      @close="closeModal"
      @confirm="savePrestasi"
    >
      <div class="space-y-6">
        <Input
          v-model="formData.studentId"
          label="ID Siswa (NIUP)"
          placeholder="Masukkan ID siswa"
          required
          :error="formErrors.studentId"
        />

        <Input
          v-model="formData.siswa"
          label="Nama Siswa"
          placeholder="Nama lengkap siswa"
          required
          :error="formErrors.siswa"
        />

        <div class="grid grid-cols-2 gap-4">
          <div>
            <Input
              v-model="formData.kelas"
              label="Kelas"
              placeholder="Contoh: X RPL 1"
              required
              :error="formErrors.kelas"
            />
          </div>
          <div>
            <Input
              v-model="formData.kategori"
              label="Kategori"
              placeholder="Contoh: Olimpiade Sains"
              required
              :error="formErrors.kategori"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">
              Juara
            </label>
            <select
              v-model="formData.juara"
              class="w-full px-5 py-3.5 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
              required
            >
              <option value="Juara 1">Juara 1</option>
              <option value="Juara 2">Juara 2</option>
              <option value="Juara 3">Juara 3</option>
            </select>
          </div>
          <div>
            <Input
              v-model="formData.event"
              label="Event / Lomba"
              placeholder="Nama acara atau lomba"
              required
              :error="formErrors.event"
            />
          </div>
        </div>

        <Input
          v-model="formData.tahun"
          label="Tahun"
          placeholder="Contoh: 2026"
          required
          :error="formErrors.tahun"
        />
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { usePrestasiStore } from '../../stores/prestasi'
import { useExport } from '../../composables/useExport'
import type { Prestasi } from '../../types'
import { useFormValidation } from '../../composables/useFormValidation'
import Button from '../../components/ui/Button.vue'
import Modal from '../../components/ui/Modal.vue'
import Input from '../../components/ui/Input.vue'

const authStore = useAuthStore()
const prestasiStore = usePrestasiStore()
const { exportToCsv } = useExport()

const canEdit = computed(() => authStore.user?.role === 'admin')

const kelasFilter = ref('')
const juaraFilter = ref('')
const tahunFilter = ref('')

onMounted(async () => {
  if (prestasiStore.prestasis.length === 0) {
    await prestasiStore.fetchPrestasis()
  }
})

const filteredPrestasis = computed(() => {
  return prestasiStore.prestasis.filter(p => {
    const matchKelas = !kelasFilter.value || p.kelas === kelasFilter.value
    const matchJuara = !juaraFilter.value || p.juara === juaraFilter.value
    const matchTahun = !tahunFilter.value || p.tahun === tahunFilter.value
    return matchKelas && matchJuara && matchTahun
  })
})

const kelasOptions = computed(() => [...new Set(prestasiStore.prestasis.map(p => p.kelas))].sort())
const juaraOptions = ['Juara 1', 'Juara 2', 'Juara 3']
const tahunOptions = computed(() => [...new Set(prestasiStore.prestasis.map(p => p.tahun))].sort().reverse())

const showModal = ref(false)
const editingPrestasi = ref<Prestasi | null>(null)

const formData = reactive({
  studentId: '',
  siswa: '',
  kelas: '',
  kategori: '',
  juara: 'Juara 1',
  event: '',
  tahun: ''
})

const { errors: formErrors, validateForm, clearErrors } = useFormValidation({
  studentId: { required: true },
  siswa: { required: true },
  kelas: { required: true },
  kategori: { required: true },
  juara: { required: true },
  event: { required: true },
  tahun: { required: true }
})

const openAddModal = () => {
  editingPrestasi.value = null
  clearForm()
  showModal.value = true
}

const clearForm = () => {
  clearErrors()
  formData.studentId = ''
  formData.siswa = ''
  formData.kelas = ''
  formData.kategori = ''
  formData.juara = 'Juara 1'
  formData.event = ''
  formData.tahun = ''
}

const openEditModal = (prestasi: Prestasi) => {
  editingPrestasi.value = prestasi
  formData.studentId = prestasi.studentId
  formData.siswa = prestasi.siswa
  formData.kelas = prestasi.kelas
  formData.kategori = prestasi.kategori
  formData.juara = prestasi.juara
  formData.event = prestasi.event
  formData.tahun = prestasi.tahun
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  clearForm()
}

const savePrestasi = async () => {
  if (!validateForm(formData)) {
    return
  }

  let success = false
  if (editingPrestasi.value) {
    success = await prestasiStore.updatePrestasi(editingPrestasi.value.id, formData)
  } else {
    success = await prestasiStore.addPrestasi(formData as Omit<Prestasi, 'id'>)
  }

  if (success) {
    closeModal()
  } else {
    alert(`Gagal menyimpan prestasi: ${prestasiStore.error}`)
  }
}

const printPage = () => {
  window.print()
}

const deletePrestasi = async (id: string) => {
  if (confirm('Konfirmasi: Hapus data prestasi ini secara permanen?')) {
    const success = await prestasiStore.deletePrestasi(id)
    if (!success) {
      alert(`Gagal menghapus prestasi: ${prestasiStore.error}`)
    }
  }
}

const exportPrestasi = () => {
  const headers = ['Siswa', 'Kelas', 'Kategori', 'Juara', 'Event', 'Tahun']
  const rows = filteredPrestasis.value.map(p => [
    p.siswa,
    p.kelas,
    p.kategori,
    p.juara,
    p.event,
    p.tahun
  ])
  exportToCsv(headers, rows, 'ekspor-prestasi')
}
</script>
