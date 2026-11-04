import { useAuthStore } from '../stores/auth'

export const useApi = () => {
  const baseURL = 'http://localhost:3000/api'

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const authStore = useAuthStore()
    const token = localStorage.getItem('token')

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const providedHeaders = (options.headers as Record<string, string> | undefined) ?? {}

    const headers: Record<string, string> = {
      ...defaultHeaders,
      ...providedHeaders,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${baseURL}${endpoint}`, {
        ...options,
        headers: headers as HeadersInit,
      })

      // Handle 401 Unauthorized globally
      if (response.status === 401) {
        authStore.logout()
        window.location.href = '/login'
        throw new Error('Sesi telah berakhir, silakan login kembali.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada server')
      }

      return { data, error: null }
    } catch (err: any) {
      console.error(`API Error (${endpoint}):`, err)
      return { data: null, error: err.message || 'Gagal terhubung ke server' }
    }
  }

  return { fetchWithAuth }
}
