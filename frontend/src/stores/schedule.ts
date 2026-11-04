import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Schedule } from '../types'
import { useApi } from '../composables/useApi'

export const useScheduleStore = defineStore('schedule', () => {
  const schedules = ref<Schedule[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { fetchWithAuth } = useApi()

  const fetchSchedules = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await fetchWithAuth('/schedules')
    
    if (fetchError) {
      error.value = fetchError
    } else if (data) {
      schedules.value = data.map((s: any) => ({
        id: s.id,
        class: s.class,
        time: s.time,
        subject: s.subject,
        teacher: s.teacher,
        room: s.room
      }))
    }
    loading.value = false
  }

  const addSchedule = async (schedule: Omit<Schedule, 'id'>) => {
    loading.value = true
    const { data, error: fetchError } = await fetchWithAuth('/schedules', {
      method: 'POST',
      body: JSON.stringify({
        class: schedule.class,
        time: schedule.time,
        subject: schedule.subject,
        teacher: schedule.teacher,
        room: schedule.room
      })
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    if (data) {
      schedules.value.push({
        id: data.id,
        class: data.class,
        time: data.time,
        subject: data.subject,
        teacher: data.teacher,
        room: data.room
      })
    }
    loading.value = false
    return true
  }

  const updateSchedule = async (id: string, updates: Partial<Schedule>) => {
    loading.value = true
    const backendUpdates: any = {}
    if (updates.class) backendUpdates.class = updates.class
    if (updates.time) backendUpdates.time = updates.time
    if (updates.subject) backendUpdates.subject = updates.subject
    if (updates.teacher) backendUpdates.teacher = updates.teacher
    if (updates.room) backendUpdates.room = updates.room

    const { data, error: fetchError } = await fetchWithAuth(`/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendUpdates)
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    if (data) {
      const index = schedules.value.findIndex(s => s.id === id)
      if (index !== -1) {
        schedules.value[index] = {
          id: data.id,
          class: data.class,
          time: data.time,
          subject: data.subject,
          teacher: data.teacher,
          room: data.room
        }
      }
    }
    loading.value = false
    return true
  }

  const deleteSchedule = async (id: string) => {
    loading.value = true
    const { error: fetchError } = await fetchWithAuth(`/schedules/${id}`, {
      method: 'DELETE'
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    schedules.value = schedules.value.filter(s => s.id !== id)
    loading.value = false
    return true
  }

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule
  }
})
