import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ekskul } from '../types'
import { useApi } from '../composables/useApi'

export const useEkskulStore = defineStore('ekskul', () => {
  const ekskuls = ref<Ekskul[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { fetchWithAuth } = useApi()

  const fetchEkskuls = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await fetchWithAuth('/ekskul')
    
    if (fetchError) {
      error.value = fetchError
    } else if (data) {
      ekskuls.value = data
    }
    loading.value = false
  }

  const addEkskul = async (ekskul: Omit<Ekskul, 'id'>) => {
    loading.value = true
    const { data, error: fetchError } = await fetchWithAuth('/ekskul', {
      method: 'POST',
      body: JSON.stringify(ekskul)
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    if (data) {
      ekskuls.value.unshift(data)
      ekskuls.value.sort((a, b) => a.nama.localeCompare(b.nama))
    }
    loading.value = false
    return true
  }

  const updateEkskul = async (id: string, updates: Partial<Ekskul>) => {
    loading.value = true
    const { data, error: fetchError } = await fetchWithAuth(`/ekskul/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    })

    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }

    if (data) {
      const index = ekskuls.value.findIndex(e => e.id === id)
      if (index !== -1) {
        ekskuls.value[index] = { ...ekskuls.value[index], ...data }
        ekskuls.value.sort((a, b) => a.nama.localeCompare(b.nama))
      }
    }
    loading.value = false
    return true
  }

  const deleteEkskul = async (id: string) => {
    loading.value = true
    const { error: fetchError } = await fetchWithAuth(`/ekskul/${id}`, {
      method: 'DELETE'
    })

    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }

    ekskuls.value = ekskuls.value.filter(e => e.id !== id)
    loading.value = false
    return true
  }

  return {
    ekskuls,
    loading,
    error,
    fetchEkskuls,
    addEkskul,
    updateEkskul,
    deleteEkskul
  }
})
