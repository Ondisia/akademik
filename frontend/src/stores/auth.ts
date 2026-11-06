import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, UserRole } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Initialize auth from localStorage & validate with backend
  const initAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await fetch('http://localhost:3000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Token tidak valid')
        }

        const data = await response.json()
        user.value = normalizeUser(data.user)
        isAuthenticated.value = true
      } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('currentUser')
        user.value = null
        isAuthenticated.value = false
      }
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        error.value = data.message || 'Email atau password salah'
        return false
      }

      user.value = normalizeUser(data.user)
      isAuthenticated.value = true
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('currentUser', JSON.stringify(data.user))

      return true
    } catch (err) {
      error.value = 'Terjadi kesalahan saat login'
      console.error('Login error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user.value) return false
    const userRoles = user.value.roles || (user.value.role ? [user.value.role] : [])
    return roles.some((r) => userRoles.includes(r))
  }

  // Normalisasi `roles` dari backend (bisa string JSON atau array) menjadi array.
  const normalizeUser = (u: any): User => {
    if (!u) return u
    if (u.roles && typeof u.roles === 'string') {
      try {
        u.roles = JSON.parse(u.roles) as UserRole[]
      } catch {
        u.roles = u.role ? [u.role] : []
      }
    }
    if (!u.roles && u.role) u.roles = [u.role]
    return u
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    initAuth,
    login,
    logout,
    hasAnyRole
  }
})
