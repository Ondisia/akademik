<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-[100] overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div role="dialog" aria-modal="true" :aria-labelledby="titleId" class="relative bg-white rounded-modal shadow-elevated w-full max-w-lg overflow-hidden transform transition-all border border-slate-200">
            <!-- Header -->
            <div class="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div class="min-w-0">
                <h3 :id="titleId" class="text-base font-bold text-slate-900 leading-none">{{ title }}</h3>
                <p v-if="subtitle" class="text-xs text-slate-500 mt-1 font-medium">{{ subtitle }}</p>
              </div>
              <button @click="$emit('close')" aria-label="Tutup" class="p-2 shrink-0 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
              <slot />
            </div>

            <!-- Footer -->
            <div class="px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button variant="secondary" @click="$emit('close')">{{ cancelText }}</Button>
              <Button variant="primary" @click="$emit('confirm')">{{ confirmText }}</Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Button from './Button.vue'

interface Props {
  isOpen: boolean
  title: string
  subtitle?: string
  confirmText?: string
  cancelText?: string
}

withDefaults(defineProps<Props>(), {
  isOpen: false,
  confirmText: 'Konfirmasi',
  cancelText: 'Batal'
})

defineEmits(['close', 'confirm'])

const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
