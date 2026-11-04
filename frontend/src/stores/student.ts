import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Student } from '../types'
import { useApi } from '../composables/useApi'

export const useStudentStore = defineStore('student', () => {
  const students = ref<Student[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const classFilter = ref<string>('')
  const { fetchWithAuth } = useApi()

  const fetchStudents = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await fetchWithAuth('/students')
    
    if (fetchError) {
      error.value = fetchError
    } else if (data) {
      students.value = data
    }
    loading.value = false
  }

  const filteredStudents = computed(() => {
    let filtered = students.value

    // Search filter
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        s =>
          s.name.toLowerCase().includes(query) ||
          s.niup.includes(query)
      )
    }

    // Class filter
    if (classFilter.value) {
      filtered = filtered.filter(s => s.class === classFilter.value)
    }

    return filtered
  })

  const classes = computed(() => {
    const uniqueClasses = new Set(students.value.map(s => s.class))
    return Array.from(uniqueClasses).sort()
  })

  const levels = computed(() => {
    if (!students.value) return []
    const uniqueLevels = new Set(
      students.value
        .filter(s => s && s.class)
        .map(s => s.class.split(' ')[0])
    )
    return Array.from(uniqueLevels).filter(Boolean).sort()
  })

  const majors = computed(() => {
    if (!students.value) return []
    const uniqueMajors = new Set(
      students.value
        .filter(s => s && s.class)
        .map(s => s.class.split(' ').slice(1).join(' '))
    )
    return Array.from(uniqueMajors).filter(Boolean).sort()
  })

  const getStudentById = (id: string): Student | undefined => {
    return students.value.find(s => s.id === id)
  }

  const addStudent = async (student: Omit<Student, 'id'>) => {
    loading.value = true
    const { data, error: fetchError } = await fetchWithAuth('/students', {
      method: 'POST',
      body: JSON.stringify(student)
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    if (data) {
      students.value.push(data)
    }
    loading.value = false
    return true
  }

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    loading.value = true
    const { data, error: fetchError } = await fetchWithAuth(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    if (data) {
      const index = students.value.findIndex(s => s.id === id)
      if (index !== -1) {
        students.value[index] = { ...students.value[index], ...data }
      }
    }
    loading.value = false
    return true
  }

  const deleteStudent = async (id: string) => {
    loading.value = true
    const { error: fetchError } = await fetchWithAuth(`/students/${id}`, {
      method: 'DELETE'
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    students.value = students.value.filter(s => s.id !== id)
    loading.value = false
    return true
  }

  const setSearch = (query: string) => {
    searchQuery.value = query
  }

  const setClassFilter = (classValue: string) => {
    classFilter.value = classValue
  }

  const bulkAddStudents = async (newStudents: Omit<Student, 'id'>[]) => {
    loading.value = true
    const { data, error: fetchError } = await fetchWithAuth('/students/bulk', {
      method: 'POST',
      body: JSON.stringify({ students: newStudents })
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    if (data && data.students) {
      students.value.push(...data.students)
    }
    loading.value = false
    return true
  }

  return {
    students,
    loading,
    error,
    searchQuery,
    classFilter,
    filteredStudents,
    classes,
    levels,
    majors,
    fetchStudents,
    getStudentById,
    addStudent,
    bulkAddStudents,
    updateStudent,
    deleteStudent,
    setSearch,
    setClassFilter
  }
})
