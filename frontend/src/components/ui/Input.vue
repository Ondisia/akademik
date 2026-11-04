<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="clean-label">{{ label }}</label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :aria-invalid="error ? 'true' : undefined"
        class="clean-input min-h-[40px]"
        :class="{ 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500': error }"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <p v-if="error" class="mt-1.5 text-xs font-semibold text-rose-600 uppercase tracking-wider">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  id?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false,
  id: () => `input-${Math.random().toString(36).substr(2, 9)}`
})

defineEmits(['update:modelValue'])
</script>
