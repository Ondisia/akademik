<template>
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast-slide">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="toast-alert"
          :class="`toast-${toast.type}`"
        >
          <span class="toast-icon">
            <CheckCircleIcon v-if="toast.type === 'success'" :size="20" />
            <XCircleIcon v-else-if="toast.type === 'danger'" :size="20" />
            <AlertTriangleIcon
              v-else-if="toast.type === 'warning'"
              :size="20"
            />
            <InfoIcon v-else :size="20" />
          </span>
          <div class="toast-message">{{ toast.message }}</div>
          <button class="toast-close" @click="toastStore.remove(toast.id)">
            &times;
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useToastStore } from "../../stores/toastStore";
import {
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  Info as InfoIcon,
} from "lucide-vue-next";

const toastStore = useToastStore();
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  width: 100%;
  max-width: 350px;
  pointer-events: none;
}

.toast-alert {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-neutral-400);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  font-size: var(--font-size-sm);
  color: var(--color-neutral-800);
  position: relative;
}

.toast-success {
  border-left-color: var(--color-success);
}
.toast-danger {
  border-left-color: var(--color-danger);
}
.toast-warning {
  border-left-color: var(--color-warning);
}
.toast-info {
  border-left-color: var(--color-info);
}

.toast-icon {
  font-size: var(--font-size-md);
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-weight: var(--font-weight-medium);
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  color: var(--color-neutral-400);
  cursor: pointer;
  padding: 0 var(--spacing-1);
  line-height: 1;
  transition: var(--transition-fast);
}

.toast-close:hover {
  color: var(--color-neutral-700);
}

/* Slide animation */
.toast-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-slide-leave-active {
  transition: all 0.2s ease-in;
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
</style>
