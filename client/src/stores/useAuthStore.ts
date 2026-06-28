import { create } from 'zustand' 
import { login as loginApi, register as registerApi, getMe, logout as logoutApi } from '../services/auth.service'
import type { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean 
  error: string | null
  isAuthLoading: boolean
  
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isAuthLoading: true,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await loginApi({ email, password })
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Wystąpił błąd'
      set({ error: message, isLoading: false})
      throw error
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error:null })
    try {
      const response = await registerApi({ email, password, name })
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Wystąpił błąd'
      set({ error: message, isLoading: false})
      throw error
    }
  },

  logout: () => {
    logoutApi()
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },

  checkAuth: async () => {
    set({ isAuthLoading: true })
    const token = localStorage.getItem('token')
    if(!token) {
      set({ isAuthenticated: false, isAuthLoading: false })
      return
    }

    try {
      const user = await getMe()
      set({ user, isAuthenticated: true, isAuthLoading: false })
    } catch {
      logoutApi() 
      set({ user: null, token: null, isAuthenticated: false, isAuthLoading: false })
    }
  },
  clearError: () => set({ error: null }),
}))