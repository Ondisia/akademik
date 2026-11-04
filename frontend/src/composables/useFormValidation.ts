import { ref } from 'vue'

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

interface ValidationRules {
  [key: string]: ValidationRule | ValidationRule[]
}

export function useFormValidation(rules: ValidationRules) {
  const errors = ref<Record<string, string>>({})

  const validateField = (fieldName: string, value: any): boolean => {
    const fieldRules = rules[fieldName]
    if (!fieldRules) return true

    const rulesToCheck = Array.isArray(fieldRules) ? fieldRules : [fieldRules]

    for (const rule of rulesToCheck) {
      // Required validation
      if (rule.required && !value) {
        errors.value[fieldName] = `${fieldName} tidak boleh kosong`
        return false
      }

      if (!value) continue

      // Min length validation
      if (
        rule.minLength &&
        typeof value === 'string' &&
        value.length < rule.minLength
      ) {
        errors.value[fieldName] = `${fieldName} minimal ${rule.minLength} karakter`
        return false
      }

      // Max length validation
      if (
        rule.maxLength &&
        typeof value === 'string' &&
        value.length > rule.maxLength
      ) {
        errors.value[fieldName] = `${fieldName} maksimal ${rule.maxLength} karakter`
        return false
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(String(value))) {
        errors.value[fieldName] = `${fieldName} format tidak valid`
        return false
      }

      // Custom validation
      if (rule.custom) {
        const result = rule.custom(value)
        if (result !== true) {
          errors.value[fieldName] =
            typeof result === 'string' ? result : `${fieldName} tidak valid`
          return false
        }
      }
    }

    delete errors.value[fieldName]
    return true
  }

  const validateForm = (formData: Record<string, any>): boolean => {
    errors.value = {}
    let isValid = true

    for (const fieldName in rules) {
      if (!validateField(fieldName, formData[fieldName])) {
        isValid = false
      }
    }

    return isValid
  }

  const clearErrors = () => {
    errors.value = {}
  }

  return {
    errors,
    validateField,
    validateForm,
    clearErrors
  }
}
