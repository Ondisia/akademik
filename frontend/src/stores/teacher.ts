import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Teacher } from '../types'
import { useApi } from '../composables/useApi'

export const useTeacherStore = defineStore('teacher', () => {
  const teachers = ref<Teacher[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { fetchWithAuth } = useApi()

  const fetchTeachers = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await fetchWithAuth('/teachers')
    
    if (fetchError) {
      error.value = fetchError
    } else if (data) {
      // Parse JSON strings for subjects and classes from SQLite
      teachers.value = data.map((t: any) => ({
        ...t,
        subjects: typeof t.subjects === 'string' ? JSON.parse(t.subjects) : t.subjects,
        classes: typeof t.classes === 'string' ? JSON.parse(t.classes) : t.classes
      }))
    }
    loading.value = false
  }

  const addTeacher = async (teacher: Omit<Teacher, 'id'>) => {
    loading.value = true
    const { data, error: fetchError } = await fetchWithAuth('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacher)
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    if (data) {
      data.subjects = typeof data.subjects === 'string' ? JSON.parse(data.subjects) : data.subjects
      data.classes = typeof data.classes === 'string' ? JSON.parse(data.classes) : data.classes
      teachers.value.push(data)
    }
    loading.value = false
    return true
  }

  const updateTeacher = async (id: string, updates: Partial<Teacher>) => {
    loading.value = true
    const { data, error: fetchError } = await fetchWithAuth(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    if (data) {
      const index = teachers.value.findIndex(t => t.id === id)
      if (index !== -1) {
        data.subjects = typeof data.subjects === 'string' ? JSON.parse(data.subjects) : data.subjects
        data.classes = typeof data.classes === 'string' ? JSON.parse(data.classes) : data.classes
        teachers.value[index] = data
      }
    }
    loading.value = false
    return true
  }

  const deleteTeacher = async (id: string) => {
    loading.value = true
    const { error: fetchError } = await fetchWithAuth(`/teachers/${id}`, {
      method: 'DELETE'
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    teachers.value = teachers.value.filter(t => t.id !== id)
    loading.value = false
    return true
  }

  return {
    teachers,
    loading,
    error,
    fetchTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher
  }
})
