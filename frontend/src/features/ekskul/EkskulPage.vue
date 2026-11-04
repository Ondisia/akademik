<template>
  <div class="space-y-10 pb-20">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-surface-900 tracking-tight">Manajemen Ekskul</h1>
        <p class="text-surface-500 mt-1 flex items-center gap-2 font-medium">
          <span class="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
          {{ ekskulStore.ekskuls.length }} Ekstrakurikuler terdaftar
        </p>
      </div>
      <div v-if="canEdit" class="flex gap-3">
        <Button variant="primary" size="lg" class="no-print" @click="openAddModal">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Ekskul
        </Button>
        <Button variant="outline" size="lg" class="no-print" @click="exportEkskul">Ekspor CSV</Button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="ekskulStore.ekskuls.length === 0" class="premium-card p-8 sm:p-12 text-center">
      <div class="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-surface-200">
        <svg class="w-10 h-10 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 class="text-2xl font-black text-surface-900 tracking-tight">Belum Ada Ekskul</h3>
      <p class="text-surface-500 mt-2 font-medium">Tambah data ekstrakurikuler terlebih dahulu.</p>
    </div>

    <!-- List Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div
        v-for="ekskul in ekskulStore.ekskuls"
        :key="ekskul.id"
        class="premium-card p-4 sm:p-6 flex flex-col"
      >
        <h3 class="font-black text-surface-900 text-base tracking-tight leading-tight max-w-xs truncate">
          {{ ekskul.nama }}
        </h3>
        <div class="mt-2 flex items-center gap-1.5">
          <span class="text-[10px] font-bold uppercase tracking-widest text-surface-500">Pembina</span>
          <span class="text-sm font-medium text-surface-900 truncate">{{ ekskul.pembina || '-' }}</span>
        </div>
        <div class="mt-2 flex items-center gap-1.5">
          <span class="text-[10px] font-bold uppercase tracking-widest text-surface-500">Jadwal</span>
          <span class="text-sm font-medium text-surface-900 tabular-nums truncate">{{ ekskul.jadwal || '-' }}</span>
        </div>
        <div class="mt-3 pt-2 border-t border-surface-100">
          <span class="text-[10px] font-bold uppercase tracking-widest text-surface-500 block mb-1">
            Deskripsi
          </span>
          <p class="text-[13px] text-surface-600 leading-relaxed truncate">
            {{ ekskul.deskripsi || '-' }}
          </p>
        </div>
        <div v-if="canEdit" class="mt-3 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button
            @click="openEditModal(ekskul)"
            class="p-2 bg-surface-100 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl border border-surface-200/60 transition-all"
            title="Ubah Ekskul"
            aria-label="Ubah data ekskul"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            @click="deleteEkskul(ekskul.id)"
            class="p-2 bg-surface-100 text-surface-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl border border-surface-200/60 transition-all"
            title="Hapus Ekskul"
            aria-label="Hapus data ekskul"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <Modal
      :is-open="showModal"
      title="Tambah Ekskul Baru"
      subtitle="Lengkapi data ekstrakurikuler dan pembina pengurusnya."
      confirm-text="Simpan Ekskul"
      @close="closeModal"
      @confirm="saveEkskul"
    >
      <div class="space-y-6">
        <Input
          v-model="formData.nama"
          label="Nama Ekskul"
          placeholder="Contoh: PMR, Robotika, Basket"
          required
          :error="formErrors.nama"
        />

        <Input
          v-model="formData.pembina"
          label="Pembina"
          placeholder="Nama pembina pengurus"
          :error="formErrors.pembina"
        />

        <Input
          v-model="formData.jadwal"
          label="Jadwal"
          placeholder="Contoh: Senin 15:00-16.30"
          :error="formErrors.jadwal"
        />

        <div>
          <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">
            Deskripsi
          </label>
          <textarea
            v-model="formData.deskripsi"
            rows="4"
            class="w-full px-5 py-4 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-medium focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
            placeholder="Deskripsi singkat kegiatan ekstrakurikuler"
          ></textarea>
          <p v-if="formErrors.deskripsi" class="mt-1.5 text-xs font-semibold text-rose-600 uppercase tracking-wider">
            {{ formErrors.deskripsi }}
          </p>
        </div>
      </div>
    </Modal>

    <!-- Edit Modal -->
    <Modal
      :is-open="showEditModal"
      :title="editingEkskul ? 'Ubah Data Ekskul' : 'Tambah Ekskul Baru'"
      subtitle="Lengkapi data ekstrakurikuler dan pembina pengurusnya."
      confirm-text="Simpan Perubahan"
      @close="closeEditModal"
      @confirm="saveEkskul"
    >
      <div class="space-y-6">
        <Input
          v-model="formData.nama"
          label="Nama Ekskul"
          placeholder="Contoh: PMR, Robotika, Basket"
          required
          :error="formErrors.nama"
        />

        <Input
          v-model="formData.pembina"
          label="Pembina"
          placeholder="Nama pembina pengurus"
          :error="formErrors.pembina"
        />

        <Input
          v-model="formData.jadwal"
          label="Jadwal"
          placeholder="Contoh: Senin 15:00-16.30"
          :error="formErrors.jadwal"
        />

        <div>
          <label class="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2 px-1">
            Deskripsi
          </label>
          <textarea
            v-model="formData.deskripsi"
            rows="4"
            class="w-full px-5 py-4 bg-surface-100/50 border border-surface-200/60 rounded-2xl text-surface-900 font-medium focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
            placeholder="Deskripsi singkat kegiatan ekstrakurikuler"
          ></textarea>
          <p v-if="formErrors.deskripsi" class="mt-1.5 text-xs font-semibold text-rose-600 uppercase tracking-wider">
            {{ formErrors.deskripsi }}
          </p>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useEkskulStore } from '../../stores/ekskul'
