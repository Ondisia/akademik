<template>
  <div class="space-y-6 sm:space-y-8 pb-16">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Tagihan SPP / Triwulan</h1>
        <p class="text-sm text-slate-500 mt-1">Kelola atau lihat status pembayaran siswa sesuai peran.</p>
      </div>

      <button
        v-if="authStore.hasRole('admin')"
        @click="openCreateBillModal"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Buat Tagihan Baru
      </button>
    </div>

    <div class="grid gap-4 sm:gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div class="space-y-6">
        <div class="clean-card p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold text-slate-900">Daftar Tagihan</h2>
              <p class="text-sm text-slate-500 mt-1">Tampilkan histori tagihan dan status pembayaran.</p>
            </div>
            <div class="w-full sm:w-auto">
              <select v-model="filterStatus" class="clean-input w-full sm:w-52">
                <option value="">Semua Status</option>
                <option value="requested">Diminta</option>
                <option value="pending_verification">Menunggu Verifikasi</option>
                <option value="paid">Lunas</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div v-if="filteredBills.length === 0" class="clean-card p-8 sm:p-12 text-center text-slate-500">
            Belum ada tagihan untuk ditampilkan.
          </div>

          <div
            v-for="bill in filteredBills"
            :key="bill.id"
            class="clean-card p-4 sm:p-6 border border-slate-200 shadow-sm"
          >
            <div class="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div>
                <p class="text-sm text-slate-500 uppercase tracking-[0.18em]">{{ bill.period }}</p>
                <h3 class="text-xl font-bold text-slate-900 mt-2">{{ bill.studentName }}</h3>
                <p class="text-sm text-slate-500 mt-1">{{ bill.description || 'Tagihan SPP / Triwulan' }}</p>
              </div>

              <div class="text-right">
                <p class="text-sm text-slate-500">Jumlah</p>
                <p class="text-2xl font-semibold text-slate-900 tabular-nums whitespace-nowrap">Rp {{ formatCurrency(bill.amount) }}</p>
              </div>
            </div>

            <div class="mt-6 flex flex-wrap gap-3">
              <div class="flex-1 basis-40 rounded-3xl bg-slate-50 p-4">
                <p class="text-[11px] text-slate-500 uppercase tracking-[0.2em]">Status</p>
                <p class="text-sm font-semibold mt-2" :class="statusClass(bill.status)">{{ statusLabel(bill.status) }}</p>
              </div>
              <div class="flex-1 basis-40 rounded-3xl bg-slate-50 p-4">
                <p class="text-[11px] text-slate-500 uppercase tracking-[0.2em]">Dibuat</p>
                <p class="text-sm font-semibold mt-2 tabular-nums">{{ formatDate(bill.createdAt) }}</p>
              </div>
              <div class="flex-1 basis-40 rounded-3xl bg-slate-50 p-4">
                <p class="text-[11px] text-slate-500 uppercase tracking-[0.2em]">Terakhir</p>
                <p class="text-sm font-semibold mt-2 tabular-nums">{{ formatDate(bill.updatedAt) }}</p>
              </div>
            </div>

            <div class="mt-6 flex flex-wrap gap-3">
              <button
                v-if="authStore.hasRole('admin')"
                @click="openEditBillModal(bill)"
                class="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Ubah Status
              </button>
              <button
                v-if="authStore.hasRole('orang_tua') && bill.status === 'requested'"
                @click="openUploadProofModal(bill)"
                class="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Unggah Bukti Bayar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="clean-card p-4 sm:p-6 h-fit">
        <div class="space-y-4">
          <div>
            <p class="text-sm font-semibold text-slate-900">Panduan peran</p>
            <ul class="mt-3 space-y-2 text-sm text-slate-600">
              <li>Admin bisa membuat dan mengubah status tagihan.</li>
              <li>Orang tua hanya bisa melihat tagihan dan mengunggah bukti pembayaran.</li>
              <li>Guru dan siswa hanya dapat melihat status tagihan.</li>
            </ul>
          </div>

          <div>
            <p class="text-sm font-semibold text-slate-900">Status saat ini</p>
            <div class="mt-3 grid gap-3">
              <div class="rounded-3xl bg-indigo-50 p-4">
                <p class="text-xs uppercase tracking-[0.14em] text-indigo-600">Permintaan</p>
                <p class="text-lg font-semibold text-slate-900">Admin dapat meminta tagihan</p>
              </div>
              <div class="rounded-3xl bg-emerald-50 p-4">
                <p class="text-xs uppercase tracking-[0.14em] text-emerald-600">Bukti bayar</p>
                <p class="text-lg font-semibold text-slate-900">Orang tua mengunggah foto bukti bayar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Modal
      :is-open="showCreateModal"
      title="Buat Tagihan Baru"
      confirm-text="Simpan Tagihan"
      @close="closeCreateModal"
      @confirm="submitCreateBill"
    >
      <div class="space-y-4">
        <label class="block text-sm font-semibold text-slate-700">Siswa</label>
        <select v-model="createForm.studentId" class="clean-input w-full">
          <option value="" disabled>Pilih siswa</option>
          <option v-for="student in studentOptions" :key="student.id" :value="student.id">{{ student.name }} — {{ student.class }}</option>
        </select>

        <Input v-model="createForm.period" label="Periode" placeholder="Contoh: Triwulan 1 / Juli - September" />
        <Input v-model="createForm.amount" label="Jumlah (Rp)" type="number" placeholder="Contoh: 350000" />
        <Input v-model="createForm.description" label="Keterangan" placeholder="Opsional: Bayar iuran SPP triwulan" />
      </div>
    </Modal>

    <Modal
      :is-open="showEditModal"
      title="Ubah Status Tagihan"
      confirm-text="Simpan"
      @close="closeEditModal"
      @confirm="submitEditBill"
    >
      <div class="space-y-4">
        <label class="block text-sm font-semibold text-slate-700">Status</label>
        <select v-model="editForm.status" class="clean-input w-full">
          <option value="requested">Diminta</option>
          <option value="pending_verification">Menunggu Verifikasi</option>
          <option value="paid">Lunas</option>
          <option value="rejected">Ditolak</option>
        </select>
      </div>
    </Modal>

    <Modal
      :is-open="showUploadModal"
      title="Unggah Bukti Bayar"
      confirm-text="Kirim Bukti"
      @close="closeUploadModal"
      @confirm="submitUploadProof"
    >
      <div class="space-y-4">
        <p class="text-sm text-slate-500">Unggah foto atau file bukti pembayaran untuk tagihan {{ currentBill?.period }}</p>
        <input type="file" @change="handleProofFile" class="w-full" />
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useBillingStore } from '../../stores/billing'
import { useStudentStore } from '../../stores/student'
import type { Bill, Student } from '../../types'
import Input from '../../components/ui/Input.vue'
import Modal from '../../components/ui/Modal.vue'

