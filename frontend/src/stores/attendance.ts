import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AttendanceRecord } from '../types'
import { useApi } from '../composables/useApi'

export const useAttendanceStore = defineStore('attendance', () => {
  const attendances = ref<AttendanceRecord[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { fetchWithAuth } = useApi()

  const fetchAttendances = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await fetchWithAuth('/attendances')
    
    if (fetchError) {
      error.value = fetchError
    } else if (data) {
      attendances.value = data.map((a: any) => ({
        id: a.id,
        studentId: a.student_id,
        studentName: a.student_name,
        date: a.date,
        status: a.status,
        note: a.note
      }))
    }
    loading.value = false
  }

  const addAttendance = async (attendance: Omit<AttendanceRecord, 'id'>) => {
    loading.value = true
    const { data, error: fetchError } = await fetchWithAuth('/attendances', {
      method: 'POST',
      body: JSON.stringify({
        student_id: attendance.studentId,
        student_name: attendance.studentName,
        date: attendance.date,
        status: attendance.status,
        note: (attendance as any).note
      })
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    if (data) {
      attendances.value.push({
        id: data.id,
        studentId: data.student_id,
        studentName: data.student_name,
        date: data.date,
        status: data.status,
        note: data.note
      } as any)
    }
    loading.value = false
    return true
  }

  const updateAttendance = async (id: string, updates: Partial<AttendanceRecord> & { note?: string }) => {
    loading.value = true
    const backendUpdates: any = {}
    if (updates.studentId) backendUpdates.student_id = updates.studentId
    if (updates.studentName) backendUpdates.student_name = updates.studentName
    if (updates.date) backendUpdates.date = updates.date
    if (updates.status) backendUpdates.status = updates.status
    if (updates.note !== undefined) backendUpdates.note = updates.note

    const { data, error: fetchError } = await fetchWithAuth(`/attendances/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendUpdates)
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    if (data) {
      const index = attendances.value.findIndex(a => a.id === id)
      if (index !== -1) {
        attendances.value[index] = {
          id: data.id,
          studentId: data.student_id,
          studentName: data.student_name,
          date: data.date,
          status: data.status,
          note: data.note
        } as any
      }
    }
    loading.value = false
    return true
  }

  const deleteAttendance = async (id: string) => {
    loading.value = true
    const { error: fetchError } = await fetchWithAuth(`/attendances/${id}`, {
      method: 'DELETE'
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    attendances.value = attendances.value.filter(a => a.id !== id)
    loading.value = false
    return true
  }

  const saveBulkAttendance = async (records: (Omit<AttendanceRecord, 'id'> & { id?: string, note?: string })[]) => {
    loading.value = true
    let success = true
    
    for (const record of records) {
      if (record.id) {
        const result = await updateAttendance(record.id, record)
        if (!result) success = false
      } else {
        const result = await addAttendance(record as any)
        if (!result) success = false
      }
    }
    
    loading.value = false
    return success
  }

  return {
    attendances,
    loading,
    error,
    fetchAttendances,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    saveBulkAttendance
  }
})
