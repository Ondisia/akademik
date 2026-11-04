import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Announcement } from '../types'
import { useApi } from '../composables/useApi'

export const useAnnouncementStore = defineStore('announcement', () => {
  const announcements = ref<Announcement[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { fetchWithAuth } = useApi()

  const fetchAnnouncements = async () => {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await fetchWithAuth('/announcements')
    
    if (fetchError) {
      error.value = fetchError
    } else if (data) {
      announcements.value = data.map((a: any) => ({
        id: a.id,
        title: a.title,
        content: a.content,
        author: a.author,
        category: a.category,
        createdAt: a.created_at
      }))
    }
    loading.value = false
  }

  const addAnnouncement = async (announcement: Omit<Announcement, 'id'>) => {
    loading.value = true
    const { data, error: fetchError } = await fetchWithAuth('/announcements', {
      method: 'POST',
      body: JSON.stringify({
        title: announcement.title,
        content: announcement.content,
        author: announcement.author,
        category: announcement.category,
        created_at: announcement.createdAt
      })
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    if (data) {
      announcements.value.push({
        id: data.id,
        title: data.title,
        content: data.content,
        author: data.author,
        category: data.category,
        createdAt: data.created_at
      })
    }
    loading.value = false
    return true
  }

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    loading.value = true
    const backendUpdates: any = {}
    if (updates.title) backendUpdates.title = updates.title
    if (updates.content) backendUpdates.content = updates.content
    if (updates.author) backendUpdates.author = updates.author
    if (updates.category) backendUpdates.category = updates.category
    if (updates.createdAt) backendUpdates.created_at = updates.createdAt

    const { data, error: fetchError } = await fetchWithAuth(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendUpdates)
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    if (data) {
      const index = announcements.value.findIndex(a => a.id === id)
      if (index !== -1) {
        announcements.value[index] = {
          id: data.id,
          title: data.title,
          content: data.content,
          author: data.author,
          category: data.category,
          createdAt: data.created_at
        }
      }
    }
    loading.value = false
    return true
  }

  const deleteAnnouncement = async (id: string) => {
    loading.value = true
    const { error: fetchError } = await fetchWithAuth(`/announcements/${id}`, {
      method: 'DELETE'
    })
    
    if (fetchError) {
      error.value = fetchError
      loading.value = false
      return false
    }
    
    announcements.value = announcements.value.filter(a => a.id !== id)
    loading.value = false
    return true
  }

  return {
    announcements,
    loading,
    error,
    fetchAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  }
})
