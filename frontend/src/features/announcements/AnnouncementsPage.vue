<template>
  <div class="space-y-6 sm:space-y-8 pb-16">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Papan Pengumuman</h1>
        <p class="text-slate-500 mt-1 flex items-center gap-2">
          <span class="flex h-2 w-2 rounded-full bg-indigo-500"></span>
          Informasi terkini kegiatan akademik SMK
        </p>
      </div>
      <Button v-if="canEdit" variant="primary" @click="openAddModal" class="shadow-lg shadow-indigo-100">
        <span class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Buat Pengumuman
        </span>
      </Button>
    </div>

    <!-- Filters Bar -->
    <div class="flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-card border border-slate-200/60 shadow-sm">
      <div class="flex-1">
        <Input
          v-model="searchQuery"
          placeholder="Cari pengumuman atau informasi..."
          label="Pencarian"
        />
      </div>
      
      <div class="flex flex-wrap items-center gap-2">
        <button
          @click="selectedCategory = ''"
          class="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 border"
          :class="!selectedCategory ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'text-slate-500 border-transparent hover:bg-slate-50'"
        >
          Semua
        </button>
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          class="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 border"
          :class="selectedCategory === cat 
            ? getCategoryActiveClass(cat)
            : 'text-slate-500 border-transparent hover:bg-slate-50'"
        >
          {{ getCategoryLabel(cat) }}
        </button>
      </div>
    </div>

    <!-- Announcements Grid/List -->
    <div v-if="filteredAnnouncements.length === 0" class="p-8 sm:p-12 text-center bg-white border border-slate-200/60 rounded-card">
      <div class="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
         <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
         </svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Belum ada pengumuman</h3>
      <p class="text-slate-500 mt-1">Nantikan informasi menarik lainnya segera!</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 sm:gap-6">
      <div
        v-for="announcement in filteredAnnouncements"
        :key="announcement.id"
        class="group bg-white rounded-card p-6 sm:p-8 border border-slate-200/60 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-500 relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
           <svg class="w-full h-full text-indigo-900" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
           </svg>
        </div>

        <div class="flex flex-col md:flex-row justify-between items-start gap-4 sm:gap-6 relative z-10">
          <div class="flex-1 space-y-4">
            <div class="flex items-center gap-3 flex-wrap">
               <span class="px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border shrink-0" :class="getCategoryBadgeClass(announcement.category)">
                  {{ getCategoryLabel(announcement.category) }}
               </span>
               <div class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(announcement.createdAt) }}
               </div>
            </div>

            <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{{ announcement.title }}</h2>
            <p class="text-slate-600 leading-relaxed max-w-4xl">{{ announcement.content }}</p>
            
            <div class="flex items-center gap-3 pt-4 border-t border-slate-50">
               <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px]">
                  {{ announcement.author.charAt(0) }}
               </div>
               <div class="flex flex-col">
                  <span class="text-xs font-bold text-slate-900 leading-none">{{ announcement.author }}</span>
                  <span class="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-widest">{{ formatTime(announcement.createdAt) }}</span>
               </div>
            </div>
          </div>

          <div v-if="canEdit" class="flex md:flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button @click="editAnnouncement(announcement)" class="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-transparent hover:border-indigo-100">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button @click="deleteAnnouncement(announcement.id)" class="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Modal
      :is-open="showModal"
      :title="editingAnnouncement ? 'Ubah Pengumuman' : 'Publikasikan Informasi'"
      confirm-text="Publish Sekarang"
      @close="closeModal"
      @confirm="saveAnnouncement"
    >
      <div class="space-y-6">
        <Input
          v-model="formData.title"
          label="Judul Informasi"
          placeholder="Contoh: Jadwal Ujian Akhir Semester"
          :error="formErrors.title"
          required
        />

        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
            Detail Informasi
            <span class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="formData.content"
            placeholder="Tuliskan isi pengumuman secara lengkap dan jelas..."
            rows="6"
            :class="[
              'w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-900 transition-all resize-none',
              formErrors.content ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'
            ]"
          />
          <p v-if="formErrors.content" class="mt-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest">
            {{ formErrors.content }}
          </p>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Tingkat Prioritas</label>
          <select
            v-model="formData.category"
            class="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
          >
            <option value="info">Informasi Umum</option>
            <option value="warning">Peringatan / Himbauan</option>
            <option value="urgent">Sangat Mendesak (Urgent)</option>
          </select>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useAnnouncementStore } from '../../stores/announcement'
