import api from './api'
import type { LoginFormData, RegisterFormData, AuthResponse, User } from '@/types'

export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data)
  localStorage.setItem('token', response.data.token)
  return response.data
} 

export const register = async (data: RegisterFormData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data)
  localStorage.setItem('token', response.data.token)
  return response.data
}

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me')
  return response.data
}

export const logout = (): void => {
  localStorage.removeItem('token')
 }