const authStore = useAuthStore()
const billingStore = useBillingStore()
const studentStore = useStudentStore()

const filterStatus = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showUploadModal = ref(false)
const currentBill = ref<Bill | null>(null)
const proofFile = ref<File | null>(null)

const createForm = ref({
  studentId: '',
  period: '',
  amount: 0,
  description: ''
})

const editForm = ref({
  status: 'requested'
})

const studentOptions = computed<Student[]>(() => studentStore.students)

const filteredBills = computed(() => {
  if (!filterStatus.value) return billingStore.bills
  return billingStore.bills.filter(bill => bill.status === filterStatus.value)
})

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    requested: 'Diminta',
    pending_verification: 'Menunggu Verifikasi',
    paid: 'Lunas',
    rejected: 'Ditolak'
  }
  return labels[status] || status
}

const statusClass = (status: string) => {
  const classes: Record<string, string> = {
    requested: 'text-slate-900',
    pending_verification: 'text-amber-600',
    paid: 'text-emerald-600',
    rejected: 'text-rose-600'
  }
  return classes[status] || 'text-slate-900'
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('id-ID')
}

const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const initForm = () => {
  createForm.value = {
    studentId: '',
    period: '',
    amount: 0,
    description: ''
  }
}

const openCreateBillModal = () => {
  initForm()
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const openEditBillModal = (bill: Bill) => {
  currentBill.value = bill
  editForm.value = { status: bill.status }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  currentBill.value = null
}

const openUploadProofModal = (bill: Bill) => {
  currentBill.value = bill
  proofFile.value = null
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  currentBill.value = null
  proofFile.value = null
}

const handleProofFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  proofFile.value = target.files?.[0] ?? null
}

const submitCreateBill = async () => {
  if (!createForm.value.studentId || !createForm.value.period || !createForm.value.amount) {
    alert('Lengkapi data tagihan terlebih dahulu.')
    return
  }

  const success = await billingStore.addBill({
    studentId: createForm.value.studentId,
    amount: createForm.value.amount,
    period: createForm.value.period,
    description: createForm.value.description
  })

  if (success) {
    closeCreateModal()
  } else {
    alert(`Gagal membuat tagihan: ${billingStore.error}`)
  }
}

const submitEditBill = async () => {
  if (!currentBill.value) return

  const success = await billingStore.updateBill(currentBill.value.id, {
    status: editForm.value.status
  })

  if (success) {
    closeEditModal()
  } else {
    alert(`Gagal memperbarui tagihan: ${billingStore.error}`)
  }
}

const submitUploadProof = async () => {
  if (!currentBill.value || !proofFile.value) {
    alert('Silakan pilih file bukti bayar terlebih dahulu.')
    return
  }

  try {
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result as string
      const success = await billingStore.updateBill(currentBill.value!.id, {
        paymentProof: base64,
        proofFilename: proofFile.value!.name
      })

      if (success) {
        closeUploadModal()
      } else {
        alert(`Gagal mengirim bukti bayar: ${billingStore.error}`)
      }
    }
    reader.readAsDataURL(proofFile.value)
  } catch (err) {
    console.error(err)
    alert('Terjadi kesalahan saat memproses bukti bayar.')
  }
}

onMounted(async () => {
  if (!studentStore.students.length) {
    await studentStore.fetchStudents()
  }
  await billingStore.fetchBills()
})
</script>
