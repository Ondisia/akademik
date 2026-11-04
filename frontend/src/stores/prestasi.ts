import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Prestasi } from '../types'
import { useApi } from '../composables/useApi'

export const usePrestasiStore = defineStore('prestasi', () => {
  const prestasis = ref<Prestasi[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { fetchWithAuth } = useApi()

  const fetchPrestasis = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await fetchWithAuth('/prestasi')
    
    if (fetchError) {
      error.value = fetchError
    } else if (data) {
      prestasis.value = data.map((p: any) => ({
        id: p.id,
        studentId: p.student_id,
        siswa: p.student_name,
        kelas: p.class,
        kategori: p.kategori,
        juara: p.juara,
        event: p.event,
        tahun: p.tahun
      }))
    }
    loading.value = false
  }

  const addPrestasi = async (prestasi: Omit<Prestasi, 'id'>) => {
    loading.value = true
    const { data, error: fetchError } = await fetchWithAuth('/prestasi', {
      method: 'POST',
      body: JSON.stringify({
        student_id: prestasi.studentId,
        student_name: prestasi.siswa,
        class: prestasi.kelas,
        kategori: prestasi.kategori,
        juara: prestasi.juara,
        event: prestasi.event,
        tahun: prestasi.tahun
      })
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    if (data) {
      prestasis.value.unshift({
        id: data.id,
        studentId: data.student_id,
        siswa: data.student_name,
        kelas: data.class,
        kategori: data.kategori,
        juara: data.juara,
        event: data.event,
        tahun: data.tahun
      })
    }
    loading.value = false
    return true
  }

  const updatePrestasi = async (id: string, updates: Partial<Prestasi>) => {
    loading.value = true
    const backendUpdates: any = {}
    if (updates.studentId) backendUpdates.student_id = updates.studentId
    if (updates.siswa) backendUpdates.student_name = updates.siswa
    if (updates.kelas) backendUpdates.class = updates.kelas
    if (updates.kategori) backendUpdates.kategori = updates.kategori
    if (updates.juara) backendUpdates.juara = updates.juara
    if (updates.event) backendUpdates.event = updates.event
    if (updates.tahun) backendUpdates.tahun = updates.tahun

    const { data, error: fetchError } = await fetchWithAuth(`/prestasi/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendUpdates)
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    if (data) {
      const index = prestasis.value.findIndex(p => p.id === id)
      if (index !== -1) {
        prestasis.value[index] = {
          id: data.id,
          studentId: data.student_id,
          siswa: data.student_name,
          kelas: data.class,
          kategori: data.kategori,
          juara: data.juara,
          event: data.event,
          tahun: data.tahun
        }
      }
    }
    loading.value = false
    return true
  }

  const deletePrestasi = async (id: string) => {
    loading.value = true
    const { error: fetchError } = await fetchWithAuth(`/prestasi/${id}`, {
      method: 'DELETE'
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    prestasis.value = prestasis.value.filter(p => p.id !== id)
    loading.value = false
    return true
  }

  return {
    prestasis,
    loading,
    error,
    fetchPrestasis,
    addPrestasi,
    updatePrestasi,
    deletePrestasi
  }
})
