<template>
  <div :class="['premium-card p-4 sm:p-6', classOverride]">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  classOverride?: string
}

withDefaults(defineProps<Props>(), {
  classOverride: ''
})
</script>

