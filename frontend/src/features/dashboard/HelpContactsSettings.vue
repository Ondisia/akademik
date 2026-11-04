<template>
  <div class="clean-card p-4 sm:p-6 space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Pengaturan Kontak Bantuan</h2>
        <p class="text-xs text-slate-500 mt-1">Admin dapat mengatur maksimal 2 nomor WhatsApp dan 2 akun Instagram.</p>
      </div>
      <button
        @click="saveSettings"
        :disabled="helpContactsStore.loading"
        class="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        Simpan
      </button>
    </div>

    <div class="grid gap-4 sm:gap-6">
      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">WhatsApp 1</label>
        <input v-model="form.wa[0]" type="text" placeholder="Contoh: +628123456789" class="clean-input w-full" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">WhatsApp 2</label>
        <input v-model="form.wa[1]" type="text" placeholder="Contoh: +628123456780" class="clean-input w-full" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Instagram 1</label>
        <input v-model="form.ig[0]" type="text" placeholder="Contoh: smk_nuruljadid" class="clean-input w-full" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Instagram 2</label>
        <input v-model="form.ig[1]" type="text" placeholder="Contoh: smk_nj_official" class="clean-input w-full" />
      </div>
      <div v-if="helpContactsStore.error" class="text-sm text-rose-600">{{ helpContactsStore.error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useHelpContactsStore } from '../../stores/helpContacts'

const helpContactsStore = useHelpContactsStore()
const form = reactive({ wa: ['', ''], ig: ['', ''] })

const loadSettings = async () => {
  await helpContactsStore.fetchHelpContacts()
  form.wa[0] = helpContactsStore.wa[0] || ''
  form.wa[1] = helpContactsStore.wa[1] || ''
  form.ig[0] = helpContactsStore.ig[0] || ''
  form.ig[1] = helpContactsStore.ig[1] || ''
}

const saveSettings = async () => {
  await helpContactsStore.updateHelpContacts({ wa: [form.wa[0], form.wa[1]], ig: [form.ig[0], form.ig[1]] })
}

onMounted(loadSettings)
</script>
