<script setup>
import { Lock } from "lucide-vue-next";
</script>

<template>
  <div class="forbidden-page flex flex-col items-center justify-center">
    <div class="forbidden-card text-center">
      <Lock :size="64" class="lock-icon" />
      <h1 class="mb-2">Akses Ditolak</h1>
      <p class="text-muted mb-6">
        Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini
        hanya untuk pengguna dengan hak akses tertentu.
      </p>
      <router-link to="/" class="btn btn-primary">
        Kembali ke Dashboard
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.forbidden-page {
  min-height: 70vh;
}

.forbidden-card {
  max-width: 450px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: var(--spacing-8);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.lock-icon {
  font-size: var(--font-size-4xl);
  display: block;
  margin-bottom: var(--spacing-4);
}
</style>
