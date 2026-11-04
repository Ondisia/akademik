<template>
  <span
    :class="[
      'inline-flex items-center shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border transition-all duration-300',
      variantClasses
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'urgent' | 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const variantClasses = computed(() => {
  const variants: Record<string, string> = {
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    danger: 'bg-rose-50 text-rose-600 border-rose-100',
    urgent: 'bg-rose-50 text-rose-600 border-rose-100',
    info: 'bg-sky-50 text-sky-600 border-sky-100',
    primary: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    secondary: 'bg-slate-50 text-slate-600 border-slate-200',
    default: 'bg-slate-50 text-slate-500 border-slate-100'
  }
  return variants[props.variant]
})
</script>