import { useAuthStore } from '../../stores/auth'
import { useFormValidation } from '../../composables/useFormValidation'
import { useExport } from '../../composables/useExport'
import type { Ekskul } from '../../types'
import Button from '../../components/ui/Button.vue'
import Modal from '../../components/ui/Modal.vue'
import Input from '../../components/ui/Input.vue'

const ekskulStore = useEkskulStore()
const authStore = useAuthStore()
const { exportToCsv } = useExport()

const canEdit = computed(() => authStore.user?.role === 'admin')

onMounted(async () => {
  if (ekskulStore.ekskuls.length === 0) {
    await ekskulStore.fetchEkskuls()
  }
})

const showModal = ref(false)
const showEditModal = ref(false)
const editingEkskul = ref<Ekskul | null>(null)

const formData = reactive({
  nama: '',
  pembina: '',
  jadwal: '',
  deskripsi: ''
})

const { errors: formErrors, validateForm, clearErrors } = useFormValidation({
  nama: { required: true }
})

const openAddModal = () => {
  editingEkskul.value = null
  clearForm()
  showModal.value = true
}

const clearForm = () => {
  clearErrors()
  formData.nama = ''
  formData.pembina = ''
  formData.jadwal = ''
  formData.deskripsi = ''
}

const closeModal = () => {
  showModal.value = false
  clearForm()
}

const openEditModal = (ekskul: Ekskul) => {
  editingEkskul.value = ekskul
  formData.nama = ekskul.nama
  formData.pembina = ekskul.pembina || ''
  formData.jadwal = ekskul.jadwal || ''
  formData.deskripsi = ekskul.deskripsi || ''
  clearErrors()
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingEkskul.value = null
  clearForm()
}

const saveEkskul = async () => {
  if (!validateForm(formData)) {
    return
  }

  let success = false
  if (editingEkskul.value) {
    success = await ekskulStore.updateEkskul(editingEkskul.value.id, formData as Partial<Ekskul>)
    if (success) closeEditModal()
  } else {
    success = await ekskulStore.addEkskul(formData as Omit<Ekskul, 'id'>)
    if (success) closeModal()
  }

  if (!success) {
    alert(`Gagal menyimpan ekskul: ${ekskulStore.error}`)
  }
}

const deleteEkskul = async (id: string) => {
  if (confirm('Konfirmasi: Hapus data ekskul ini secara permanen?')) {
    const success = await ekskulStore.deleteEkskul(id)
    if (!success) {
      alert(`Gagal menghapus ekskul: ${ekskulStore.error}`)
    }
  }
}

const exportEkskul = () => {
  const headers = ['Nama Ekskul', 'Pembina', 'Jadwal', 'Deskripsi']
  const rows = ekskulStore.ekskuls.map(e => [
    e.nama,
    e.pembina || '',
    e.jadwal || '',
    e.deskripsi || ''
  ])
  exportToCsv(headers, rows, 'ekspor-ekskul')
}
</script>