import { useFormValidation } from '../../composables/useFormValidation'
import type { Announcement } from '../../types'
import Button from '../../components/ui/Button.vue'
import Input from '../../components/ui/Input.vue'
import Modal from '../../components/ui/Modal.vue'

const authStore = useAuthStore()
const announcementStore = useAnnouncementStore()

const canEdit = computed(() => ['admin', 'kepala_sekolah', 'waka'].includes(authStore.user?.role || ''))

onMounted(async () => {
  if (announcementStore.announcements.length === 0) {
    await announcementStore.fetchAnnouncements()
  }
})

const showModal = ref(false)
const editingAnnouncement = ref<Announcement | null>(null)
const selectedCategory = ref('')
const searchQuery = ref('')
const categories = ['info', 'warning', 'urgent']

const formData = reactive({
  title: '',
  content: '',
  category: 'info' as 'info' | 'warning' | 'urgent'
})

const { errors: formErrors, validateForm, clearErrors } = useFormValidation({
  title: { required: true },
  content: { required: true }
})

const filteredAnnouncements = computed(() => {
  let filtered = announcementStore.announcements

  if (selectedCategory.value) {
    filtered = filtered.filter(a => a.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.content.toLowerCase().includes(q)
    )
  }

  return [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})

const getCategoryLabel = (cat: string) => {
  const labels: Record<string, string> = {
    info: 'Informasi',
    warning: 'Peringatan',
    urgent: 'Penting'
  }
  return labels[cat] || cat
}

const getCategoryBadgeClass = (cat: string) => {
  const classes: Record<string, string> = {
    info: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    urgent: 'bg-rose-50 text-rose-600 border-rose-100'
  }
  return classes[cat] || ''
}

const getCategoryActiveClass = (cat: string) => {
  const classes: Record<string, string> = {
    info: 'bg-indigo-600 text-white shadow-md shadow-indigo-200 border-indigo-600',
    warning: 'bg-amber-500 text-white shadow-md shadow-amber-200 border-amber-500',
    urgent: 'bg-rose-500 text-white shadow-md shadow-rose-200 border-rose-500'
  }
  return classes[cat] || ''
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openAddModal = () => {
  editingAnnouncement.value = null
  clearForm()
  showModal.value = true
}

const clearForm = () => {
  clearErrors()
  formData.title = ''
  formData.content = ''
  formData.category = 'info'
}

const editAnnouncement = (announcement: Announcement) => {
  editingAnnouncement.value = announcement
  formData.title = announcement.title
  formData.content = announcement.content
  formData.category = announcement.category as any
  showModal.value = true
}

const saveAnnouncement = async () => {
  if (!validateForm(formData)) {
    return
  }

  let success = false
  if (editingAnnouncement.value) {
    success = await announcementStore.updateAnnouncement(editingAnnouncement.value.id, formData)
  } else {
    success = await announcementStore.addAnnouncement({
      ...formData,
      author: authStore.user?.name || 'Unknown',
      createdAt: new Date().toISOString()
    })
  }

  if (success) {
    closeModal()
  } else {
    alert(`Gagal menyimpan pengumuman: ${announcementStore.error}`)
  }
}

const deleteAnnouncement = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
    const success = await announcementStore.deleteAnnouncement(id)
    if (!success) {
      alert(`Gagal menghapus pengumuman: ${announcementStore.error}`)
    }
  }
}

const closeModal = () => {
  showModal.value = false
  clearForm()
}
</script>

