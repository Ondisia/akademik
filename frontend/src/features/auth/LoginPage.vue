<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
    <div class="w-full max-w-[420px]">
      <!-- Logo & Branding -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl border border-slate-100 shadow-clean mb-6 overflow-hidden p-1">
          <img src="../../assets/logo-nj.jpg" alt="SMK Nurul Jadid" class="w-full h-full object-contain" />
        </div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Akademik SMK</h1>
        <p class="text-sm text-slate-500 mt-1">Masuk untuk mengakses sistem manajemen sekolah.</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white border border-slate-200 rounded-xl shadow-clean p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <Input
            v-model="email"
            type="email"
            label="Email Institusi"
            placeholder="nama@sekolah.sch.id"
            required
          />
          
          <div class="space-y-1.5">
            <div class="flex items-center justify-between px-0.5">
              <label class="text-sm font-medium text-slate-700">Kata Sandi</label>
              <a href="#" class="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">Lupa Sandi?</a>
            </div>
            <Input
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div v-if="authStore.error" class="p-3 bg-rose-50 border border-rose-100 rounded-lg">
            <p class="text-xs font-bold text-rose-600 text-center uppercase tracking-wider">{{ authStore.error }}</p>
          </div>

          <Button type="submit" variant="primary" block :loading="authStore.loading">
            Masuk ke Dashboard
          </Button>
        </form>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
          <div class="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
            <span class="bg-white px-4 text-slate-400">Akun Percobaan</span>
          </div>
        </div>

        <!-- Demo Accounts -->
        <div class="grid grid-cols-2 gap-3">
          <button 
            @click="fillDemo('admin@smk.id', 'admin123')"
            class="px-3 py-2.5 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all text-left group"
          >
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-400">Admin</p>
            <p class="text-xs font-bold text-slate-700">Quick Fill</p>
          </button>
          <button 
            @click="fillDemo('guru@smk.id', 'guru123')"
            class="px-3 py-2.5 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all text-left group"
          >
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-indigo-400">Guru</p>
            <p class="text-xs font-bold text-slate-700">Quick Fill</p>
          </button>
        </div>
      </div>

      <!-- Footer Info -->
      <p class="text-center mt-10 text-[11px] font-medium text-slate-400 uppercase tracking-widest">
        &copy; 2026 Sistem Akademik SMK &bull; V2.0 Clean
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import Input from '../../components/ui/Input.vue'
import Button from '../../components/ui/Button.vue'

const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/dashboard')
  }
}

const fillDemo = (e: string, p: string) => {
  email.value = e
  password.value = p
}
</script>
