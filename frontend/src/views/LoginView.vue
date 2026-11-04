<template>
  <div class="login-box">
    <div class="login-header">
      <h2>Selamat Datang Kembali</h2>
      <p class="text-muted text-sm">
        Masuk untuk mengakses sistem informasi akademik sekolah
      </p>
    </div>

    <!-- Error Alert -->
    <div class="alert alert-danger mb-4" v-if="errorMsg">
      <XCircle :size="20" class="icon-error" />
      <div class="alert-content">{{ errorMsg }}</div>
    </div>

    <form @submit.prevent="handleLogin" class="login-form">
      <FormInput
        id="email"
        label="Alamat Email"
        type="email"
        placeholder="nama@smk.sch.id"
        v-model="email"
        required
      />

      <FormInput
        id="password"
        label="Kata Sandi"
        type="password"
        placeholder="••••••••"
        v-model="password"
        required
      />

      <div class="form-actions mb-4 flex items-center justify-between">
        <label
          class="remember-me flex items-center gap-2 text-sm cursor-pointer"
        >
          <input type="checkbox" v-model="rememberMe" />
          <span>Ingat saya</span>
        </label>
        <a href="#" class="forgot-password text-sm">Lupa kata sandi?</a>
      </div>

      <BaseButton
        type="submit"
        variant="primary"
        size="lg"
        class="w-full"
        :loading="loading"
      >
        Masuk Ke Akun
      </BaseButton>
    </form>

    <div class="login-footer text-center mt-6">
      <p class="text-muted text-sm">
        Belum memiliki akun? Hubungi Admin Sekolah untuk pendaftaran.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { XCircle } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";
import FormInput from "../components/ui/FormInput.vue";
import BaseButton from "../components/ui/BaseButton.vue";

const authStore = useAuthStore();
const toastStore = useToastStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const loading = ref(false);
const errorMsg = ref("");

const handleLogin = async () => {
  loading.value = ref(true).value = true;
  errorMsg.value = "";
  try {
    const user = await authStore.login(email.value, password.value);
    toastStore.success(`Selamat datang, ${user.name}!`);
    router.push({ name: "Dashboard" });
  } catch (err) {
    errorMsg.value =
      err.message || "Login gagal. Periksa kembali email dan password Anda.";
    toastStore.error(errorMsg.value);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-box {
  background-color: var(--color-surface);
}

.login-header {
  margin-bottom: var(--spacing-6);
  text-align: center;
}

.login-header h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-neutral-800);
  letter-spacing: -0.5px;
  margin-bottom: var(--spacing-1);
}

.login-form {
  margin-top: var(--spacing-4);
}

.form-actions {
  width: 100%;
}

.remember-me input {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary-500);
}

.forgot-password {
  font-size: var(--font-size-sm);
  color: var(--color-primary-600);
  font-weight: var(--font-weight-medium);
}

.forgot-password:hover {
  text-decoration: underline;
}

.alert {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}

.alert-danger {
  background-color: var(--color-danger-light);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--color-danger-dark);
}

.alert-content {
  flex: 1;
  font-weight: var(--font-weight-medium);
}

.icon-error {
  flex-shrink: 0;
  color: var(--color-danger-dark);
}
</style>
