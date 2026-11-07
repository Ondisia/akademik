<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Komunikasi</h1>
        <p class="text-sm text-slate-500 mt-1">Kelola pesan dan pengumuman penting antar pengguna sistem akademik.</p>
      </div>
      <button
        v-if="canEdit"
        @click="openNewMessageModal"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Buat Pesan Baru
      </button>
    </div>

    <section class="grid gap-4 sm:gap-6 lg:grid-cols-2">
      <div class="clean-card p-4 sm:p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Pesan Masuk</h2>
            <p class="text-xs text-slate-500 mt-1">Lihat pesan terbaru dari guru, wali kelas, atau admin.</p>
          </div>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{{ inboxMessages.length }} pesan</span>
        </div>

        <div class="space-y-3">
          <div v-if="inboxMessages.length === 0" class="rounded-xl border border-slate-200 p-6 text-slate-500">
            Belum ada pesan masuk.
          </div>

          <div v-for="message in inboxMessages" :key="message.id" class="border border-slate-200 rounded-xl p-4 hover:border-indigo-200 transition-colors">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-bold text-slate-900 truncate">{{ message.subject }}</p>
                <p class="text-xs text-slate-500">{{ message.sender }}</p>
              </div>
              <span class="text-[10px] uppercase tracking-wider text-slate-500 shrink-0">{{ message.time }}</span>
            </div>
            <p class="text-sm text-slate-600 mt-3 line-clamp-2">{{ message.preview }}</p>
          </div>
        </div>
      </div>

      <div class="clean-card p-4 sm:p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Pesan Terkirim</h2>
            <p class="text-xs text-slate-500 mt-1">Riwayat pesan yang Anda buat.</p>
          </div>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{{ sentMessages.length }} item</span>
        </div>

        <div class="space-y-3">
          <div v-if="sentMessages.length === 0" class="rounded-xl border border-slate-200 p-6 text-slate-500">
            Belum ada pesan terkirim.
          </div>

          <div v-for="message in sentMessages" :key="message.id" class="rounded-xl bg-slate-50 p-4">
            <p class="text-sm font-bold text-slate-900">{{ message.subject }}</p>
            <p class="text-xs text-slate-500 mt-1">Kepada: {{ message.recipient }}</p>
            <p class="text-sm text-slate-600 mt-3 line-clamp-2">{{ message.body }}</p>
            <p class="text-[10px] text-slate-500 mt-3 uppercase tracking-[0.18em]">{{ message.sentAt }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="clean-card p-4 sm:p-6">
      <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Pengumuman Grup</h2>
      <p class="text-xs text-slate-500 mt-1">Pengumuman penting yang dibagikan ke semua siswa dan guru.</p>
      <div class="mt-4 space-y-3">
        <div v-for="announcement in groupAnnouncements" :key="announcement.id" class="rounded-xl bg-slate-50 p-4">
          <p class="text-sm font-bold text-slate-900">{{ announcement.title }}</p>
          <p class="text-xs text-slate-500 mt-1">{{ announcement.date }}</p>
          <p class="text-sm text-slate-600 mt-3">{{ announcement.description }}</p>
        </div>
      </div>
    </section>

    <Modal
      :is-open="showMessageModal"
      title="Buat Pesan Baru"
      confirm-text="Kirim Pesan"
      @close="closeNewMessageModal"
      @confirm="submitNewMessage"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Kepada</label>
          <select v-model="messageForm.recipient" class="clean-input w-full">
            <option value="Semua">Semua</option>
            <option value="Admin">Admin</option>
            <option value="Guru">Guru</option>
            <option value="Siswa">Siswa</option>
            <option value="Orang Tua">Orang Tua</option>
          </select>
        </div>

        <Input v-model="messageForm.subject" label="Judul Pesan" placeholder="Contoh: Konfirmasi Absensi" />

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">Isi Pesan</label>
          <textarea
            v-model="messageForm.body"
            rows="5"
            class="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-900 transition-all resize-none"
            placeholder="Tuliskan pesan Anda di sini..."
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import Input from '../../components/ui/Input.vue'
import Modal from '../../components/ui/Modal.vue'

const authStore = useAuthStore()

const showMessageModal = ref(false)

const canEdit = computed(() => authStore.hasAnyRole(['admin', 'kepala_sekolah', 'waka', 'guru_mapel', 'wali_kelas', 'guru']))

const inboxMessages = ref([
  {
    id: 1,
    subject: 'Jadwal Ulangan Semester',
    sender: 'Wali Kelas',
    time: '2 jam lalu',
    preview: 'Jadwal ulangan semester akan diumumkan pada rapat orang tua murid...'
  },
  {
    id: 2,
    subject: 'Pengumuman Libur Sekolah',
    sender: 'Admin Sekolah',
    time: '1 hari lalu',
    preview: 'Sekolah akan libur pada tanggal 17 Agustus untuk memperingati Hari Kemerdekaan...'
  }
])

const sentMessages = ref<Array<{ id: number; recipient: string; subject: string; body: string; sentAt: string }>>([])

const groupAnnouncements = computed(() => [
  {
    id: 1,
    title: 'Rapat Koordinasi Guru',
    date: '14 Juli 2026',
    description: 'Semua guru diminta hadir pada rapat koordinasi di ruang pertemuan utama pukul 08.00.'
  },
  {
    id: 2,
    title: 'Pendaftaran Ekstrakurikuler',
    date: '12 Juli 2026',
    description: 'Siswa dapat mendaftar ekstrakurikuler melalui sistem sebelum akhir bulan ini.'
  },
  {
    id: 3,
    title: 'Kegiatan Sosial',
    date: '10 Juli 2026',
    description: 'Kegiatan sosial diadakan di lingkungan sekolah, harap siswa membawa perlengkapan sesuai jadwal.'
  }
])

const messageForm = ref({
  recipient: 'Semua',
  subject: '',
  body: ''
})

const openNewMessageModal = () => {
  messageForm.value = { recipient: 'Semua', subject: '', body: '' }
  showMessageModal.value = true
}

const closeNewMessageModal = () => {
  showMessageModal.value = false
}

const submitNewMessage = () => {
  if (!messageForm.value.subject || !messageForm.value.body) {
    alert('Judul dan isi pesan harus diisi.')
    return
  }

  sentMessages.value.unshift({
    id: Date.now(),
    recipient: messageForm.value.recipient,
    subject: messageForm.value.subject,
    body: messageForm.value.body,
    sentAt: new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long', year: 'numeric' })
  })

  showMessageModal.value = false
}
</script>
